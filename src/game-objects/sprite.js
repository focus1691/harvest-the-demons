import Phaser from 'phaser';
import * as Planck from 'planck-js';

export default class Sprite extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, name) {
    super(scene, x, y);
    this.scene = scene;
    // this.debug = scene.game.config.physics.planck.debug;
    this.type = null;
    this.name = name || '';

    this.setTexture(texture);
    if (!texture) {
      this.setVisible(false);
    }
    this.x = x;
    this.y = y;
    this.scene.add.existing(this);

    this.graphics = this.scene.add.graphics();

    this.render = null;
    this.body = null;
    this.sensor = false;

    // Conveyer
    this.conveyer = false;
    this.conveyerSpeed = 0;

    this.fixtures = [];

    return this;
  }

  // setBody(type, opts) {
  setBody(data) {
    // this.type = type;
    // this.opts = opts || {};
    this.body = this.scene.world.createBody();
    this.body.setDynamic();
    // this.body.setMassData({
    //   mass: 1,
    //   center: Planck.Vec2(),
    //   I: 1,
    // });
    this.body.setMassData({
      mass: 0,
      center: Planck.Vec2(),
      I: 1,
    });
    // const fixtureOptions = {
    //   friction: this.opts.friction || 1.0,
    //   restitution: this.opts.restitution || 0.0,
    //   density: this.opts.density || 1.0,
    // };

    this.points = [];

    const fixtureOptions = {
      friction: data.friction || 0.0,
      restitution: data.restitution || 0.0,
      density: data.density || 0.0,
    };

    if (typeof data === 'string') {
      if (data === 'box') {
        this.type = 'box';
        const fixture = this.body.createFixture(Planck.Box(this.displayWidth / 2 / this.scene.scaleFactor, this.displayHeight / 2 / this.scene.scaleFactor), { ...fixtureOptions, isSensor: true, userData: this.name });
        // this.body.setPosition(Planck.Vec2((this.x + this.displayWidth / 2) / this.scene.scaleFactor, (this.y - this.displayHeight / 2) / this.scene.scaleFactor));
        // this.body.setPosition(Planck.Vec2((this.x + this.displayWidth / 2) / this.scene.scaleFactor, (this.y - this.displayHeight / 2) / this.scene.scaleFactor));
        this.fixtures.push(fixture);
      }
    } else {
      this.type = 'multi';
      for (var i = 0; i < data.fixtures.length; i++) {
        if (data.fixtures[i].circle) {
          let fixture = this.body.createFixture(Planck.Circle(data.fixtures[i].circle.radius / 2 / this.scene.scaleFactor), { ...fixtureOptions, isSensor: data.fixtures[i].isSensor, userData: data.fixtures[i].label });
          // this.body.setPosition(Planck.Vec2(data.fixtures[i].circle.x / this.scene.scaleFactor, data.fixtures[i].circle.y / this.scene.scaleFactor));
          // this.body.setPosition(Planck.Vec2(this.x / this.scene.scaleFactor, this.y / this.scene.scaleFactor));
          this.fixtures.push(fixture);
        }
        else if (data.fixtures[i].vertices) {
          let vertices = [];
          let points = [];
          for (var j = 0; j < data.fixtures[i].vertices.length; j++) {
            for (var k = 0; k < data.fixtures[i].vertices[j].length; k++) {
              // vertices.push(new Planck.Vec2((p[0] - this.displayWidth / 2) / this.scene.scaleFactor, (p[1] - this.displayHeight / 2) / this.scene.scaleFactor));
              // this.points.push({
              //   x: p[0] - this.displayWidth / 2,
              //   y: p[1] - this.displayHeight / 2,
              // });
  
              let { x, y } = data.fixtures[i].vertices[j][k];
  
              vertices.push(new Planck.Vec2((x - this.displayWidth / 2), (y - this.displayHeight / 2)));
              this.points.push({
                x: x - this.displayWidth / 2,
                y: y - this.displayHeight / 2,
              })
            }
          }
          const fixture = this.body.createFixture(Planck.Polygon(vertices, this.points.length), { ...fixtureOptions, isSensor: data.fixtures[i].isSensor, userData: data.fixtures[i].label });
          // this.body.setPosition(Planck.Vec2(this.x / this.scene.scaleFactor, this.y / this.scene.scaleFactor));
          // this.body.setPosition(Planck.Vec2(this.x / this.scene.scaleFactor, this.y / this.scene.scaleFactor));
          this.fixtures.push(fixture);
        }
      }
    }

    // switch (type) {
    //   case 'box':
    //     this.fixture = this.body.createFixture(Planck.Box(this.displayWidth / 2 / this.scene.scaleFactor, this.displayHeight / 2 / this.scene.scaleFactor), fixtureOptions);
    //     this.body.setPosition(Planck.Vec2((this.x + this.displayWidth / 2) / this.scene.scaleFactor, (this.y - this.displayHeight / 2) / this.scene.scaleFactor));
    //     break;
    //   case 'circle':
    //     this.fixture = this.body.createFixture(Planck.Circle(this.displayWidth / 2 / this.scene.scaleFactor), fixtureOptions);
    //     this.body.setPosition(Planck.Vec2(this.x / this.scene.scaleFactor, this.y / this.scene.scaleFactor));
    //     break;
    //   case 'polygon':
    //     this.vertices = [];
    //     this.points = [];
    //     this.opts.points.forEach((p) => {
    //       this.vertices.push(new Planck.Vec2((p[0] - this.displayWidth / 2) / this.scene.scaleFactor, (p[1] - this.displayHeight / 2) / this.scene.scaleFactor));
    //       this.points.push({
    //         x: p[0] - this.displayWidth / 2,
    //         y: p[1] - this.displayHeight / 2,
    //       });
    //     });
    //     this.fixture = this.body.createFixture(Planck.Polygon(this.vertices, this.opts.points.length), fixtureOptions);
    //     this.body.setPosition(Planck.Vec2(this.x / this.scene.scaleFactor, this.y / this.scene.scaleFactor));
    //     break;
    //   case 'edge':
    //     this.fixture = this.body.createFixture(
    //       Planck.Edge(Planck.Vec2(this.opts.x1 / this.scene.scaleFactor, this.opts.y1 / this.scene.scaleFactor), Planck.Vec2(this.opts.x2 / this.scene.scaleFactor, this.opts.y2 / this.scene.scaleFactor)),
    //       {
    //         friction: 1,
    //         restitution: 0.5,
    //         density: 1,
    //       }
    //     );
    //     this.body.setStatic();
    //     break;
    //   default:
    //     break;
    // }

    

    return this;
  }

  setConveyer(bool, speed) {
    this.conveyer = bool;
    this.conveyerSpeed = speed || 0;
  }

  setPosition(x, y) {
    if (!this.body) return;
    this.body.setTransform(new Planck.Vec2(x / this.scene.scaleFactor, y / this.scene.scaleFactor), this.body.getAngle());
  }

  getPosition() {
    if (!this.body) return;
    return new Phaser.Math.Vector2(this.x, this.y);
  }

  setRotation(angle) {
    if (!this.body) return;
    this.body.setTransform(this.body.getPosition(), angle);
  }

  getRotation() {
    if (!this.body) return;
    return this.body.getAngle();
  }

  setStatic() {
    if (!this.body) return;
    this.body.setStatic(true);
  }

  setDynamic() {
    if (!this.body) return;
    this.body.setDynamic(true);
  }

  setSensor() {
    if (!this.fixture) return;
    this.fixture.setSensor(true);
  }

  isSensor() {
    if (!this.fixture) return false;
    return this.fixture.isSensor();
  }

  /**
   * Custom debug draw
   * Note: This should really be replaced with a shader or something.
   */
  drawDebug() {
    this.graphics.clear();
    this.graphics.lineStyle(2, 0x0000ff, 1);

    switch (this.type) {
      case 'box':
        this.graphics.translateCanvas(this.x, this.y);
        this.graphics.rotateCanvas(this.rotation);
        this.graphics.strokeRect(-this.displayWidth / 2, -this.displayHeight / 2, this.displayWidth, this.displayHeight);
        break;
      case 'circle':
        this.graphics.translateCanvas(this.x, this.y);
        this.graphics.rotateCanvas(this.rotation);
        this.graphics.strokeCircle(0, 0, this.displayWidth / 2);
        break;
      case 'polygon':
        this.graphics.translateCanvas(this.x, this.y);
        this.graphics.rotateCanvas(this.rotation);
        this.graphics.strokePoints(this.points, true, true);
        break;
        case 'multi':
          this.graphics.translateCanvas(this.x, this.y);
          this.graphics.rotateCanvas(this.rotation);
          this.graphics.strokePoints(this.points, true, true);
          break;
      case 'edge':
        this.graphics.strokeLineShape({
          x1: this.opts.x1,
          y1: this.opts.y1,
          x2: this.opts.x2,
          y2: this.opts.y2,
        });
        break;
      default:
        break;
    }
  }

  /**
   * PreSolve Planck World
   */
  preSolve(contact, oldManifold) {
    // Conveyer
    if (this.conveyer) {
      let fixtureA = contact.getFixtureA();
      let fixtureB = contact.getFixtureB();
      if (fixtureA === this.fixture) {
        contact.setTangentSpeed(-this.conveyerSpeed);
      }
      if (fixtureB === this.fixture) {
        contact.setTangentSpeed(this.conveyerSpeed);
      }
    }
  }

  /**
   * PostSolve Planck World
   */
  postSolve(contact, oldManifold) {}

  /**
   * PreDestroy / PreUpdate Methods
   */

  preDestroy() {
    this.scene.world.destroyBody(this.body);
    this.graphics.destroy();
    this.body.destroy = () => {};
    // this.scene.sprites.forEach((s, i) => {
    //   if (s === this) {
    //     this.scene.sprites.splice(i, 1);
    //   }
    // });
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.body) {
      let pb = this.body;
      let pos = pb.getPosition();
      this.x = pos.x * this.scene.scaleFactor;
      this.y = pos.y * this.scene.scaleFactor;
      this.rotation = pb.getAngle();
      if (this.debug) {
        this.drawDebug();
      }
    }
  }
}
