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

const playerShapeKeys = ['body', 'melee', 'axe'];

class playGame extends Phaser.Scene {
  constructor() {
    super('playGame');
  }
  init({ level }) {
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
        bigTargets: 20,
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
        bigTargets: 15,
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

    alignGrid.create({ scene: this, rows: 10, columns: 10 });
    // Uncomment to see UI grid
    // alignGrid.showNumbers();
  }
  create() {
    //* Create the animations
    this.createAnimation('fly', 'ghost_warrior', 'fly', 1, 5, '.png', true, -1, 10);
    this.createAnimation('attack', 'ghost_warrior', 'Attack', 1, 11, '.png', false, 0, 40);
    this.createAnimation('idle', 'ghost_warrior', 'idle', 1, 5, '.png', true, -1, 10);
    this.createAnimation('hit', 'ghost_warrior', 'hit', 1, 6, '.png', false, 0, 20);
    this.createAnimation('death', 'ghost_warrior', 'death', 1, 8, '.png', false, 30);
    this.createAnimation('eye_twitch', 'eyeballs', 'eyeball', 1, 5, '.png', false, -1, 3);
    this.createAnimation('blood_splatter', 'blood', 'blood', 0, 29, '.png', false, 0, 30);

    this.make.image({
      key: 'background',
      x: 0,
      y: 0,
      width: this.cameras.main.width * assetsDPR * 4,
      origin: { x: 0, y: 0 },
      scale: { x: 1.5, y: 1.5 },
    });

    //* Top
    this.make
      .sprite({
        key: 'eyeballs',
        x: 0,
        y: 0,
        flipY: true,
        width: this.cameras.main.width * assetsDPR * 4,
        origin: { x: 0, y: 0 },
        scale: { x: 2.5, y: 2.5 },
      })
      .play('eye_twitch');

    //* Right
    this.make
      .sprite({
        key: 'eyeballs',
        x: this.cameras.main.width - this.cache.json.get('eyeballs').textures[0].size.h,
        y: 0,
        flipX: true,
        height: this.cameras.main.height * assetsDPR,
        rotation: -Math.PI / 2,
        origin: { x: 1, y: 0 },
        scale: { x: 3, y: 5 },
      })
      .play('eye_twitch');

    //* Bottom
    this.make
      .sprite({
        key: 'eyeballs',
        x: 0,
        y: this.cameras.main.height,
        width: this.cameras.main.width * assetsDPR,
        origin: { x: 0, y: 1 },
        scale: { x: 2.5, y: 2.5 },
      })
      .play('eye_twitch');

    //* Left
    this.make
      .sprite({
        key: 'eyeballs',
        x: this.cache.json.get('eyeballs').textures[0].size.h,
        y: 0,
        flipX: true,
        height: this.cameras.main.height * assetsDPR,
        rotation: Math.PI / 2,
        origin: { x: 0, y: 0 },
        scale: { x: 3, y: 5 },
      })
      .play('eye_twitch');

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
    this.skull = new Skull({ world: this.matter.world, x: 0, y: 0, key: 'skull', shape: this.cache.json.get('skull_shapes').skull, circleX, circleY, circleR });

    alignGrid.center(this.skull);

    //* Ghost Warrior
    var shapes = this.cache.json.get('ghost_warrior_shapes');

    this.player = new Player(this, { world: this.matter.world, x: 400, y: 150, key: 'ghost_warrior', shape: shapes.main_body });

    Phaser.Display.Align.In.Center(this.player, this.add.zone(400, 300, 800, 600));

    Phaser.Display.Align.In.TopCenter(this.player, this.skull);

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

    this.matter.world.on(
      'collisionstart',
      function (event, bodyA, bodyB) {
        this.handleCollision(bodyA, bodyB);
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
      }
    }

    while (this.accumMS >= this.hzMS) {
      this.accumMS -= this.hzMS;
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
      this.initEnemies();
      this.healthBar.restore();
      this.energyBar.restore();
      this.remainingTargets = this.levels[this.level].targets + this.levels[this.level].bigTargets;
      this.scene.launch('scoreScene');
    } else {
      this.scene.start('gameOverScene', { score: this.score, best: this.best });
    }
  }

  killEnemy(label, playerKill) {
    if (this.enemies[label]) {
      if (this.enemies[label].tween) {
        this.enemies[label].tween.remove();
      }

      if (playerKill) {
        this.enemies[label].play('blood_splatter');
        this.enemies[label].setToSleep();
        this.enemies[label].isAlive = false;
      } else {
        this.enemies[label].destroy();
        delete this.enemies[label];
      }
      this.remainingTargets -= 1;
    }
  }

  removeEnemies() {
    const keys = Object.keys(this.enemies);

    for (let i = 0; i < keys.length; i++) {
      if (this.enemies[[keys[i]]].tween) {
        this.enemies[[keys[i]]].tween.remove();
      }
      this.enemies[keys[i]].destroy();
      delete this.enemies[keys[i]];
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
      world: this.matter.world,
      x,
      y,
      key: 'demon_eye',
      label: key,
      bigEye,
    });
    this.enemies[key].body.angle = Math.atan2(y - this.skull.y, x - this.skull.x);
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
      onComplete: function () {
        this.killEnemy(key, false);
        this.lives -= 1;
        this.sound.play('skull_damaged');
        this.cameras.main.shake(200);
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

  handleCollision(bodyA, bodyB) {
    if ((bodyA.label === 'skull' && bodyB.label.length <= 5) || (playerShapeKeys.includes(bodyA.label) && playerShapeKeys.includes(bodyB.label))) return;
    //* Any eye collides with the skull
    if (bodyA.label === 'skull' && bodyB.label.length > 5 && this.enemies[bodyB.label].isAlive) {
      this.killEnemy(bodyB.label, false);
      this.lives -= 1;
      this.sound.play('skull_damaged');
      if (this.remainingTargets > 0) {
        this.cameras.main.shake(200);
        return;
      }
    }
    //* Small eye collides with the player axe
    else if (bodyA.label === 'axe' && !this.afk && this.enemies[bodyB.label].isAlive && !this.enemies[bodyB.label].bigEye && !this.player.isAttacking()) {
      this.killEnemy(bodyB.label, true);
      this.score++;
      this.scoreText.setText(`${this.score}`);
      this.sound.play('eye_kill');
    }
    //* Either eye collides with the player body
    else if (bodyA.label === 'body' && this.enemies[bodyB.label].isAlive) {
      this.healthBar.damage(this.enemies[bodyB.label].bigEye ? 90 : 35);
      this.killEnemy(bodyB.label, false);
      this.player.hit(); 
      this.checkGameOver();
    }
    //* Eye eye collides with the melee
    else if (this.player.isMelee() && this.enemies[bodyB.label].isAlive && (bodyA.label === 'axe' || bodyA.label === 'melee')) {
      this.sound.play(this.enemies[bodyB.label].bigEye ? 'big_eye_kill' : 'eye_kill');
      this.killEnemy(bodyB.label, true);
      this.score++;
      this.scoreText.setText(`${this.score}`);
    }
    if (this.remainingTargets === 0) {
      this.roundOver();
    }
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
