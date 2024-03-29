import Phaser from 'phaser';
import playGame from './scenes/game';
import './css/style.css';
import preloaderScene from './scenes/preloader';
import titleScene from './scenes/title';
import scoreScene from './scenes/score';
import gameOverScene from './scenes/gameOver';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import { alignGrid } from './assets/configs/alignGrid';
import tutorialScene from './scenes/tutorial';

const roundHalf = (num) => Math.round(num * 2) / 2;
const DPR = window.devicePixelRatio;

const isMobile = () => Math.min(screen.width, screen.height) <= 480;
export const WIDTH = 640 * (isMobile() ? DPR : 4);
const HEIGHT = 360 * (isMobile() ? DPR : 4);

// will be 1, 1.5, 2, 2.5, 3, 3.5 or 4
export const assetsDPR = roundHalf(Math.min(Math.max(WIDTH / 640, 1), 4));

const config = {
  type: Phaser.AUTO,
  parent: 'harvest-the-demons',
  width: WIDTH,
  height: HEIGHT,
  dom: {
    createContainer: true,
  },
  scale: {
    mode: Phaser.DOM.FIT,
    autoCenter: Phaser.DOM.CENTER_BOTH,
  },
  scene: [preloaderScene, titleScene, tutorialScene, playGame, scoreScene, gameOverScene],
  plugins: {
    scene: [
      {
        key: 'rexUI',
        plugin: RexUIPlugin,
        mapping: 'rexUI',
        start: true,
      },
    ],
  },
};

const game = new Phaser.Game(config);
alignGrid.registerGame(game);
