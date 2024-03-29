import Phaser from 'phaser';
import constants from '../assets/configs/constants';
import { alignGrid } from '../assets/configs/alignGrid';
import { assetsDPR } from '../index';
export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('scoreScene');
  }

  create() {
    alignGrid.create({ scene: this, rows: 10, columns: 10 });

    this.make.image({
      key: 'background',
      x: 0,
      y: 0,
      width: this.cameras.main.width * assetsDPR * 4,
      origin: { x: 0, y: 0 },
      scale: { x: 1.5, y: 1.5 },
    });

    const container = this.rexUI.add.sizer({
      orientation: 'y',
      space: { item: 50 },
    });

    const resume = this.add
      .text(0, 0, 'Continue', {
        fontSize: `${36 * assetsDPR}px`,
        fontFamily: constants.styles.text.fontFamily,
        strokeThickness: 3,
      })
      .setInteractive()
      .on('pointerover', function () {
        this.setColor('#af111c');
        this.setStroke('#af111c');
      })
      .on('pointerout', function () {
        this.setColor('white');
      })
      .on(
        'pointerup',
        function () {
          this.scene.stop('scoreScene');
          this.sound.volume = 0.2;
          this.scene.wake('playGame');
        },
        this
      );

    container.add(resume).layout();

    alignGrid.center(container);

    this.sound.volume = 0.1;
  }
}
