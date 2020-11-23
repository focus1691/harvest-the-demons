import { GameObjects } from 'phaser';

export default class EnergyBar extends GameObjects.Container {
  constructor(scene) {
    super(scene, 500, 50);

    this.scene = scene;

    this.energy = 100;

    this.energyBarLeftFrame = this.scene.add.sprite(103, 0, 'energy_bar_left_frame');

    this.energyBarLeftEdge = this.scene.add.image(103, 0, 'energy_bar_left_edge');

    this.energyBarMeterFrame = this.scene.add.image(103, 0, 'energy_bar_meter_frame');

    this.energyBarMeter = this.scene.add.image(this.energyBarMeterFrame.x, 0, 'energy_bar_meter');

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

    this.energyBarMeter.setDisplaySize(this.energyBarMeter.width * 10, this.energyBarMeter.height);
    this.energyBarMeter.setX(this.energyBarMeter.x + (this.energyBarMeter.width * 10) / 2 - this.energyBarMeter.width / 2);

    this.energyWidth = this.energyBarLeftEdge.displayWidth + this.energyBarMeter.displayWidth + this.energyBarRightEdge.displayWidth;

    this.setScale(0.7, 0.2);

    scene.add.existing(this);
  }
  deplete(amount) {
    this.energy = Math.max(this.energy - amount, 0);

    let energyWidth = Phaser.Math.RoundTo(this.energyWidth * (this.energy / 100), 0);

    if (this.energy === 0) {
      this.energyBarLeftEdge.displayWidth = 0;
      this.energyBarRightEdge.displayWidth = 0;
      this.energyBarMeter.displayWidth = 0;
    }

    else if (energyWidth <= this.energyBarLeftEdge.width) {
      this.energyBarLeftEdge.displayWidth = energyWidth;
      this.energyBarLeftEdge.x = energyWidth / 2;

      this.energyBarMeter.displayWidth = 0;

      this.energyBarRightEdge.displayWidth = 0;
      
    }
    else if (energyWidth <= this.energyBarLeftEdge.width + this.energyBarMeter.width * 10) {
      this.energyBarLeftEdge.displayWidth = this.energyBarLeftEdge.width;

      energyWidth -= this.energyBarLeftEdge.width;

      this.energyBarMeter.displayWidth = energyWidth;
      this.energyBarMeter.x = energyWidth / 2 + this.energyBarLeftEdge.width;

      this.energyBarRightEdge.displayWidth = 0;
    }
    else if (energyWidth <= this.energyWidth) {
      this.energyBarLeftEdge.displayWidth = this.energyBarLeftEdge.width;
      this.energyBarMeter.displayWidth = this.energyBarMeter.width * 10;

      energyWidth -= this.energyBarLeftEdge.width + this.energyBarMeter.width * 10;
      this.energyBarRightEdge.displayWidth = energyWidth;
      this.energyBarRightEdge.x = energyWidth / 2 + this.energyBarLeftEdge.width + this.energyBarMeter.width * 10;
    }
  }
  restore() {
    this.energy = 100;

    this.energyBarLeftEdge.displayWidth = this.energyBarLeftEdge.width;
    this.energyBarLeftEdge.x = this.energyBarLeftEdge.width / 2;

    this.energyBarMeter.displayWidth = this.energyBarMeter.width * 10;
    this.energyBarMeter.x = (this.energyBarMeter.width * 10) / 2 + this.energyBarLeftEdge.width;
  
    this.energyBarRightEdge.displayWidth = this.energyBarRightEdge.width;
    this.energyBarRightEdge.x = this.energyBarRightEdge.width / 2 + this.energyBarLeftEdge.width + this.energyBarMeter.width * 10;
  }
}
