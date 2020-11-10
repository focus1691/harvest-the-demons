import { assetsDPR } from '../index';

export default class Skull extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);

    this.setScale(assetsDPR / 10, assetsDPR / 10);

    this.scene.add.existing(this);
  }
  isAttacking() {
    return this.anims.currentAnim.key === 'attack';
  }
}
