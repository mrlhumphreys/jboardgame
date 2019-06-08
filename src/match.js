import exists from './exists'
import Player from './player'

export const buildPlayers = function(players) {
  return players.map(function(p) { return new Player(p); }); 
};

export const buildLastAction = function(lastAction) {
  return exists(lastAction) ? lastAction : null;
};

const findPlayerByNumber = function(match, playerNumber) {
  return match.players.filter((p) => { return p.playerNumber === playerNumber; })[0];
};

const turnMessage = function(match) {
  let currentPlayer = findPlayerByNumber(match, match.gameState.currentPlayerNumber);
  return `${currentPlayer.name} to move`;
}

const winnerMessage = function(match) {
  let winningPlayer = findPlayerByNumber(match, match.winner);
  return `${winningPlayer.name} wins`;
};

const defaultMessage = function(match) {
  if (exists(match.winner)) {
    return winnerMessage(match);
  } else {
    return turnMessage(match);
  }
};

export const buildNotification = function(match, notification) {
  return exists(notification) ? notification : defaultMessage(match);
};

export const winner = function(match) {
  let playerResigned = match.players.some(function(p) { return p.resigned; });
  if (playerResigned) {
    return match.players.filter(function(p) { return !p.resigned; })[0].playerNumber;
  } else {
    return match.gameState.winner;
  }
};

export const asJson = function(match) {
  return {
    id: match.id,
    game_state: match.gameState.asJson,
    players: match.players.map(function(p) { return p.asJson(); }),
    last_action: match.lastAction,
    notification: match.notification
  };
};

