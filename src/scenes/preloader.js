import Phaser from 'phaser';
// Images
import backgroundImg from '../assets/images/2_game_background.png';
import soundOnImg from '../assets/images/white_soundOn.png';
import soundOffImg from '../assets/images/white_soundOff.png';
import portalImg from '../assets/images/__red_hell_portal_horns_lava_000.png';
//* Spritesheets
import bloodSpriteSheet from '../assets/spritesheets/blood_splatter.png';
import bloodSpriteJSON from '../assets/spritesheets/blood_splatter.json';

import ghostWarriorSpriteSheet from '../assets/spritesheets/ghost-warrior.png';
import ghostWarriorJSON from '../assets/spritesheets/ghost-warrior.json';

import blueMonsterSpriteSheet from '../assets/spritesheets/blue_monster.png';
import blueMonsterJSON from '../assets/spritesheets/blue_monster.json';

import blackMonsterSpriteSheet from '../assets/spritesheets/black_monster.png';
import blackMonsterJSON from '../assets/spritesheets/black_monster.json';

import greenMonsterSpriteSheet from '../assets/spritesheets/green_monster.png';
import greenMonsterJSON from '../assets/spritesheets/green_monster.json';

import greyMonsterSpriteSheet from '../assets/spritesheets/grey_monster.png';
import greyMonsterJSON from '../assets/spritesheets/grey_monster.json';

import redMonsterSpriteSheet from '../assets/spritesheets/red_monster.png';
import redMonsterJSON from '../assets/spritesheets/red_monster.json';

import yellowMonsterSpriteSheet from '../assets/spritesheets/yellow_monster.png';
import yellowMonsterJSON from '../assets/spritesheets/yellow_monster.json';
//* mp3
import demonLordAudio from '../assets/sound/demon_lord.mp3';
import axeSwingSound from '../assets/sound/zapsplat_warfare_weapon_axe_large_object_swing_swoosh_002.mp3';
import bigEyeKillSound from '../assets/sound/zapsplat_nature_water_pour_splatter_concrete_002_43152.mp3';
import eyeKillSound from '../assets/sound/zapsplat_impact_body_heavy_splat_squelch_guts_bones_break_13492.mp3';
import playerHitSound from '../assets/sound/horror_monster_zombie_male_groan_005.mp3';
import portalHitSound from '../assets/sound/zapsplat_horror_zombie_male_groan_growl_11766.mp3';
import scaryMusic from '../assets/sound/smartsound_CINEMATIC_HORROR_Piano_Bow_String_Broken_Low_Slow_01.mp3';

//* Physics
import ghostWarriorShape from '../assets/PhysicsEditor/ghost_warrior.json';

//? Health Bar
import energyBarLeftFrame from '../assets/images/healthbar/blue/meter_bar_holder_left_edge_blue.png';
import energyBarLeftEdge from '../assets/images/healthbar/blue/meter_bar_left_edge_blue.png';
import energyBarMeterFrame from '../assets/images/healthbar/blue/meter_bar_holder_center-repeating_blue.png';
import energyBarMeter from '../assets/images/healthbar/blue/meter_bar_center-repeating_blue.png';
import energyBarRightEdge from '../assets/images/healthbar/blue/meter_bar_right_edge_blue.png';
import energyBarRightFrame from '../assets/images/healthbar/blue/meter_bar_holder_right_edge_blue.png';
import energyMeterBadge from '../assets/images/healthbar/blue/meter_icon_holder_blue.png';
import energyMeterIcon from '../assets/images/healthbar/icons/power.png';
//! Health Bar
import healthBarLeftFrame from '../assets/images/healthbar/red/meter_bar_holder_left_edge_red.png';
import healthBarLeftEdge from '../assets/images/healthbar/red/meter_bar_left_edge_red.png';
import healthBarMeterFrame from '../assets/images/healthbar/red/meter_bar_holder_center-repeating_red.png';
import healthBarMeter from '../assets/images/healthbar/red/meter_bar_center-repeating_red.png';
import healthBarRightEdge from '../assets/images/healthbar/red/meter_bar_right_edge_red.png';
import healthBarRightFrame from '../assets/images/healthbar/red/meter_bar_holder_right_edge_red.png';
import healthMeterBadge from '../assets/images/healthbar/red/meter_icon_holder_red.png';
import healthMeterIcon from '../assets/images/healthbar/icons/health.png';

export default class preloaderScene extends Phaser.Scene {
  constructor() {
    super('preloaderScene');
  }
  preload() {
    const W = this.game.config.width;
    const H = this.game.config.height;
    const BAR_FRAME_W = W / 4;
    const BAR_FRAME_H = H / 16;
    const BAR_W = BAR_FRAME_W - 110;
    const BAR_H = BAR_FRAME_H - 10;

    this.loadingText = this.add.text(0, 0, "Loading: ", { fontSize: '5rem', fill: '#FFF' });
    this.loadingText.setPosition(this.game.config.width / 2 - (this.loadingText.width / 1.5), this.game.config.height / 2 - (this.loadingText.height / 1.5));

    this.xPos = W / 2 - (this.loadingText.width / 1.5);
    this.yPos = H / 2 + (this.loadingText.height / 1.5);

		this.graphics = this.add.graphics();
		this.newGraphics = this.add.graphics();
		var progressBar = new Phaser.Geom.Rectangle(this.xPos, this.yPos, BAR_FRAME_W, BAR_FRAME_H);
		var progressBarFill = new Phaser.Geom.Rectangle(this.xPos + 5, this.yPos + 5, BAR_W, BAR_H);

		this.graphics.fillStyle(0xffffff, 2);
		this.graphics.fillRectShape(progressBar);

		this.newGraphics.fillStyle(0xaf111c, 1);
		this.newGraphics.fillRectShape(progressBarFill);

    this.load.image('background', backgroundImg);
    this.load.image('sound_on', soundOnImg);
    this.load.image('sound_off', soundOffImg);
    this.load.image('portal', portalImg);

    // Health Bar
    this.load.image('health_bar_left_frame', healthBarLeftFrame);
    this.load.image('health_bar_left_edge', healthBarLeftEdge);
    this.load.image('health_bar_meter', healthBarMeter);
    this.load.image('health_bar_meter_frame', healthBarMeterFrame);
    this.load.image('health_bar_right_frame', healthBarRightFrame);
    this.load.image('health_bar_right_edge', healthBarRightEdge);
    this.load.image('health_bar_badge', healthMeterBadge);
    this.load.image('health_bar_icon', healthMeterIcon);

    // Energy Bar
    this.load.image('energy_bar_left_frame', energyBarLeftFrame);
    this.load.image('energy_bar_left_edge', energyBarLeftEdge);
    this.load.image('energy_bar_meter', energyBarMeter);
    this.load.image('energy_bar_meter_frame', energyBarMeterFrame);
    this.load.image('energy_bar_right_frame', energyBarRightFrame);
    this.load.image('energy_bar_right_edge', energyBarRightEdge);
    this.load.image('energy_bar_badge', energyMeterBadge);
    this.load.image('energy_bar_icon', energyMeterIcon);

    this.load.json('ghost_warrior_shapes', ghostWarriorShape);

    this.load.atlas('blood', bloodSpriteSheet, bloodSpriteJSON);
    this.load.atlas('ghost_warrior', ghostWarriorSpriteSheet, ghostWarriorJSON);

    this.load.atlas('blue_monster', blueMonsterSpriteSheet, blueMonsterJSON);
    this.load.atlas('black_monster', blackMonsterSpriteSheet, blackMonsterJSON);
    this.load.atlas('green_monster', greenMonsterSpriteSheet, greenMonsterJSON);
    this.load.atlas('red_monster', redMonsterSpriteSheet, redMonsterJSON);
    this.load.atlas('yellow_monster', yellowMonsterSpriteSheet, yellowMonsterJSON);
    this.load.atlas('grey_monster', greyMonsterSpriteSheet, greyMonsterJSON);

    this.load.audio('demon_theme', demonLordAudio);
    this.load.audio('axe_swing', axeSwingSound);
    this.load.audio('big_eye_kill', bigEyeKillSound);
    this.load.audio('eye_kill', eyeKillSound);
    this.load.audio('player_damaged', playerHitSound);
    this.load.audio('portal_damaged', portalHitSound);
    this.load.audio('disturbing_piano_string', scaryMusic);

    this.load.on('progress', this.updateBar, this);
    this.load.on('complete', this.complete, this);
  }

  updateBar(percentage) {
    const W = this.game.config.width;
    const H = this.game.config.height;
    const BAR_FRAME_W = W / 4;
    const BAR_FRAME_H = H / 16;
    const BAR_W = BAR_FRAME_W - 110;
    const BAR_H = BAR_FRAME_H - 10;


    this.newGraphics.clear();
    this.newGraphics.fillStyle(0xaf111c, 1);
    this.newGraphics.fillRectShape(new Phaser.Geom.Rectangle(this.xPos + 5, this.yPos + 5, percentage * (BAR_FRAME_W - 10), BAR_H));

    percentage = percentage * 100;
    this.loadingText.setText('Loading: ' + percentage.toFixed(2) + '%');
  }
  complete() {
    this.scene.start('titleScene');
  }
}
