/**
 * This class represents the state of the game
 * Holds data that needs to persist past the life of a single play
 */
class GameState {
  constructor() {
    this.lastTransaction = null;
    this._checkForTutorial = 3;
    this._totalMeleeKills = 0;
    this._totalAxeKills = 0;
    this._axeTutorialDismissed =
      localStorage.getItem("axe_tutorial_shown") === "true";
    this._meleeTutorialDismissed =
      localStorage.getItem("melee_tutorial_shown") === "true";
  }

  /**
   * Updates the game state given a key and value
   * @param {string} key The property to update
   * @param {string} value The value to update with
   */
  commit(key, value) {
    if (this.containsKey(key)) {
        this.lastTransaction = {
            key: key,
            value: this[`_${key}`]
        }

        this[`_${key}`] = value;
    }
  }

  /**
   * 
   * @param {string} key Checks for the existance of a object key
   */
  containsKey(key) {
      return this[`_${key}`] !== undefined;
  }

  /**
   * Reverts the last update to the previous state
   */
  revertLastTransaction() {
    if (this.lastTransaction) {
        const key = this.lastTransaction.key;
        const value = this.lastTransaction.value;

        this[`_${key}`] = value;

        this.lastTransaction = null;
    }
  }
}

//singleton
export let gameState = new GameState();
