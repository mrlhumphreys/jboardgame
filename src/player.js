/** A Player playing in a match */
class Player {
  /** 
   * Create a Player 
   * @param {Object} args - The properties of a Player.
   * @param {number} args.player_number - The number of the player.
   * @param {string} args.name - The name of the player.
   * @param {boolean} args.resigned - Has the player resigned?
   */
  constructor(args) {
    /** @member {number} */
    this.playerNumber = args.player_number;

    /** @member {string} */
    this.name = args.name;

    /** @member {boolean} */
    this.resigned = args.resigned;
  }

  /**
   * The player serialized as a simple object.
   * @return {Object}
   */
  asJson() {
    return {
      player_number: this.playerNumber,
      name: this.name,
      resigned: this.resigned
    };
  }
}

export default Player
