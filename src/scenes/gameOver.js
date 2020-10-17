import Phaser from 'phaser';
// Images
import backgroundImg from '../assets/images/background.jpg';
import constants from '../assets/configs/constants';
import { alignGrid } from '../assets/configs/alignGrid';
import { assetsDPR } from '../index';
export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('gameOverScene');
  }
  init({ score, best }) {
    this.score = score;
    this.best = best;
  }
  preload() {
    this.load.image('background', backgroundImg);

    alignGrid.create({ scene: this, rows: 10, columns: 10 });
  }
  create() {
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

    const title = this.add.text(0, 0, 'Game Over', {
      fontSize: `${36 * assetsDPR}px`,
      fontFamily: constants.styles.text.fontFamily,
      strokeThickness: 3,
    });

    const score = this.add.text(0, 0, `Score ${this.score}`, {
      fontSize: `${36 * assetsDPR}px`,
      fontFamily: constants.styles.text.fontFamily,
      strokeThickness: 3,
    });

    const bestScore = this.add.text(0, 0, `High Score ${this.best}`, {
      fontSize: `${36 * assetsDPR}px`,
      fontFamily: constants.styles.text.fontFamily,
      strokeThickness: 3,
    });

    const playButton = this.add
      .text(0, 0, `Play Again`, {
        fontSize: `${12 * assetsDPR}px`,
        fontFamily: constants.styles.text.fontFamily,
      })
      .setInteractive()
      .on('pointerover', function () {
        this.setColor('#660000');
        this.setStroke('#660000');
      })
      .on('pointerout', function () {
        this.setColor('white');
      })
      .on(
        'pointerup',
        function () {
          this.sound.play('demon_theme', {
            loop: true,
          });
          this.scene.start('playGame');
        },
        this
      );

    container.add(title).add(score).add(bestScore).add(playButton).layout();

    alignGrid.center(container);

    this.sound.stopAll();
  }
}
