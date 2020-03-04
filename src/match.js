import { exists } from './utils'
import Player from './player'

/**
 * Build player objects from an array of properties.
 * @param {Object[]} players - An array of player properties.
 * @return {Player[]}
 */
export const buildPlayers = function(players) {
  return players.map(function(p) { return new Player(p); }); 
};

/**
 * Sanitize last action object.
 * @param {Object} lastAction - The last action taken.
 * @return {(Object|null)}
 */
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

/**
 * Build a notification message based on the match.
 * Returns a default message if no notification provided.
 * @param {Match} match - The match being played.
 * @param {string} notification - The notification message.
 * @return {string}
 */
export const buildNotification = function(match, notification) {
  return exists(notification) ? notification : defaultMessage(match);
};

/**
 * The winner of a match.
 * @param {Match} match - The match being played.
 * @return {(number|null)}
 */
export const winner = function(match) {
  let playerResigned = match.players.some(function(p) { return p.resigned; });
  if (playerResigned) {
    return match.players.filter(function(p) { return !p.resigned; })[0].playerNumber;
  } else {
    return match.gameState.winner;
  }
};

/**
 * The match serialized as an object.
 * @param {Match} match - The match being played.
 * @return {Object}
 */
export const matchAsJson = function(match) {
  return {
    id: match.id,
    game_state: match.gameState.asJson,
    players: match.players.map(function(p) { return p.asJson(); }),
    last_action: match.lastAction,
    notification: match.notification
  };
};

