import { GameObjects } from 'phaser';

export default class EnergyBar extends GameObjects.Container {
  constructor(scene) {
    super(scene, 500, 50);

    this.scene = scene;

    this.energyBarLeftFrame = this.scene.add.sprite(103, 0, 'energy_bar_left_frame');

    this.energyBarLeftEdge = this.scene.add.image(103, 0, 'energy_bar_left_edge');

    this.energyBarMeterFrame = this.scene.add.image(103, 0, 'energy_bar_meter_frame');

    this.energyBarMeter = this.scene.add.image(this.energyBarMeterFrame.x, 350, 'energy_bar_meter');

    Phaser.Display.Align.To.RightTop(this.energyBarMeterFrame, this.energyBarLeftEdge);
    Phaser.Display.Align.To.RightTop(this.energyBarMeter, this.energyBarLeftEdge);

    this.energyBarRightFrame = this.scene.add.image(103, 0, 'energy_bar_right_frame');

    this.energyBarRightEdge = this.scene.add.image(103, 0, 'energy_bar_right_edge');

    Phaser.Display.Align.To.RightTop(this.energyBarRightFrame, this.energyBarMeterFrame);
    Phaser.Display.Align.To.RightTop(this.energyBarRightEdge, this.energyBarMeterFrame);

    this.energyMeterBadge = this.scene.add.image(103, 0, 'energy_bar_badge');
    this.energyMeterBadge.setScale(0.3, 1);
    Phaser.Display.Align.In.TopCenter(this.energyMeterBadge, this.energyBarLeftFrame, -35);

    this.energyMeterIcon = this.scene.add.image(103, 0, 'energy_bar_icon');
    this.energyMeterIcon.setScale(0.3, 1);
    Phaser.Display.Align.In.Center(this.energyMeterIcon, this.energyMeterBadge);

    this.add(this.energyBarLeftFrame);
    this.add(this.energyBarLeftEdge);
    this.add(this.energyBarMeterFrame);
    this.add(this.energyBarMeter);
    this.add(this.energyBarRightFrame);
    this.add(this.energyBarRightEdge);
    this.add(this.energyMeterBadge);
    this.add(this.energyMeterIcon);

    this.energyBarMeter.setDisplaySize(222, this.energyBarMeter.height);
    this.energyBarMeter.setX(this.energyBarMeter.x + 222 / 2 - 11);

    this.setScale(0.7, 0.2);

    scene.add.existing(this);
  }
}
