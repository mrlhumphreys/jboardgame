import { exists } from './utils'
import Point from './point'

/**
 * The square serialized as an object.
 * @return {Object}
 */
export const squareAsJson = function() {
  let pieceJson = exists(this.piece) ? this.piece.asJson : null;
  return {
    id: this.id,
    x: this.x,
    y: this.y,
    piece: pieceJson
  };
};

/**
 * A duplicate of the square.
 * @return {Square}
 */
export const squareDup = function() {
  let _piece = null;

  if (exists(this.piece)) {
    _piece = this.piece.dup;
  }

  let args = {
    id: this.id,
    x: this.x,
    y: this.y
  };

  let _square = new this.constructor(args);
  _square.piece = _piece;
  return _square;
};

/**
 * Is the square occupied?
 * @return {boolean}
 */
export const squareOccupied = function() {
  return exists(this.piece);
};

/**
 * Is the square unoccupied?
 * @return {boolean}
 */
export const squareUnoccupied = function() {
  return !exists(this.piece);
};

/**
 * Is the square occupied by player?
 * @param {number} playerNumber - The number of the player.
 * @return {boolean}
 */
export const squareOccupiedByPlayer = function(playerNumber) {
  return this.occupied() && this.piece.playerNumber === playerNumber;
};

/**
 * Is the square occupied by the opponent
 * @param {number} playerNumber - The number of the player.
 * @return {boolean}
 */
export const squareOccupiedByOpponentOf = function(playerNumber) {
  return this.occupied() && this.piece.playerNumber !== playerNumber;
};

/**
 * Is the square unoccupied or occupied by the opponent?
 * @param {number} playerNumber - The number of the player.
 * @return {boolean}
 */
export const squareUnoccupiedOrOccupiedByOpponentOf = function(playerNumber) {
  return this.unoccupied() || this.occupiedByOpponentOf(playerNumber);
};

/**
 * Is the square occupied by a piece of given type?
 * @param {string} pieceTYpe - The type of the piece.
 * @return {boolean}
 */
export const squareOccupiedByPiece = function(pieceType) {
  if (pieceType.constructor === Array) {
    return this.occupied() && pieceType.includes(this.piece.type);
  } else {
    return this.occupied() && this.piece.type === pieceType;
  }
};

/**
 * Is the square not occupied by a piece of given type?
 * @param {string} pieceTYpe - The type of the piece.
 * @return {boolean}
 */
export const squareNotOccupiedByPiece = function(pieceType) {
  if (pieceType.constructor === Array) {
    return this.occupied() && !pieceType.includes(this.piece.type);
  } else {
    return this.occupied() && this.piece.type !== pieceType;
  }
};

/**
 * The point representaiton of the square's position.
 * @return {Point}
 */
export const point = function() {
  return new Point(this.x, this.y);
};

/**
 * Select the square.
 * Returns false if no piece.
 * @return {boolean}
 */
export const select = function() {
  if (exists(this.piece)) {
    return this.piece.select();
  } else {
    return false;
  }
};

/**
 * Deselect the square.
 * Returns false if no piece.
 * @return {boolean}
 */
export const deselect = function() {
  if (exists(this.piece)) {
     return this.piece.deselect();
  } else {
    return false;
  }
};

/**
 * Add piece to the square.
 * @param {Piece} piece = The piece to be added to the square.
 * @return {boolean}
 */
export const addPiece = function(piece) {
  this.piece = piece;
  return true;
};

/**
 * Remove the piece from the square
 * Returns false if no piece.
 * @return {boolean}
 */
export const removePiece = function(piece) {
  if (exists(this.piece)) {
    this.piece = null;
    return true;
  } else {
    return false;
  }
};

