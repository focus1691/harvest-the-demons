import * as Planck from 'planck-js';
// Images
import backgroundImg from '../assets/images/background.jpg';
import demonEyeImg from '../assets/images/demon-eye.png';
import soundOnImg from '../assets/images/white_soundOn.png';
import soundOffImg from '../assets/images/white_soundOff.png';
import skullImg from '../assets/images/skull.png';
//* Spritesheets
import bloodSpriteSheet from '../assets/spritesheets/blood_splatter.png';
import bloodSpriteJSON from '../assets/spritesheets/blood_splatter.json';
import eyeballsSpriteSheet from '../assets/spritesheets/eyeballs.png';
import eyeballsJSON from '../assets/spritesheets/eyeballs.json';
import ghostWarriorSpriteSheet from '../assets/spritesheets/ghost-warrior.png';
import ghostWarriorJSON from '../assets/spritesheets/ghost-warrior.json';
//* mp3
import axeSwingSound from '../assets/sound/zapsplat_warfare_weapon_axe_large_object_swing_swoosh_002.mp3';
import bigEyeKillSound from '../assets/sound/zapsplat_nature_water_pour_splatter_concrete_002_43152.mp3';
import eyeKillSound from '../assets/sound/zapsplat_impact_body_heavy_splat_squelch_guts_bones_break_13492.mp3';
import playerHitSound from '../assets/sound/horror_monster_zombie_male_groan_005.mp3';
import skullHitSound from '../assets/sound/zapsplat_horror_zombie_male_groan_growl_11766.mp3';
import scaryMusic from '../assets/sound/smartsound_CINEMATIC_HORROR_Piano_Bow_String_Broken_Low_Slow_01.mp3';
// Game Objects
import Player from '../game-objects/player';
import EnergyBar from '../game-objects/energyBar';
import Eyeball from '../game-objects/eyeball';
import HealthBar from '../game-objects/healthBar';
import Skull from '../game-objects/skull';
//* Physics
import ghostWarriorShape from '../assets/PhysicsEditor/ghost_warrior.json';
import skullShape from '../assets/PhysicsEditor/skull.json';
import { Between } from 'phaser/src/math/';
import { v4 as uuidv4 } from 'uuid';
import { assetsDPR } from '..';
import { alignGrid } from '../assets/configs/alignGrid';
//? Health Bar
import energyBarLeftFrame from '../assets/images/healthbar/blue/meter_bar_holder_left_edge_blue.png';
import energyBarLeftEdge from '../assets/images/healthbar/blue/meter_bar_left_edge_blue.png';
import energyBarMeterFrame from '../assets/images/healthbar/blue/meter_bar_holder_center-repeating_blue.png';
import energyBarMeter from '../assets/images/healthbar/blue/meter_bar_center-repeating_blue.png';
import energyBarRightEdge from '../assets/images/healthbar/blue/meter_bar_right_edge_blue.png';
import energyBarRightFrame from '../assets/images/healthbar/blue/meter_bar_holder_right_edge_blue.png';
import energyMeterBadge from '../assets/images/healthbar/blue/meter_icon_holder_blue.png';
import energyMeterIcon from '../assets/images/healthbar/icons/power.png';
//! Health Bar
import healthBarLeftFrame from '../assets/images/healthbar/red/meter_bar_holder_left_edge_red.png';
import healthBarLeftEdge from '../assets/images/healthbar/red/meter_bar_left_edge_red.png';
import healthBarMeterFrame from '../assets/images/healthbar/red/meter_bar_holder_center-repeating_red.png';
import healthBarMeter from '../assets/images/healthbar/red/meter_bar_center-repeating_red.png';
import healthBarRightEdge from '../assets/images/healthbar/red/meter_bar_right_edge_red.png';
import healthBarRightFrame from '../assets/images/healthbar/red/meter_bar_holder_right_edge_red.png';
import healthMeterBadge from '../assets/images/healthbar/red/meter_icon_holder_red.png';
import healthMeterIcon from '../assets/images/healthbar/icons/health.png';

class playGame extends Phaser.Scene {
  constructor() {
    super('playGame');
  }
  init({ level }) {
    this.gravity = {
      x: 0,
      y: 0,
    };
    this.accumMS = 0;
    this.hzMS = (1 / 60) * 1000;
    this.afk = false;
    this.level = level || 0;
    this.score = 0;
    this.lives = 5;
    this.best = localStorage.getItem('best_score') ? parseInt(localStorage.getItem('best_score'), 10) : 0;
    this.levels = [
      {
        targets: 5,
        bigTargets: 0,
        minDelay: 1000,
        maxDelay: 2000,
        duration: 4000,
      },
      {
        targets: 20,
        bigTargets: 3,
        minDelay: 1000,
        maxDelay: 2000,
        duration: 4000,
      },
      {
        targets: 0,
        bigTargets: 10,
        minDelay: 1000,
        maxDelay: 2000,
        duration: 4000,
      },
      {
        targets: 20,
        bigTargets: 3,
        minDelay: 500,
        maxDelay: 1500,
        duration: 3000,
      },
      {
        targets: 0,
        bigTargets: 5,
        minDelay: 500,
        maxDelay: 1500,
        duration: 3000,
      },
      {
        targets: 20,
        bigTargets: 3,
        minDelay: 500,
        maxDelay: 1000,
        duration: 2000,
      },
      {
        targets: 30,
        bigTargets: 0,
        minDelay: 500,
        maxDelay: 1000,
        duration: 1500,
      },
    ];
    this.enemies = {};
    this.remainingTargets = this.levels[this.level].targets + this.levels[this.level].bigTargets;
    this.contactList = [];
  }

  preload() {
    this.load.image('background', backgroundImg);
    this.load.image('demon_eye', demonEyeImg);
    this.load.image('sound_on', soundOnImg);
    this.load.image('sound_off', soundOffImg);
    this.load.image('skull', skullImg);

    // Health Bar
    this.load.image('health_bar_left_frame', healthBarLeftFrame);
    this.load.image('health_bar_left_edge', healthBarLeftEdge);
    this.load.image('health_bar_meter', healthBarMeter);
    this.load.image('health_bar_meter_frame', healthBarMeterFrame);
    this.load.image('health_bar_right_frame', healthBarRightFrame);
    this.load.image('health_bar_right_edge', healthBarRightEdge);
    this.load.image('health_bar_badge', healthMeterBadge);
    this.load.image('health_bar_icon', healthMeterIcon);

    // Energy Bar
    this.load.image('energy_bar_left_frame', energyBarLeftFrame);
    this.load.image('energy_bar_left_edge', energyBarLeftEdge);
    this.load.image('energy_bar_meter', energyBarMeter);
    this.load.image('energy_bar_meter_frame', energyBarMeterFrame);
    this.load.image('energy_bar_right_frame', energyBarRightFrame);
    this.load.image('energy_bar_right_edge', energyBarRightEdge);
    this.load.image('energy_bar_badge', energyMeterBadge);
    this.load.image('energy_bar_icon', energyMeterIcon);

    this.load.json('ghost_warrior_shapes', ghostWarriorShape);
    this.load.json('skull_shapes', skullShape);

    this.load.atlas('blood', bloodSpriteSheet, bloodSpriteJSON);
    this.load.atlas('ghost_warrior', ghostWarriorSpriteSheet, ghostWarriorJSON);
    this.load.atlas('eyeballs', eyeballsSpriteSheet, eyeballsJSON);

    this.load.audio('axe_swing', axeSwingSound);
    this.load.audio('big_eye_kill', bigEyeKillSound);
    this.load.audio('eye_kill', eyeKillSound);
    this.load.audio('player_damaged', playerHitSound);
    this.load.audio('skull_damaged', skullHitSound);
    this.load.audio('disturbing_piano_string', scaryMusic);

    alignGrid.create({ scene: this, rows: 10, columns: 10 });
    // Uncomment to see UI grid
    // alignGrid.showNumbers();
  }
  create() {
    this.world = new Planck.World(Planck.Vec2(this.gravity.x, this.gravity.y));
    this.scaleFactor = 30;

    // Planck event bindings
    this.world.on('pre-solve', (contact, oldManifold) => {
      // this.sprites.forEach((s) => s.preSolve(contact, oldManifold))
      // Object.values(this.enemies).forEach((enemy) => enemy.preSolve(contact, oldManifold));
    });
    this.world.on('post-solve', (contact, oldManifold) => {
      // this.sprites.forEach((s) => s.postSolve(contact, oldManifold))
      // Object.values(this.enemies).forEach((enemy) => enemy.preSolve(contact, oldManifold));
    });

    this.world.on('begin-contact', (contact, oldManifold) => {
      const a = contact.getFixtureA().getUserData();
      const b = contact.getFixtureB().getUserData();

      // Collision between the axe and enemy
      if ((a === 'axe' || b === 'axe') && (this.enemies[a] || this.enemies[b])) {
        const enemyKey = b === 'axe' ? a : b;

        // Conditions for the axe to kill the small eye
        if (this.enemies[enemyKey].isAlive && !this.enemies[enemyKey].bigEye && !this.player.isAttacking()) {
          let isBigEye = this.enemies[enemyKey].bigEye;
          this.killEnemy(enemyKey, false);
          this.onEnemyKilled(isBigEye);
        }
      }
      
      else if ((a === 'body' || b === 'body') && (this.enemies[a] || this.enemies[b])) {
        const enemyKey = b === 'body' ? a : b;
        if (this.enemies[enemyKey].isAlive) {
          let isBigEye = this.enemies[enemyKey].bigEye;
          this.killEnemy(enemyKey, true);
          this.onPlayerHit(isBigEye);
        }
      }

      // if ((a === 'melee' || b === 'melee') && (this.enemies[a] || this.enemies[b])) {
      //   const data = {
      //     axeSwinging: this.player.axeSwinging,
      //     labelA: a,
      //     labelB: b,
      //     lastAttack: new Date().getTime() - this.player.lastAttack.getTime(),
      //   };
      // }

      if ((a === 'melee' || b === 'melee') && (this.enemies[a] || this.enemies[b])) {
        const enemyKey = b === 'melee' ? a : b;

        if (this.enemies[enemyKey].isAlive) {
          if (!this.contactList.includes(enemyKey)) {
            this.contactList.push(enemyKey);
          }
        }
      }

      if (this.remainingTargets === 0) {
        this.roundOver();
      }
    });
    this.world.on('end-contact', (contact, oldManifold) => {});

    //* Create the animations
    this.createAnimation('fly', 'ghost_warrior', 'fly', 1, 5, '.png', true, -1, 10);
    this.createAnimation('attack', 'ghost_warrior', 'Attack', 1, 11, '.png', false, 0, 40);
    this.createAnimation('idle', 'ghost_warrior', 'idle', 1, 5, '.png', true, -1, 10);
    this.createAnimation('hit', 'ghost_warrior', 'hit', 1, 6, '.png', false, 0, 20);
    this.createAnimation('death', 'ghost_warrior', 'death', 1, 8, '.png', false, 30);
    this.createAnimation('eye_twitch', 'eyeballs', 'eyeball', 1, 5, '.png', false, 1, 3);
    this.createAnimation('blood_splatter', 'blood', 'blood', 0, 29, '.png', false, 0, 30);

    this.make.image({
      key: 'background',
      x: 0,
      y: 0,
      width: this.cameras.main.width * assetsDPR * 4,
      origin: { x: 0, y: 0 },
      scale: { x: 1.5, y: 1.5 },
    });

    //* Right
    this.rightEye = this.make.sprite({
      key: 'eyeballs',
      x: this.cameras.main.width - this.cache.json.get('eyeballs').textures[0].size.h,
      y: 100,
      flipX: true,
      height: this.cameras.main.height * assetsDPR,
      rotation: -Math.PI / 2,
      origin: { x: 1, y: 0 },
      scale: { x: 3, y: 5 },
    });

    //* Bottom
    this.bottomEye = this.make.sprite({
      key: 'eyeballs',
      x: 0,
      y: this.cameras.main.height,
      width: this.cameras.main.width * assetsDPR,
      origin: { x: 0, y: 1 },
      scale: { x: 2.5, y: 2.5 },
    });

    //* Left
    this.LeftEye = this.make.sprite({
      key: 'eyeballs',
      x: this.cache.json.get('eyeballs').textures[0].size.h,
      y: 100,
      flipX: true,
      height: this.cameras.main.height * assetsDPR,
      rotation: Math.PI / 2,
      origin: { x: 0, y: 0 },
      scale: { x: 3, y: 5 },
    });

    this.time.addEvent({ startAt: 1000, delay: 6000, callback: this.animateEyes, callbackScope: this });

    this.events.on(
      'wake',
      function () {
        this.initEnemies();
        this.time.addEvent({ startAt: 1000, delay: 6000, callback: this.animateEyes, callbackScope: this });
      },
      this
    );

    this.LeftEye.on('animationcomplete', this.eyeAnimComplete, this);

    this.healthBar = new HealthBar(this);
    this.energyBar = new EnergyBar(this);

    this.input.mouse.disableContextMenu();

    const circleX = this.game.config.width / 2;
    const circleY = this.game.config.height / 2;
    const circleR = 75 * assetsDPR;

    this.circle = new Phaser.Geom.Circle(circleX, circleY, circleR);
    this.targetLine = new Phaser.Geom.Line(circleX, circleY, circleX, circleY);

    var graphics = this.add.graphics({ fillStyle: { color: 0xff0000 } });
    graphics.fillCircleShape(this.circle);
    graphics.setAlpha(0.1);

    //* Skull
    this.skull = new Skull({ scene: this, x: 0, y: 0, key: 'skull', shapeData: this.cache.json.get('skull_shapes').skull, circleX, circleY, circleR });
    this.skull.setPosition(this.targetLine.x1, this.targetLine.y1);

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

    this.initEnemies();

    this.cameras.main.fadeIn(500);
  }

  update(time, delta) {
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

  roundOver() {
    if (this.score > this.best) {
      localStorage.setItem('best_score', this.score);
      this.best = this.score;
    }
    if (this.level < this.levels.length - 1) {
      this.scene.sleep('playGame');
      this.level += 1;
      this.removeEnemies();
      this.healthBar.restore();
      this.energyBar.restore();
      this.sound.stopByKey('disturbing_piano_string');
      this.remainingTargets = this.levels[this.level].targets + this.levels[this.level].bigTargets;
      this.scene.launch('scoreScene');
    } else {
      this.scene.start('gameOverScene', { score: this.score, best: this.best });
    }
  }

  onPlayerHit(bigEye) {
    let damageDealt = bigEye ? 90 : 35;
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

  killEnemy(label, playerGotHit) {
    if (this.enemies[label]) {
      this.enemies[label].isAlive = false;
      if (this.enemies[label].tween) {
        this.enemies[label].tween.remove();
      }

      if (!playerGotHit) {
        this.enemies[label].play('blood_splatter');
      } else {
        this.removeEnemy(label);
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
    var delay = 0;
    // Destructure Level props
    const { minDelay, maxDelay, duration, targets, bigTargets } = this.levels[this.level];

    // Setup all the enemies for this level
    if (targets === 0) {
      for (let i = 0; i < bigTargets; i++) {
        delay = this.createEnemy(delay, minDelay, maxDelay, duration, true);
      }
    } else {
      const bigEyeTime = [];
      for (let i = 0; i < bigTargets; i++) {
        bigEyeTime.push(Between(0, targets - 1));
      }
      bigEyeTime.sort(function (a, b) {
        return a - b;
      });

      for (let i = 0; i < targets; ) {
        if (bigEyeTime.length > 0 && bigEyeTime[0] === i) {
          bigEyeTime.splice(0, 1);
          delay = this.createEnemy(delay, minDelay, maxDelay, duration, true);
        } else {
          delay = this.createEnemy(delay, minDelay, maxDelay, duration, false);
          i++;
        }
      }
    }
  }

  createEnemy(delay, min, max, duration, bigEye) {
    const { x, y } = this.getEnemyPosition(Between(1, 4));
    const key = uuidv4();
    this.enemies[key] = new Eyeball({
      // world: this.matter.world,
      scene: this,
      x,
      y,
      key: 'demon_eye',
      label: key,
      bigEye,
    });
    this.enemies[key].body.setAngle(Math.atan2(y - this.skull.y, x - this.skull.x));
    delay += Between(min, max);

    this.enemies[key].tween = this.tweens.add({
      targets: this.enemies[key],
      visible: {
        from: true,
      },
      x: {
        from: x,
        to: this.skull.x,
      },
      y: {
        from: y,
        to: this.skull.y,
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
      }.bind(this),
      onComplete: function () {
        this.killEnemy(key, false);
        this.lives -= 1;
        this.sound.play('skull_damaged');
      }.bind(this),
    });
    return delay;
  }

  getEnemyPosition(position) {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;
    if (position === 1) {
      //* Top left
      return { x: Between(0, W / 2 - 75 * assetsDPR * 2), y: 0 };
    } else if (position === 2) {
      //* Top right
      return { x: Between(W / 2 + 75 * assetsDPR * 2, W), y: 0 };
    } else if (position === 3) {
      //* Left
      return { x: 0, y: Between(0, H) };
    } else if (position === 4) {
      // Right
      return { x: W, y: Between(0, H) };
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

  animateEyes() {
    this.sound.play('disturbing_piano_string');
    this.LeftEye.play('eye_twitch');
    this.rightEye.play('eye_twitch');
    this.bottomEye.play('eye_twitch');
  }

  eyeAnimComplete() {
    this.sound.stopByKey('disturbing_piano_string');
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
      return this.scene.start('gameOverScene', { score: this.score, best: this.best });
    }
  }

  isEnemyNear(source, target) {
    if (this.distanceTo(source, target) < 200) return true;
    return false;
  }

  distanceTo(source, target) {
    let dx = source.x - target.x;
    let dy = source.y - target.y;

    return Math.sqrt(dx * dx + dy * dy);
  }
}

export default playGame;
