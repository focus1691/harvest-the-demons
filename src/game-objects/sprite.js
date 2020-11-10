import Phaser from 'phaser';
import * as Planck from 'planck-js';
import { assetsDPR } from '../index';

export default class Sprite extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, name) {
    super(scene, x, y);
    this.scene = scene;
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

  setBody(data) {
    this.body = this.scene.world.createBody();
    this.body.setDynamic();
    this.body.setMassData({
      mass: 0,
      center: Planck.Vec2(),
      I: 1,
    });

    this.points = [];
    this.circles = [];

    const fixtureOptions = {
      friction: data.friction || 0.0,
      restitution: data.restitution || 0.0,
      density: data.density || 0.0,
    };

    if (typeof data === 'string') {
      if (data === 'box') {
        this.type = 'box';
        this.body.createFixture(Planck.Box(this.displayWidth / 2 / this.scene.scaleFactor, this.displayHeight / 2 / this.scene.scaleFactor), { ...fixtureOptions, isSensor: true, userData: this.name });
      }
    } else {
      this.type = 'multi';
      for (var i = 0; i < data.fixtures.length; i++) {
        if (data.fixtures[i].circle) {
          let circleR = data.fixtures[i].circle.radius / 2 / this.scene.scaleFactor;
          let circleX = data.fixtures[i].circle.x / this.scene.scaleFactor;
          let circleY = data.fixtures[i].circle.y / this.scene.scaleFactor;

          this.body.createFixture(Planck.Circle(circleR), { ...fixtureOptions, isSensor: data.fixtures[i].isSensor, userData: data.fixtures[i].label });
          this.circles.push({
            x: ((this.flipX ? -1 : 1) * (0.5 * assetsDPR * (circleX - this.displayWidth / 2))) / this.scene.scaleFactor,
            y: ((this.flipX ? -1 : 1) * (0.5 * assetsDPR * (circleY - this.displayHeight / 2))) / this.scene.scaleFactor,
            radius: circleR,
          });
        } else if (data.fixtures[i].vertices) {
          let vertices = [];
          let points = [];
          for (var j = 0; j < data.fixtures[i].vertices.length; j++) {
            for (var k = 0; k < data.fixtures[i].vertices[j].length; k++) {
              let { x, y } = data.fixtures[i].vertices[j][k];
              let vecX = ((this.flipX ? -1 : 1) * (0.5 * assetsDPR * (x - this.displayWidth / 2))) / this.scene.scaleFactor;
              let vecY = (0.5 * assetsDPR * (y - this.displayHeight / 2)) / this.scene.scaleFactor;

              vertices.push(new Planck.Vec2(vecX, vecY));
              data.fixtures[i].label === 'melee' && this.points.push({
                x: vecX * this.scene.scaleFactor,
                y: 0.5 * assetsDPR * (y - this.displayHeight / 2),
              });
            }
          }
          const fixture = this.body.createFixture(Planck.Polygon(vertices, this.points.length), { ...fixtureOptions, isSensor: data.fixtures[i].isSensor, userData: data.fixtures[i].label });
          this.fixtures.push(fixture);
        }
      }
    }
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

    if (this.type === 'box') {
      this.graphics.translateCanvas(this.x, this.y);
      this.graphics.rotateCanvas(this.rotation);
      this.graphics.strokeRect(-this.displayWidth / 2, -this.displayHeight / 2, this.displayWidth, this.displayHeight);
    } else if (this.type === 'multi') {
      this.graphics.translateCanvas(this.x, this.y);
      this.graphics.rotateCanvas(this.rotation);
      this.graphics.strokePoints(this.points, true, true);

      for (var i = 0; i < this.circles.length; i++) {
        this.graphics.translateCanvas(this.x, this.y);
        this.graphics.rotateCanvas(this.rotation);
        this.graphics.strokeCircle(this.circles[i].x, this.circles[i].y, this.circles[i].radius / 2);
      }
    }
  }

  /**
   * PreSolve Planck World
   */
  preSolve(contact, oldManifold) {}

  /**
   * PostSolve Planck World
   */
  postSolve(contact, oldManifold) {
    const a = contact.getFixtureA();
    const b = contact.getFixtureB();
    console.log(`postSolve: a) ${a.getUserData()}, b) ${b.getUserData()}`);
  }

  /**
   * PreDestroy / PreUpdate Methods
   */

  preDestroy() {
    this.scene.world.destroyBody(this.body);
    this.graphics.destroy();
    this.body.destroy = () => {};
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
