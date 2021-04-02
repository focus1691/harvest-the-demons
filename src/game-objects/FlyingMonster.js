import { assetsDPR } from '..';
import Sprite from './sprite';

export default class Enemy extends Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key, config.label);

    this.scene = config.scene;
    this.label = config.label;
    this.colour = config.colour;
    this.isAlive = true;
    this.bigEye = config.bigEye;
    this.setAlpha(0);

    this.setFlipY(config.flip);

    let scale = this.bigEye ? 1 / (assetsDPR / 3) : 1 / assetsDPR;

    this.setScale(scale, scale);

    this.play(`${config.colour}_monster_fly`);

    this.setBody('box');
  }
}
