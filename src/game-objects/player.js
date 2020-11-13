import { assetsDPR } from '../index';
import Sprite from './sprite';

export default class Player {
  constructor(scene, x, y, key, shapes) {
    this.scene = scene;

    this.lastAttack = new Date();
    this.fatigued = false;

    this.x = x;
    this.y = y;

    this.left = new Sprite(scene, x, y, key);
    this.right = new Sprite(scene, x, y, key);
    this.right.flipX = true;

    this.left.setBody(shapes);
    this.right.setBody(shapes);

    this.right.setVisible(false);
    this.right.body.setAwake(false);

    this.left.body.label = 'player';
    this.right.body.label = 'player';

    this.left.setScale(0.5 * assetsDPR, 0.5 * assetsDPR);
    this.right.setScale(0.5 * assetsDPR, 0.5 * assetsDPR);

    //	Just the one listener:
    this.left.on('animationupdate-attack', this.onMeleeAnimation, this);
    this.left.on('animationcomplete', this.animComplete, this);

    this.left.play('fly');
    this.right.play('fly');

    this.midLine = new Phaser.Geom.Line();
    this.reflectedLine = new Phaser.Geom.Line();

    this.axeSwinging = false;
  }

  attack() {
    if (!this.isAttacking() && !this.fatigued) {
      this.lastAttack = new Date();
      this.left.play('attack');
      this.right.play('attack');
      this.scene.energyBar.deplete(15);
      this.fatigued = this.scene.energyBar.energy === 0;
      this.scene.sound.play('axe_swing');
    }
  }

  stop() {
    this.left.anims.stop();
    this.right.anims.stop();
    this.axeSwinging = false;
  }

  idle() {
    this.left.play('idle');
    this.right.play('idle');
    this.axeSwinging = false;
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

        this.right.body.setAngle(Phaser.Math.DegToRad(70) + (Phaser.Math.DegToRad(70) - lineAngle));

        this.left.setVisible(true);
        this.right.setVisible(false);

        this.left.body.setAwake(true);
        this.right.body.setAwake(false);
      } else {
        this.right.body.setAngle(lineAngle);

        this.left.setVisible(false);
        this.right.setVisible(true);

        this.left.body.setAwake(false);
        this.right.body.setAwake(true);
      }
    } else if (leftQuadrant) {
      if (angleDeg >= 90 && angleDeg < 110) {
        //	Merging bottom left
        merging = 2;

        this.right.body.setAngle(Phaser.Math.DegToRad(70) + (Phaser.Math.DegToRad(70) - lineAngle));

        this.left.setVisible(true);
        this.right.setVisible(false);

        this.left.body.setAwake(true);
        this.right.body.setAwake(false);
      } else if (angleDeg < 0 && angleDeg > -120) {
        //	Merging top left
        merging = 3;

        this.right.body.setAngle(lineAngle);

        this.left.setVisible(false);
        this.right.setVisible(true);

        this.left.body.setAwake(false);
        this.right.body.setAwake(true);
      } else {
        this.right.body.setAngle(reflectAngle - Phaser.Math.DegToRad(30));

        this.left.setVisible(true);
        this.right.setVisible(false);

        this.left.body.setAwake(true);
        this.right.body.setAwake(false);
      }
    }

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

    if (index > 8) {
      for (let i = 0; i < this.scene.meleeContactList.length; i++) {
        let key = this.scene.meleeContactList[i];
        if (this.scene.enemies[key]) {
          let isBigEye = this.scene.enemies[key].bigEye;
          this.scene.killEnemy({
            key,
            isPlayerHit: false,
            meleeKill: true,
          });
          this.scene.onEnemyKilled(isBigEye);
        }
      }
      this.scene.meleeContactList = [];
      
      if (index === 8) {
        this.axeSwinging = true;
        this.scene.sound.play('axe_swing');
      }
      if (index === 11) {
        this.axeSwinging = false;
      }      
    }
  }

  animComplete(animation, frame) {
    this.left.play('fly');
    this.right.play('fly');
  }

  isAttacking() {
    const { key } = this.left.anims.currentAnim;

    return key === 'attack' || key === 'hit';
  }
}
