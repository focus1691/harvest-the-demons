import Phaser from "phaser";
import { alignGrid } from "../assets/configs/alignGrid";
import Tutorial from "../game-objects/tutorial";
import { gameState } from "../state/gameState";

export default class TutorialScene extends Phaser.Scene {
  constructor() {
    super("tutorialScene");
  }

  init() {
    this.axeTutorialAlreadySeen = false;
    this.meleeTutorialAlreadySeen = false;
  }

  create() {
    this.axeTutorialVideo = this.add
      .video(150, 150, "tutorial")
      .setDepth(206)
      .setScale(0.75, 0.75);

    this.meleeTutorialVideo = this.add
      .video(150, 150, "tutorial_2")
      .setDepth(206)
      .setScale(0.75, 0.75);

    this.axeTutorialDialog = Tutorial.createAxeTutorial(
      this,
      this.axeTutorialVideo
    );
    this.meleeTutorialDialog = Tutorial.createMeleeTutorial(
      this,
      this.meleeTutorialVideo
    );

    alignGrid.center(this.axeTutorialDialog);
    alignGrid.center(this.meleeTutorialDialog);

    if (this.showAxeTutorial())
      this.setAxeTutorialVisible();
    else if (this.showMeleeTutorial()) 
      this.setMeleeTutorialVisible();

  }

  /**
   * Shows the axe tutorial if it meets the critieria and hasn't already been seen this level
   */
  setAxeTutorialVisible() {
    if (this.showAxeTutorial() && !this.axeTutorialAlreadySeen) {
      this.axeTutorialDialog.setVisible(true);
      this.meleeTutorialDialog.setVisible(false);
      this.axeTutorialVideo.play(true);
      this.meleeTutorialVideo.stop();
      this.axeTutorialAlreadySeen = true;
    } else {
      this.scene.stop("tutorialScene");
      this.scene.resume("playGame");
    }
  }

  /**
   * Shows the melee tutorial if it meets the critieria and hasn't already been seen this level
   */
  setMeleeTutorialVisible() {
    if (this.showMeleeTutorial() && !this.meleeTutorialAlreadySeen) {
      this.axeTutorialDialog.setVisible(false);
      this.meleeTutorialDialog.setVisible(true);
      this.axeTutorialVideo.stop();
      this.meleeTutorialVideo.play(true);
      this.meleeTutorialAlreadySeen = true;
    } else {
      this.scene.stop("tutorialScene");
      this.scene.resume("playGame");
    }
  }

  dismissAxeTutorial() {
    localStorage.setItem("axe_tutorial_shown", true);
    gameState.commit("axeTutorialDismissed", true);

    // Try to set the next tutorial visible
    this.setMeleeTutorialVisible();
  }

  dismissMeleeTutorial() {
    localStorage.setItem("melee_tutorial_shown", true);
    gameState.commit("meleeTutorialDismissed", true);

    // Try to set the next tutorial visible
    this.setAxeTutorialVisible();
  }

  showAxeTutorial() {
    return (
      gameState._totalAxeKills < gameState._checkForTutorial &&
      !gameState._axeTutorialDismissed
    );
  }

  showMeleeTutorial() {
    return (
      gameState._totalMeleeKills < gameState._checkForTutorial &&
      !gameState._meleeTutorialDismissed
    );
  }

  update() {}
}
