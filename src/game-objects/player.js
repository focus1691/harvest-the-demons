import { assetsDPR } from '../index';
import Sprite from './sprite';

export default class Player {
  constructor(scene, x, y, key, shapes) {
    this.scene = scene;

    this.lastAttack = new Date();
    this.fatigued = false;

    // this.x = config.x;
    // this.y = config.y;
    this.x = x;
    this.y = y;

    // this.left = scene.matter.add.sprite(config.x, config.y, config.key, null, { shape: config.shape, render: { sprite: { xOffset: 0.5, yOffset: 0 } } });
    // this.right = scene.matter.add.sprite(config.x, config.y, config.key, null, { shape: config.shape });
    this.left = new Sprite(scene, x, y, key);
    this.right = new Sprite(scene, x, y, key);
    this.right.flipX = true;
    // this.left.setOrigin(1, 0.5);
    // this.right.setOrigin(0.5, 0.5);

    this.left.setBody(shapes);
    this.right.setBody(shapes);

    this.right.setVisible(false);
    // this.right.setToSleep();
    this.right.body.setAwake(false);

    this.left.body.label = 'player';
    this.right.body.label = 'player';

    // this.left.body.ignoreGravity = true;
    // this.right.body.ignoreGravity = true;

    // this.left.setMass(1000);
    // this.right.setMass(1000);

    //TODO replace scale
    this.left.setScale(0.5 * assetsDPR, 0.5 * assetsDPR);
    this.right.setScale(0.5 * assetsDPR, 0.5 * assetsDPR);

    //	Just the one listener:
    this.left.on('animationupdate-attack', this.onMeleeAnimation, this);
    this.left.on('animationcomplete', this.animComplete, this);

    //TODO replace scale
    // this.scene.matter.body.scale(this.right.body, -1, 1);
    // this.scene.matter.body.setCentre(this.right.body, { x: 70, y: 150 }, false);
    // this.scene.matter.body.setCentre(this.left.body, { x: 340, y: 0 }, true);

    this.left.play('fly');
    this.right.play('fly');

    // this.scene.add.existing(this.left);
    // this.scene.add.existing(this.right);

    this.midLine = new Phaser.Geom.Line();
    this.reflectedLine = new Phaser.Geom.Line();
  }

  attack() {
    if (!this.isAttacking() && !this.fatigued) {
      this.left.play('attack');
      this.right.play('attack');
      this.scene.energyBar.deplete(20);
      this.lastAttack = new Date();
      this.fatigued = this.scene.energyBar.energy === 0;
    }
  }

  idle() {
    this.left.play('idle');
    this.right.play('idle');
  }

  hit() {
    this.left.play('hit');
    this.right.play('hit');

    this.scene.sound.play('player_damaged');
  }

  fly() {
    this.left.play('fly');
    this.right.play('fly');
  }

  update(targetLine) {
    var lineLength = Phaser.Geom.Line.Length(targetLine);
    var lineAngle = Phaser.Geom.Line.Angle(targetLine);
    var angleDeg = Phaser.Math.RadToDeg(lineAngle);

    //? Keep this
    this.left.setPosition(targetLine.x1, targetLine.y1);
    this.right.setPosition(targetLine.x1, targetLine.y1);

    this.midLine.setTo(targetLine.x1, targetLine.y1 - 500, targetLine.x1, targetLine.y1 + 500);

    var reflectAngle = Phaser.Geom.Line.ReflectAngle(targetLine, this.midLine);

    var length = Phaser.Geom.Line.Length(targetLine);

    Phaser.Geom.Line.SetToAngle(this.reflectedLine, targetLine.x1, targetLine.y1, reflectAngle, length);

    var rightQuadrant = angleDeg < 90 && angleDeg > -90;
    var leftQuadrant = !rightQuadrant;
    var merging = 0;

    if (rightQuadrant) {
      if (angleDeg > 70) {
        //	Merging bottom right
        merging = 1;

        // this.right.setRotation(Phaser.Math.DegToRad(70) + (Phaser.Math.DegToRad(70) - lineAngle));
        // this.right.body.setAngle(Phaser.Math.RadToDeg(Phaser.Math.DegToRad(70) + (Phaser.Math.DegToRad(70) - lineAngle)));
        this.right.body.setAngle(Phaser.Math.DegToRad(70) + (Phaser.Math.DegToRad(70) - lineAngle));

        this.left.setVisible(true);
        this.right.setVisible(false);

        // this.left.setAwake();
        // this.right.setToSleep();
        this.left.body.setAwake(true);
        this.right.body.setAwake(false);
      } else {
        // this.right.setRotation(lineAngle);
        // this.right.body.setAngle(angleDeg);
        this.right.body.setAngle(lineAngle);

        this.left.setVisible(false);
        this.right.setVisible(true);

        // this.left.setToSleep();
        // this.right.setAwake();
        this.left.body.setAwake(false);
        this.right.body.setAwake(true);
      }
    } else if (leftQuadrant) {
      if (angleDeg >= 90 && angleDeg < 110) {
        //	Merging bottom left
        merging = 2;

        // this.right.setRotation(Phaser.Math.DegToRad(70) + (Phaser.Math.DegToRad(70) - lineAngle));
        // this.right.body.setAngle(Phaser.Math.RadToDeg(Phaser.Math.DegToRad(70) + (Phaser.Math.DegToRad(70) - lineAngle)));
        this.right.body.setAngle(Phaser.Math.DegToRad(70) + (Phaser.Math.DegToRad(70) - lineAngle));

        this.left.setVisible(true);
        this.right.setVisible(false);

        // this.left.setAwake();
        // this.right.setToSleep();
        this.left.body.setAwake(true);
        this.right.body.setAwake(false);
      } else if (angleDeg < 0 && angleDeg > -120) {
        //	Merging top left
        merging = 3;

        // this.right.setRotation(lineAngle);
        // this.right.body.setAngle(angleDeg);
        this.right.body.setAngle(lineAngle);

        this.left.setVisible(false);
        this.right.setVisible(true);

        // this.left.setToSleep();
        // this.right.setAwake();
        this.left.body.setAwake(false);
        this.right.body.setAwake(true);
      } else {
        // this.right.setRotation(reflectAngle - Phaser.Math.DegToRad(30));
        // this.right.body.setAngle(Phaser.Math.RadToDeg(reflectAngle - Phaser.Math.DegToRad(30)));
        this.right.body.setAngle(reflectAngle - Phaser.Math.DegToRad(30));

        this.left.setVisible(true);
        this.right.setVisible(false);

        // this.left.setAwake();
        // this.right.setToSleep();
        this.left.body.setAwake(true);
        this.right.body.setAwake(false);
      }
    }

    // this.left.setRotation(-this.right.rotation);
    // this.left.body.setAngle(Phaser.Math.RadToDeg(-this.right.rotation));
    // this.left.body.setAngle(-this.right.body.angle);
    this.left.body.setAngle(-this.right.rotation);

    let timeSinceLastAttack = new Date().getTime() - this.lastAttack.getTime();
    if (this.fatigued) {
      this.fatigued = timeSinceLastAttack < 3000;
    }
	  if (!this.fatigued && this.scene.energyBar.energy < 100 && timeSinceLastAttack > 2000) {
      this.scene.energyBar.restore(); 
    }
  }

  onMeleeAnimation(animation, animationFrame) {
    const { index } = animationFrame;

    if (index === 8) this.scene.sound.play('axe_swing');
  }

  animComplete(animation, frame) {
    this.left.play('fly');
    this.right.play('fly');
  }

  isAttacking() {
    const { key } = this.left.anims.currentAnim;

    return key === 'attack' || key === 'hit';
  }

  isMelee() {
    return Boolean(this.left.anims.currentFrame.textureFrame.match(/attack[6-9]|attack1[01]/gi));
  }
}
