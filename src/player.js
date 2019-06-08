class Player {
  constructor(args) {
    this.playerNumber = args.player_number;
    this.name = args.name;
    this.resigned = args.resigned;
  }

  asJson() {
    return {
      player_number: this.playerNumber,
      name: this.name,
      resigned: this.resigned
    };
  }
}

export default Player
