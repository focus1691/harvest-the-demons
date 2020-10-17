import { GameObjects } from 'phaser';

export default class HealthBar extends GameObjects.Container {
  constructor(scene) {
    super(scene, 25, 50);

    this.scene = scene;

    this.healthBarLeftFrame = this.scene.add.sprite(103, 0, 'health_bar_left_frame');

    this.healthBarLeftEdge = this.scene.add.image(103, 0, 'health_bar_left_edge');

    this.healthBarMeterFrame = this.scene.add.image(103, 0, 'health_bar_meter_frame');

    this.healthBarMeter = this.scene.add.image(this.healthBarMeterFrame.x, 350, 'health_bar_meter');

    Phaser.Display.Align.To.RightTop(this.healthBarMeterFrame, this.healthBarLeftEdge);
    Phaser.Display.Align.To.RightTop(this.healthBarMeter, this.healthBarLeftEdge);

    this.healthBarRightFrame = this.scene.add.image(103, 0, 'health_bar_right_frame');

    this.healthBarRightEdge = this.scene.add.image(103, 0, 'health_bar_right_edge');

    Phaser.Display.Align.To.RightTop(this.healthBarRightFrame, this.healthBarMeterFrame);
    Phaser.Display.Align.To.RightTop(this.healthBarRightEdge, this.healthBarMeterFrame);

    this.healthMeterBadge = this.scene.add.image(103, 0, 'health_bar_badge');
    this.healthMeterBadge.setScale(0.3, 1);
    Phaser.Display.Align.In.TopCenter(this.healthMeterBadge, this.healthBarLeftFrame, -35);

    this.healthMeterIcon = this.scene.add.image(103, 0, 'health_bar_icon');
    this.healthMeterIcon.setScale(0.3, 1);
    Phaser.Display.Align.In.Center(this.healthMeterIcon, this.healthMeterBadge);

    this.add(this.healthBarLeftFrame);
    this.add(this.healthBarLeftEdge);
    this.add(this.healthBarMeterFrame);
    this.add(this.healthBarMeter);
    this.add(this.healthBarRightFrame);
    this.add(this.healthBarRightEdge);
    this.add(this.healthMeterBadge);
    this.add(this.healthMeterIcon);

    this.healthBarMeter.setDisplaySize(222, this.healthBarMeter.height);
    this.healthBarMeter.setX(this.healthBarMeter.x + 222 / 2 - 11);

    this.setScale(0.7, 0.2);

    scene.add.existing(this);
  }
}
