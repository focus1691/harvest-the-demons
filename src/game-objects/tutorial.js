import { assetsDPR } from '..';

/**
 * Utility class that returns UI game objects
 * You could probably create a generic "create" function
 * But I separated the two in this case
 */
export default class Tutorial {
  constructor() {}

  /**
   *
   * @param {*} scene
   * @param {*} tutorialVideo
   */
  static createAxeTutorial(scene, tutorialVideo) {
    const container = scene.rexUI.add.sizer({
      orientation: 'y',
      expand: false,
      space: { item: 20, left: 20, right: 20, top: 20, bottom: 20 },
      width: 150,
      height: 150,
    });

    const tutorialText = scene.add
      .text(0, 0, 'Defeat small monsters by using the tip of the axe!', {
        fontSize: `${10 * assetsDPR}px`,
        strokeThickness: 3,
      })
      .setDepth(205);

    const next = scene.add
      .text(0, 0, 'Got it', {
        fontSize: `${8 * assetsDPR}px`,
        strokeThickness: 3,
      })
      .setInteractive()
      .on('pointerover', function () {
        this.setColor('#af111c');
        this.setStroke('#af111c');
      })
      .on('pointerout', function () {
        this.setColor('white');
        this.setStroke('white');
      })
      .on(
        'pointerup',
        function () {
          scene.setMeleeTutorialVisible();
        },
        this
      )
      .setDepth(205);

    const neverShowAgain = scene.add
      .text(0, 0, "Don't show again", {
        fontSize: `${8 * assetsDPR}px`,
        strokeThickness: 3,
      })
      .setInteractive()
      .on('pointerover', function () {
        this.setColor('#af111c');
        this.setStroke('#af111c');
      })
      .on('pointerout', function () {
        this.setColor('white');
        this.setStroke('white');
      })
      .on(
        'pointerup',
        function () {
          scene.dismissAxeTutorial();
        },
        this
      )
      .setDepth(205);

    container.add(tutorialText).add(tutorialVideo).layout();

    return scene.rexUI.add
      .dialog({
        background: scene.rexUI.add
          .roundRectangle(0, 0, 150, 150, 8, 0x2b2d2f, 1)
          .setStrokeStyle(2, '0x000000'),
        space: {
          left: 20,
          right: 20,
          top: 20,
          bottom: 20,
          action: 30,
        },
        actions: [neverShowAgain, next],
        content: container,
        align: {
          actions: 'right',
        },
      })
      .layout();
  }

  static createMeleeTutorial(scene, tutorialVideo) {
    const container = scene.rexUI.add.sizer({
      orientation: 'y',
      expand: false,
      space: { item: 20, left: 20, right: 20, top: 20, bottom: 20 },
      width: 150,
      height: 150,
    });

    const tutorialText = scene.add
      .text(0, 0, 'Destroy large monsters with a vicious melee attack!', {
        fontSize: `${10 * assetsDPR}px`,
        strokeThickness: 3,
      })
      .setDepth(205);

    const neverShowAgain = scene.add
      .text(0, 0, "Don't show again", {
        fontSize: `${8 * assetsDPR}px`,
        strokeThickness: 3,
      })
      .setInteractive()
      .on('pointerover', function () {
        this.setColor('#af111c');
        this.setStroke('#af111c');
      })
      .on('pointerout', function () {
        this.setColor('white');
        this.setStroke('white');
      })
      .on(
        'pointerup',
        function () {
          scene.dismissMeleeTutorial();
        },
        this
      )
      .setDepth(205);

    const next = scene.add
      .text(0, 0, 'Got it', {
        fontSize: `${8 * assetsDPR}px`,
        strokeThickness: 3,
      })
      .setInteractive()
      .on('pointerover', function () {
        this.setColor('#af111c');
        this.setStroke('#af111c');
      })
      .on('pointerout', function () {
        this.setColor('white');
        this.setStroke('white');
      })
      .on(
        'pointerup',
        function () {
          scene.setAxeTutorialVisible();
        },
        this
      )
      .setDepth(205);

    container.add(tutorialText).add(tutorialVideo).layout();

    return scene.rexUI.add
      .dialog({
        background: scene.rexUI.add
          .roundRectangle(0, 0, 150, 150, 8, 0x2b2d2f, 1)
          .setStrokeStyle(2, '0x000000'),
        space: {
          left: 20,
          right: 20,
          top: 20,
          bottom: 20,
          action: 30,
        },
        actions: [neverShowAgain, next],
        content: container,
        align: {
          actions: 'right',
        },
      })
      .layout();
  }
}
