import { assetsDPR } from '..';
import Sprite from './sprite';

export default class Enemy extends Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key, config.label);

    this.scene = config.scene;
    this.label = config.label;
    this.isAlive = true;
    this.bigEye = config.bigEye;

    let scale = this.bigEye ? 1 / (assetsDPR / 3) : 1 / assetsDPR;

    this.setScale(scale, scale);

    this.setBody('box');
    this.drawDebug();

    this.on('animationcomplete', this.onBloodSplatterEnd, this);
  }

  onBloodSplatterEnd() {
    this.body.setActive(false);
  }
}
