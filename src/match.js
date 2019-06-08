import exists from './exists'
import Player from './player'

class Match {
  constructor(args) {
    this.id = args.id;
    this.gameState = args.game_state;
    this.players = args.players.map(function(p) { return new Player(p); });
    this.lastAction = exists(args.last_action) ? args.last_action : {};
    this.notification = exists(args.notification) ? args.notification : this._defaultMessage;
  }

  get asJson() {
    return {
      id: this.id,
      game_state: this.gameState.asJson,
      players: this.players.map(function(p) { return p.asJson(); }),
      last_action: this.lastAction,
      notification: this.notification
    };
  }

  get winner() {
    let playerResigned = this.players.some(function(p) { return p.resigned; });
    if (playerResigned) {
      return this.players.filter(function(p) { return !p.resigned; })[0].playerNumber;
    } else {
      return this.gameState.winner;
    }
  }

  // private getters

  _findPlayerByNumber(playerNumber) {
    return this.players.filter((p) => { return p.playerNumber == playerNumber; })[0];
  }

  get _turnMessage() {
    let currentPlayer = this._findPlayerByNumber(this.gameState.currentPlayerNumber);
    return `${currentPlayer.name} to move`;
  }

  get _winnerMessage() {
    let winningPlayer = this._findPlayerByNumber(this.winner);
    return `${winningPlayer.name} wins`;
  }

  get _defaultMessage() {
    if (exists(this.winner)) {
      return this._winnerMessage;
    } else {
      return this._turnMessage;
    }
  }

  // private setters
  
  _notify(message) {
    this.notification = message;
  }

  _clearLastAction() {
    this.lastAction = null;
  }
}

export default Match

