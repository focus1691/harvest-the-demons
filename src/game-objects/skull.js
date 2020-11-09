import { assetsDPR } from '../index';
import Sprite from './sprite';

// export default class Skull extends Phaser.Physics.Matter.Sprite {
//   constructor(config) {
//     super(config.world, config.x, config.y, config.key, null, { shape: config.shape });

//     this.body.label = 'skull';
//     this.body.ignoreGravity = true;
//     this.body.immovable = true;

//     this.setMass(1000);

//     this.setScale(assetsDPR / 10, assetsDPR / 10);

//     this.scene.add.existing(this);
//   }
//   isAttacking() {
//     return this.anims.currentAnim.key === 'attack';
//   }
// }


// export default class Skull extends Sprite {
//   constructor(config) {
//     super(config.scene, config.x, config.y, config.key);

//     this.setBody(config.shapeData);
//     this.body.setStatic(true);
//     this.body.setAwake(false);

//     // this.body.label = 'skull';
//     // this.body.ignoreGravity = true;
//     // this.body.immovable = true;

//     // this.setMass(1000);

//     this.setScale(assetsDPR / 10, assetsDPR / 10);

//     this.scene.add.existing(this);
//   }
//   isAttacking() {
//     return this.anims.currentAnim.key === 'attack';
//   }
// }

export default class Skull extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);

    // this.setBody(config.shapeData);
    // this.body.setStatic(true);
    // this.body.setAwake(false);

    // this.body.label = 'skull';
    // this.body.ignoreGravity = true;
    // this.body.immovable = true;

    // this.setMass(1000);

    this.setScale(assetsDPR / 10, assetsDPR / 10);

    this.scene.add.existing(this);
  }
  isAttacking() {
    return this.anims.currentAnim.key === 'attack';
  }
}