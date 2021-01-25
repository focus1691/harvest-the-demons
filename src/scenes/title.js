import Phaser from 'phaser';
import constants from '../assets/configs/constants';
import { alignGrid } from '../assets/configs/alignGrid';
import { assetsDPR } from '../index';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('titleScene');
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

    const title = this.add.text(0, 0, 'Harvest the Demons', {
      fontSize: `${48 * assetsDPR}px`,
      fontFamily: constants.styles.text.fontFamily,
      stroke: '#af111c',
      strokeThickness: 10,
      color: '#af111c',
    });

    const playButton = this.add
      .text(0, 0, 'Play', {
        fontSize: `${24 * assetsDPR}px`,
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
          this.scene.start('tutorialScene');
        },
        this
      );

    container.add(title).add(playButton).layout();

    alignGrid.center(container);

    this.sound.add('demon_theme');
    this.sound.volume = 0.1;
    this.sound.play('demon_theme', {
      loop: true,
    });
  }
}
