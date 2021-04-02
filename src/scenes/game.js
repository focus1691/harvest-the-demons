import * as Planck from 'planck-js';
// Game Objects
import Player from '../game-objects/player';
import EnergyBar from '../game-objects/energyBar';
import FlyingMonster from '../game-objects/FlyingMonster';
import HealthBar from '../game-objects/healthBar';
import Portal from '../game-objects/Portal';

import { Between } from 'phaser/src/math/';
import { v4 as uuidv4 } from 'uuid';
import { assetsDPR } from '..';
import { alignGrid } from '../assets/configs/alignGrid';

//* Utils
import { shuffle } from '../utils/math';

//* Constants
import {
  WORLD_SCALE_FACTOR,
  BLOOD_SPLATTER_DELAY,
  ROUND_END_HANG_TIME,
  FASTEST_ENEMY_MIN,
  FASTEST_ENEMY_MAX,
  FASTEST_ENEMY_SPEED,
  SUPER_SONIC_MIN,
  SUPER_SONIC_MAX,
  SUPER_SONIC_SPEED,
  SWARM_DELAY_MIN,
  SWARM_DELAY_MAX,
  SWARM_SPEED,
  N_SUPER_SONIC,
  N_ENEMIES_SWARM,
  N_SMALL_TARGETS,
  BIG_TARGETS,
  SONIC_TARGETS,
  N_SWARMS,
  N_LOCATIONS,
  ENEMY_DAMAGE,
  BIG_ENEMY_DAMAGE,
} from '../constants';

import { gameState } from '../state/gameState';

const colours = ['black', 'blue', 'green', 'grey', 'red', 'yellow'];

class playGame extends Phaser.Scene {
  constructor() {
    super('playGame');
  }
  init({ level }) {
    this.gravity = {
      x: 0,
      y: 0,
    };
    this.meleeKills = 0;
    this.axeKills = 0;
    this.accumMS = 0;
    this.hzMS = (1 / 60) * 1000;
    this.afk = false;
    this.level = 50 || 0;
    this.gameOver = false;
    this.score = 0;
    this.best = localStorage.getItem('best_score') ? parseInt(localStorage.getItem('best_score'), 10) : 0;
    this.levels = [
      {
        smallTargets: 20,
        bigTargets: 3,
        minDelay: 500,
        maxDelay: 1500,
        duration: 3000,
      },
      {
        smallTargets: 0,
        bigTargets: 5,
        minDelay: 500,
        maxDelay: 1500,
        duration: 3000,
      },
      {
        smallTargets: 20,
        bigTargets: 3,
        minDelay: 500,
        maxDelay: 1000,
        duration: 2000,
      },
      {
        smallTargets: 30,
        bigTargets: 0,
        minDelay: FASTEST_ENEMY_MIN,
        maxDelay: FASTEST_ENEMY_MAX,
        duration: FASTEST_ENEMY_SPEED,
      },
    ];
    this.enemies = {};
    // this.remainingTargets = this.levels[this.level].smallTargets + this.levels[this.level].bigTargets;
    this.hitList = [];
    this.meleeContactList = [];
  }

  create() {
    alignGrid.create({ scene: this, rows: 10, columns: 10 });
    // Uncomment to see UI grid
    // alignGrid.showNumbers();

    this.world = new Planck.World(Planck.Vec2(this.gravity.x, this.gravity.y));
    this.scaleFactor = WORLD_SCALE_FACTOR;

    // Planck event bindings
    this.world.on('pre-solve', (contact, oldManifold) => {});
    this.world.on('post-solve', (contact, oldManifold) => {});

    this.world.on('begin-contact', (contact, oldManifold) => {
      const a = contact.getFixtureA().getUserData();
      const b = contact.getFixtureB().getUserData();

      // Collision between the axe and enemy
      if ((a === 'axe' || b === 'axe') && (this.enemies[a] || this.enemies[b])) {
        const enemyKey = b === 'axe' ? a : b;

        // Conditions for the axe to kill the small eye
        if (this.enemies[enemyKey].isAlive && !this.enemies[enemyKey].bigEye && !this.player.isAttacking()) {
          let isBigEye = this.enemies[enemyKey].bigEye;
          this.killEnemy({
            key: enemyKey,
            isPlayerHit: false,
            meleeKill: false,
          });
          this.axeKills++;
          this.onEnemyKilled(isBigEye);
        }
      } else if ((a === 'body' || b === 'body') && (this.enemies[a] || this.enemies[b])) {
        const enemyKey = b === 'body' ? a : b;
        if (this.enemies[enemyKey].isAlive) {
          let isBigEye = this.enemies[enemyKey].bigEye;
          this.killEnemy({
            key: enemyKey,
            isPlayerHit: true,
            meleeKill: false,
          });
          this.onPlayerHit(isBigEye);
        }
      }

      if ((a === 'melee' || b === 'melee') && (this.enemies[a] || this.enemies[b])) {
        const enemyKey = b === 'melee' ? a : b;

        if (this.enemies[enemyKey].isAlive) {
          let timeSinceLastAttack = new Date().getTime() - this.player.lastAttack.getTime();

          if (this.player.axeSwinging || (timeSinceLastAttack < 400 && timeSinceLastAttack > 16)) {
            let isBigEye = this.enemies[enemyKey].bigEye;
            this.killEnemy({
              key: enemyKey,
              isPlayerHit: false,
              meleeKill: true,
            });
            this.meleeKills++;
            this.onEnemyKilled(isBigEye);
          } else if (!this.meleeContactList.includes(enemyKey)) {
            this.meleeContactList.push(enemyKey);
          }
        }
      }
    });
    this.world.on('end-contact', (contact, oldManifold) => {});

    //* Ghost Warrior animations
    this.createAnimation('fly', 'ghost_warrior', 'fly', 1, 5, '.png', true, -1, 10, 0);
    this.createAnimation('attack', 'ghost_warrior', 'Attack', 1, 11, '.png', false, 0, 40, 0);
    this.createAnimation('idle', 'ghost_warrior', 'idle', 1, 5, '.png', true, -1, 10, 0);
    this.createAnimation('hit', 'ghost_warrior', 'hit', 1, 6, '.png', false, 0, 20, 0);
    this.createAnimation('death', 'ghost_warrior', 'death', 1, 8, '.png', false, 30, 0);

    //* Monster animations
    this.createAnimation('blue_monster_fly', 'blue_monster', 'flying_monster_blue_flying_', 0, 11, '.png', true, -1, 10);
    this.createAnimation('black_monster_fly', 'black_monster', 'flying_monster_black_flying_', 0, 11, '.png', true, -1, 10);
    this.createAnimation('green_monster_fly', 'green_monster', 'flying_monster_green_flying_', 0, 11, '.png', true, -1, 10);
    this.createAnimation('red_monster_fly', 'red_monster', 'flying_monster_red_flying_', 0, 11, '.png', true, -1, 10);
    this.createAnimation('yellow_monster_fly', 'yellow_monster', 'flying_monster_yellow_flying_', 0, 11, '.png', true, -1, 10);
    this.createAnimation('grey_monster_fly', 'grey_monster', 'flying_monster_grey_flying_', 0, 11, '.png', true, -1, 10);

    this.createAnimation('blue_monster_die', 'blue_monster', 'flying_monster_blue_die_', 0, 3, '.png', true, 0, 10);
    this.createAnimation('black_monster_die', 'black_monster', 'flying_monster_black_die_', 0, 3, '.png', true, 0, 10);
    this.createAnimation('green_monster_die', 'green_monster', 'flying_monster_green_die_', 0, 3, '.png', true, 0, 10);
    this.createAnimation('red_monster_die', 'red_monster', 'flying_monster_red_die_', 0, 3, '.png', true, 0, 10);
    this.createAnimation('yellow_monster_die', 'yellow_monster', 'flying_monster_yellow_die_', 0, 3, '.png', true, 0, 10);
    this.createAnimation('grey_monster_die', 'grey_monster', 'flying_monster_grey_die_', 0, 3, '.png', true, 0, 20);

    this.createAnimation('blood_splatter', 'blood', 'blood', 0, 29, '.png', false, 0, 75, 0);

    this.createAnimation('portal_lava_fall', 'portal_lava', '__red_hell_portal_horns_lava_', 0, 14, '.png', true, -1, 15);

    this.make.image({
      key: 'background',
      x: 0,
      y: 0,
      width: this.cameras.main.width * assetsDPR * 4,
      origin: { x: 0, y: 0 },
      scale: { x: 1.5, y: 1.5 },
    });

    this.events.on(
      'wake',
      function () {
        if (this.gameOver) {
          if (this.level < this.levels.length - 1) {
            this.level += 1;
            this.remainingTargets = this.levels[this.level].smallTargets + this.levels[this.level].bigTargets;
          }
          this.initEnemies();
          this.gameOver = false;
        }
      },
      this
    );

    this.healthBar = new HealthBar(this);
    this.energyBar = new EnergyBar(this);

    this.input.mouse.disableContextMenu();

    const circleX = this.game.config.width / 2;
    const circleY = this.game.config.height / 2;
    const circleR = 75 * assetsDPR;

    this.circle = new Phaser.Geom.Circle(circleX, circleY, circleR);
    this.targetLine = new Phaser.Geom.Line(circleX, circleY, circleX, circleY);

    //* Portal
    this.portal = new Portal({ scene: this, x: 0, y: 0, key: 'portal' });
    this.portal.setPosition(this.targetLine.x1, this.targetLine.y1);
    this.portal.play('portal_lava_fall');

    //* Ghost Warrior
    var shapes = this.cache.json.get('ghost_warrior_shapes');

    this.player = new Player(this, 0, 0, 'ghost_warrior', shapes.main_body);

    this.scoreText = this.make.text({
      x: 0,
      y: 0,
      text: `${this.score}`,
      style: { fontSize: 16 * assetsDPR, strokeThickness: 3 },
      origin: { x: 1, y: 0.5 },
    });

    alignGrid.placeAtIndex(4, this.scoreText);

    //* Sound Effects
    this.soundOn = this.make
      .image({
        key: 'sound_on',
        x: this.game.config.width,
        y: 100,
        scale: { x: 0.5, y: 0.5 },
        origin: { x: 1, y: 1 },
      })
      .setInteractive();

    this.soundOff = this.make
      .image({
        key: 'sound_off',
        x: this.game.config.width,
        y: 100,
        scale: { x: 0.5, y: 0.5 },
        origin: { x: 1, y: 1 },
      })
      .setInteractive();

    this.soundOn.on('pointerdown', this.onToggleSound, this);
    this.soundOff.on('pointerdown', this.onToggleSound, this);

    this.sound.volume = 0.2;

    this.input.on(
      'pointerdown',
      function (pointer) {
        if (pointer.leftButtonDown()) {
          this.player.stop();
          this.player.attack();
        }
      },
      this
    );

    this.input.on(
      'gameout',
      function () {
        this.player.idle();
        this.afk = true;
      },
      this
    );

    this.input.on(
      'gameover',
      function () {
        this.player.fly();
        this.afk = false;
      },
      this
    );

    this.cameras.main.fadeIn(500);

    this.initEnemies();
  }

  update(time, delta) {
    if (this.remainingTargets <= 0 && !this.gameOver) {
      this.gameOver = true;
      this.endLevel();
    }

    if (!this.gameOver) {
      this.accumMS += delta;
      if (this.accumMS >= this.hzMS) {
        if (!this.player.isAttacking() && !this.afk) {
          //  Project a line from the center of the circle to the pointer
          this.targetLine.x2 = this.input.activePointer.worldX;
          this.targetLine.y2 = this.input.activePointer.worldY;

          this.player.update(this.targetLine);

          // this.player.left.drawDebug();
          // this.player.right.drawDebug();
        }
      }

      while (this.accumMS >= this.hzMS) {
        this.accumMS -= this.hzMS;
        this.world.step(1 / 30);
        this.world.clearForces();
      }
    }
  }

  endLevel() {
    if (this.score > this.best) {
      localStorage.setItem('best_score', this.score);
      this.best = this.score;
    }

    this.updateKillCounter();

    this.removeEnemies();
    this.healthBar.restore();
    this.energyBar.restore();
    this.sound.stopByKey('disturbing_piano_string');
    this.time.addEvent({ delay: ROUND_END_HANG_TIME, callback: this.showScoreboard, callbackScope: this, repeat: 0 });
  }

  showScoreboard() {
    this.scene.sleep('playGame');
    this.scene.launch('scoreScene');
  }

  onPlayerHit(bigEye) {
    let damageDealt = bigEye ? BIG_ENEMY_DAMAGE : ENEMY_DAMAGE;
    this.healthBar.damage(damageDealt);
    this.player.hit();
    this.checkGameOver();
  }

  onEnemyKilled(bigEye) {
    let deathSound = bigEye ? 'big_eye_kill' : 'eye_kill';
    this.sound.play(deathSound);
    this.score++;
    this.scoreText.setText(`${this.score}`);
  }

  killEnemy({ key, isPlayerHit, meleeKill }) {
    if (this.enemies[key]) {
      this.enemies[key].isAlive = false;
      if (this.enemies[key].tween) {
        this.enemies[key].tween.remove();
      }

      if (!isPlayerHit) {
        this.enemies[key].anims.stop();
        this.enemies[key].play(`${this.enemies[key].colour}_monster_die`);
        this.world.destroyBody(this.enemies[key].body);
        if (meleeKill) {
          this.enemies[key].play('blood_splatter');
        } else {
          this.time.addEvent({
            delay: BLOOD_SPLATTER_DELAY,
            callback: function () {
              if (this.enemies[key]) {
                this.enemies[key].play('blood_splatter');
              }
            },
            callbackScope: this,
            repeat: 0,
          });
        }
      } else {
        this.removeEnemy(key);
      }
      this.remainingTargets -= 1;
    }
  }

  removeEnemy(key) {
    if (this.enemies[key].tween) {
      this.enemies[key].tween.remove();
    }

    this.world.destroyBody(this.enemies[key].body);
    this.enemies[key].destroy();
    delete this.enemies[key];
  }

  removeEnemies() {
    const keys = Object.keys(this.enemies);

    for (let i = 0; i < keys.length; i++) {
      this.removeEnemy(keys[i]);
    }
  }

  initEnemies() {
    if (!this.levels[this.level]) {
      const { enemies, nEnemies } = this.generateMixedEnemies();
      this.remainingTargets = nEnemies;
      this.initLvlMixedEnemies(enemies);
    }
    //* In-built levels 1 - 4
    else if (this.levels[this.level].smallTargets === 0) {
      this.initLvlBigTargetsOnly(this.levels[this.level]);
    } else {
      this.initLvlSmallAndBigTargets(this.levels[this.level]);
    }
  }
  generateMixedEnemies() {
    const smallTargets = new Array(N_SMALL_TARGETS).fill('small');
    const bigTargets = new Array(BIG_TARGETS).fill('big');
    const swarms = new Array(N_SWARMS).fill('swarm');
    const superSonicTargets = new Array(SONIC_TARGETS).fill('sonic');

    let enemies = shuffle(smallTargets.concat(bigTargets).concat(swarms).concat(superSonicTargets));
    const nEnemies = smallTargets.length + bigTargets.length + superSonicTargets.length * N_SUPER_SONIC + swarms.length * N_ENEMIES_SWARM;

    return { nEnemies, enemies };
  }

  initLvlMixedEnemies(enemies) {
    var delay = 0;
    let currLocation = Between(1, N_LOCATIONS);
    let prevLocation = null;

    const W = this.cameras.main.width;

    for (let i = 0; i < enemies.length; i++) {
      if (enemies[i] === 'small' || enemies[i] === 'big' || enemies[i] === 'sonic') {
        const isBigEye = enemies[i] === 'big';
        const isSuperFast = enemies[i] === 'sonic';
        //* Change location if same spot as prev
        while (currLocation === prevLocation) {
          currLocation = Between(1, N_LOCATIONS);
        }
        delay += Between(isSuperFast ? SUPER_SONIC_MIN : FASTEST_ENEMY_MIN, isSuperFast ? SUPER_SONIC_MAX : FASTEST_ENEMY_MAX);
        const speed = isSuperFast ? SUPER_SONIC_SPEED : FASTEST_ENEMY_SPEED;
        let { x, y } = this.generateRandomEnemyCoordinates(currLocation);

        const nTargets = isSuperFast ? N_SUPER_SONIC : 1;
        for (let i = 0; i < nTargets; i++) {
          this.createEnemy(delay + 100 * i, speed, isBigEye, x, y);
        }
        prevLocation = currLocation;
      } else if (enemies[i] === 'swarm') {
        const isBigEye = false;
        const space = W / N_ENEMIES_SWARM;
        delay += Between(SWARM_DELAY_MIN, SWARM_DELAY_MAX) + SWARM_SPEED;
        const location = Between(1, 2);

        for (let i = 0; i < N_ENEMIES_SWARM; i++) {
          let x = i * space;
          let y = i * space;
          if (location === 1) {
            this.createEnemy(delay + i * 40, SWARM_SPEED, isBigEye, 0, y);
          } else {
            this.createEnemy(delay + i * 40, SWARM_SPEED, isBigEye, W, y);
          }
        }
      }
    }
  }

  initLvlBigTargetsOnly({ bigTargets, minDelay, maxDelay, duration }) {
    var delay = 0;
    let currLocation = Between(1, N_LOCATIONS);
    let prevLocation = null;

    for (let i = 0; i < bigTargets; i++) {
      while (currLocation === prevLocation) {
        currLocation = Between(1, N_LOCATIONS);
      }
      delay += Between(minDelay, maxDelay);
      const { x, y } = this.generateRandomEnemyCoordinates(currLocation);
      this.createEnemy(delay, duration, true, x, y);
      prevLocation = currLocation;
    }
  }

  initLvlSmallAndBigTargets({ smallTargets, bigTargets, minDelay, maxDelay, duration }) {
    var delay = 0;
    let currLocation = Between(1, N_LOCATIONS);
    let prevLocation = null;
    const bigEnemySpawnOrder = [];

    for (let i = 0; i < bigTargets; i++) {
      bigEnemySpawnOrder.push(Between(0, smallTargets - 1));
    }
    bigEnemySpawnOrder.sort(function (a, b) {
      return a - b;
    });

    for (let i = 0; i < smallTargets; ) {
      let isBigEye = bigEnemySpawnOrder.length > 0 && bigEnemySpawnOrder[0] === i;

      while (currLocation === prevLocation) {
        currLocation = Between(1, N_LOCATIONS);
      }
      delay += Between(minDelay, maxDelay);
      const { x, y } = this.generateRandomEnemyCoordinates(currLocation);
      this.createEnemy(delay, duration, isBigEye, x, y);
      prevLocation = currLocation;

      if (isBigEye) bigEnemySpawnOrder.shift();
      else i++;
    }
  }

  initEnemySwarm() {}

  createEnemy(delay, duration, bigEye, x, y) {
    const key = uuidv4();
    const colour = colours[Math.floor(Math.random() * 6 - 0)]; // random colour
    this.enemies[key] = new FlyingMonster({
      scene: this,
      x,
      y,
      key: `${colour}_monster`,
      label: key,
      bigEye,
      colour,
      flip: x < this.portal.x,
    });
    this.enemies[key].body.setAngle(Math.atan2(y - this.portal.y, x - this.portal.x));

    this.enemies[key].tween = this.tweens.add({
      targets: this.enemies[key],
      visible: {
        from: true,
      },
      x: {
        from: x,
        to: this.portal.x,
      },
      y: {
        from: y,
        to: this.portal.y,
      },
      alpha: {
        start: 0,
        from: 0,
        to: 1,
      },
      delay,
      duration,
      onUpdate: function () {
        this.enemies[key].setPosition(this.enemies[key].x, this.enemies[key].y);
        // this.enemies[key].drawDebug();
      }.bind(this),
      onComplete: function () {
        this.killEnemy({
          key,
          isPlayerHit: false,
          meleeKill: false,
        });
        this.sound.play('portal_damaged');
        this.scene.start('gameOverScene', { score: this.score, best: this.best });
      }.bind(this),
    });
  }

  generateRandomEnemyCoordinates(position) {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;
    if (position === 1) {
      //* Top left
      return {
        x: Between(0, W / 2 - 75 * assetsDPR * 2),
        y: 0,
      };
    } else if (position === 2) {
      //* Top right
      return {
        x: Between(W / 2 + 75 * assetsDPR * 2, W),
        y: 0,
      };
    } else if (position === 3) {
      //* Left
      return {
        x: 0,
        y: Between(0, H),
      };
    } else if (position === 4) {
      // Right
      return {
        x: W,
        y: Between(0, H),
      };
    }
    return { x: Between(0, W / 2 - 75 * assetsDPR * 2), y: 0 };
  }

  createAnimation(key, name, prefix, start, end, suffix, yoyo, repeat, frameRate) {
    this.anims.create({
      key: key,
      frames: this.anims.generateFrameNames(name, {
        prefix,
        start,
        end,
        suffix,
      }),
      frameRate,
      yoyo,
      repeat,
    });
  }

  onToggleSound(pointer, x, y, e) {
    e.stopPropagation();
    if (this.soundOn.active) {
      this.soundOn.setActive(false).setVisible(false);
      this.soundOff.setActive(true).setVisible(true);
      this.sound.volume = 0;
    } else if (this.soundOff.active) {
      this.soundOff.setActive(false).setVisible(false);
      this.soundOn.setActive(true).setVisible(true);
      this.sound.volume = 0.5;
    }
  }

  checkGameOver() {
    if (this.healthBar.health <= 0) {
      this.healthBar.restore();
      this.updateKillCounter();
      return this.scene.start('gameOverScene', { score: this.score, best: this.best });
    }
  }

  // Update current game state
  // Update future game state (local storage)
  updateKillCounter() {
    let totalMeleeKills = this.meleeKills + gameState.totalMeleeKills;
    let totalAxeKills = this.axeKills + gameState.totalMeleeKills;

    gameState.commit('totalMeleeKills', totalMeleeKills);
    gameState.commit('totalAxeKills', totalAxeKills);

    if (totalAxeKills > gameState.checkForTutorial) localStorage.setItem('axe_tutorial_shown', true);

    if (totalMeleeKills > gameState.checkForTutorial) localStorage.setItem('melee_tutorial_shown', true);
  }

  showAxeTutorial() {
    return gameState.totalAxeKills < gameState.checkForTutorial && !gameState.axeTutorialDismissed;
  }

  showMeleeTutorial() {
    return gameState._totalMeleeKills < gameState.checkForTutorial && !gameState.meleeTutorialDismissed;
  }
}

export default playGame;
