import { exists, uniq as uniqArr } from './utils'
import Vector from './vector'

/**
 * Serialize squares as simple objects.
 * @return {Object}
 */
export const squaresAsJson = function() {
  return {
    squares: this.squares.map(function(square) { return square.asJson(); })
  };
};

/**
 * Duplicate the grid.
 * @return {Object}
 */
export const squaresDup = function() {
  let _squares = this.squares.map(function(s) { return s.dup(); }); 
  return new this.constructor({squares: _squares});
};

// callbacks

/**
 * Do some of the elements satisfy the callback function?
 * With no callback, check if there is more than 0 elements.
 * @param {Function} [callback=undefined] - The callback function.
 * @return {boolean}
 */
export const some = function(callback) {
  if (exists(callback)) {
    return this.squares.some(callback);
  } else {
    return this.squares.length > 0;
  }
};

/**
 * Do more than one element satisfy the callback function?
 * With no callback, check if there is more than 1 element.
 * @param {Function} [callback=undefined] - The callback function.
 * @return {boolean}
 */
export const many = function(callback) {
  if (exists(callback)) {
    return this.squares.filter(callback).length > 1;
  } else {
    return this.squares.length > 1;
  }
};

/**
 * Do none of the elements satisfy the callback function?
 * With no callback, check if there is 0 elements.
 * @param {Function} [callback=undefined] - The callback function.
 * @return {boolean}
 */
export const none = function(callback) {
  if (exists(callback)) {
    return !this.squares.some(callback);
  } else {
    return this.squares.length === 0;
  }
};

/**
 * Does every element satisfy the callback function?
 * @param {Function} callback - The callback function.
 * @return {boolean}
 */
export const every = function(callback) {
  return this.squares.every(callback);
};

/**
 * Run the callback function through map on the squares.
 * @param {Function} callback - The callback function.
 * @return {Object[]}
 */
export const map = function(callback) {
  return this.squares.map(callback);
};

/**
 * Filter the squares based on the callback function.
 * @param {Function} callback - The callback function.
 * @return {Grid}
 */
export const filter = function(callback) {
  let _squares = this.squares.filter(callback);
  return new this.constructor({squares: _squares});
};

// operations

/**
 * Push a square onto the square set.
 * Returns the square set.
 * @param {(Square|null)} square - The square being pushed.
 * @return {SquareSet}
 */
export const push = function(square) {
  if (exists(square)) {
    this.squares.push(square);
    return new this.constructor({squares: this.squares});
  } else {
    return this;
  }
};

/**
 * Concatenate two grids.
 * @param {Grid} other - The other grid.
 * @return {Grid}
 */
export const concat = function(other) {
  let _squares = this.squares.concat(other.squares);
  return new this.constructor({squares: _squares});
};

/**
 * Union two grids.
 * @param {Grid} other - THe other grid.
 * @return {Grid}
 */
export const union = function(other) {
  return this.concat(other).uniq();
};

/**
 * Get the difference between two grids.
 * @param {Grid} other - The other grid.
 * @return {Grid}
 */
export const difference = function(other) {
  let _squares = this.squares.filter(function(squareA) {
    return !other.squares.some(function(squareB) {
      return squareA.id === squareB.id;
    })
  });
  return new this.constructor({"squares": _squares});
};

/**
 * Get the intersection between two grids.
 * @param {Grid} other - The other grid.
 * @return {Grid}
 */
export const intersection = function(other) {
  let _squares = this.squares.filter(function(squareA) {
    return other.squares.some(function(squareB) {
      return squareA.id === squareB.id; 
    }); 
  });
  return new this.constructor({squares: _squares});
};

/**
 * Remove non-unique elements from the grid.
 * @return {Grid}
 */
export const uniq = function() {
  let ids = uniqArr(this.squares.map(function(square) {
    return square.id;
  }));  

  let _squares = ids.map((id) => {
    return this.squares.filter(function(square) {
      return square.id === id;
    })[0];
  });

  return new this.constructor({squares: _squares});
}

/**
 * Filter the squares with an object of attributes and matching values
 *
 * @param {Object} object
 *   attributes to query for
 * @return {Grid}
 */
export const where = function(object) {
  let _squares = Object.keys(object).reduce(function(memo, attribute) {
    return memo.filter(function(s) {
      return s.attributeMatch(attribute, object[attribute]);
    });
  }, this.squares);

  return new this.constructor({squares: _squares});
}

/**
 * Get the length of squares in the grid.
 * @return {number}
 */
export const length = function() {
  return this.squares.length;
};

// queries

/**
 * Does the grid include square?
 * @param {Square} square - The square.
 * @return {boolean}
 */
export const includes = function(square) {
  if (square === undefined) {
    return false;
  }
  return this.squares.some(function(s) {
    return s.id === square.id;
  });
};

/**
 * Does the grid exclude square?
 * @param {Square} square - The square.
 * @return {boolean}
 */
export const excludes = function(square) {
  if (square === undefined) {
    return true;
  }
  return !this.squares.some(function(s) {
    return s.id === square.id;
  });
};

// finder

/**
 * Get the first square.
 * @return {(Square|undefined)}
 */
export const first = function() {
  return this.squares[0];
};

/**
 * Get the last square.
 * @return {(Square|undefined)}
 */
export const last = function() {
  return this.squares.slice(-1)[0];
};

/**
 * Get the square with a selected piece.
 * @return {(Square|undefined)}
 */
export const selected = function() {
  return this.squares.filter(function(s) {
    return (exists(s.piece) && s.piece.selected);
  })[0];
};

/**
 * Find a square by id.
 * @param {(number|number[])} id - The id or ids of the square/s.
 * @return {(Square|Square[]|undefined)}
 */
export const findById = function(id) {
  if (!exists(id)) {
    return undefined;
  } else if (id.constructor.name === "Array") {
    let _squares = id.map((i) => {
      return this.findById(i);
    }).filter((s) => { 
      return exists(s); 
    });
    return new this.constructor({squares: _squares});
  } else {
    return this.squares.filter(function(s) {
      return s.id === id;
    })[0];
  }
};

/**
 * Find a square by co-ordinates.
 * @param {number} x - The x co-ordinate.
 * @param {number} y - The y co-ordinate.
 * @return {(Square|undefined)}
 */
export const findByCoordinate = function(x, y) {
  return this.squares.filter(function(s) {
    return (s.x === x) && (s.y === y);
  })[0];
};

/**
 * Find a square by piece id.
 * @param {number} pieceId - The id of the piece.
 * @return {(Square|undefined)}
 */
export const findByPieceId = function(pieceId) {
  return this.squares.filter(function(s) {
    return exists(s.piece) && s.piece.id === pieceId;
  })[0];
};

// filters

/**
 * Get squares that have x co-ordinate.
 * @param {number} x - The x co-ordinate.
 * @return {Grid}
 */
export const whereX = function(x) {
  let _squares = this.squares.filter((s) => { return s.x === x; });
  return new this.constructor({squares: _squares});
};

/**
 * Get squares that have y co-ordinate.
 * @param {number} y - The y co-ordinate.
 * @return {Grid}
 */
export const whereY = function(y) {
  let _squares = this.squares.filter((s) => { return s.y === y; });
  return new this.constructor({squares: _squares});
};

/**
 * Get squares that are n squares away from a square.
 * @param {number} number - The distance between squares.
 * @param {Square} from - The origin square.
 * @return {Grid}
 */
export const squaresAwayFrom = function(number, from) {
  let _squares = this.squares.filter((s) => {
    return (new Vector(s, from)).distance === number;
  });
  return new this.constructor({squares: _squares});
};

/**
 * Get squares that are 2 squares away from a square.
 * @param {Square} from - The origin square.
 * @return {Grid}
 */
export const twoSquaresAwayFrom = function(from) {
  return this.squaresAwayFrom(2, from);
};

/**
 * Get squares that are 1 square away from a square.
 * @param {Square} from - The origin square.
 * @return {Grid}
 */
export const oneSquareAwayFrom = function(from) {
  return this.squaresAwayFrom(1, from);
};

/**
 * Get squares that are in range of square.
 * @param {Square} square - The origin square.
 * @param {number} distance - The distance between squares.
 * @return {Grid}
 */
export const inRange = function(square, distance) {
  let _squares = this.squares.filter(function(s) {
    return (new Vector(square, s)).magnitude <= distance;
  });
  return new this.constructor({squares: _squares});
};

/**
 * Get squares that are at range of square.
 * @param {Square} square - The origin square.
 * @param {number} distance - The distance between squares.
 * @return {Grid}
 */
export const atRange = function(square, distance) {
  let _squares = this.squares.filter(function(s) {
    return (new Vector(square, s)).magnitude === distance;
  });
  return new this.constructor({squares: _squares});
};

/**
 * Find all squares a certain number of ranks away
 * @param {Square} square - The origin square.
 * @param {number} distance - The distance between squares.
 * @return {Grid}
 */
export const ranksAway = function(square, distance) {
  let _squares = this.squares.filter(function(s) {
    return (new Vector(square, s)).absDy === distance;
  });
  return new this.constructor({squares: _squares});
};

/**
 * Find all squares a certain number of files away
 * @param {Square} square - The origin square.
 * @param {number} distance - THe distance between squares.
 * @return {Grid}
 */
export const filesAway = function(square, distance) {
  let _squares = this.squares.filter(function(s) {
    return (new Vector(square, s)).absDx === distance;
  });
  return new this.constructor({squares: _squares});
};

/**
 * Find all squares in the same rank 
 * @param {Square} square - The origin square.
 * @return {Grid}
 */
export const sameRank = function(square) {
  let _squares = this.squares.filter(function(s) {
    return s.y === square.y;
  });
  return new this.constructor({squares: _squares});
};

/**
 * Find all squares in the same file 
 * @param {Square} square - The origin square.
 * @return {Grid}
 */
export const sameFile = function(square) {
  let _squares = this.squares.filter(function(s) {
    return s.x === square.x;
  });
  return new this.constructor({squares: _squares});
};

/**
 * Get squares that are in player's direction from square.
 * @param {Square} square - The origin square.
 * @param {number} playerNumber - The number of the player.
 * @return {Grid}
 */
export const inDirection = function(square, playerNumber) {
  let direction = (playerNumber === 1 ? -1 : 1);
  let _squares = this.squares.filter(function(s) { 
    return (new Vector(square, s)).directionY === direction;
  });
  return new this.constructor({squares: _squares});
};

/**
 * Get all squares that are orthogonal to square.
 * @param {Square} square - The origin square.
 * @return {Grid}
 */
export const orthogonal = function(square) {
  let _squares = this.squares.filter(function(s) {
    return (new Vector(square, s)).orthogonal;
  });
  return new this.constructor({squares: _squares});
};

/**
 * Get all squares that are diagonal to square.
 * @param {Square} square - The origin square.
 * @return {Grid}
 */
export const diagonal = function(square) {
  let _squares = this.squares.filter(function(s) {
    return (new Vector(square, s)).diagonal;
  });
  return new this.constructor({squares: _squares});
};

/**
 * Get all squares that are sideways to square.
 * @param {Square} square - The origin square.
 * @return {Grid}
 */
export const sideways = function(square) {
  let _squares = this.squares.filter(function(s) {
    return square.y === s.y;
  });
  return new this.constructor({squares: _squares});
};

/**
 * Get all squares that are orthogonal or diagonal to square.
 * @param {Square} square - The origin square.
 * @return {Grid}
 */
export const orthogonalOrDiagonal = function(square) {
  let _squares = this.squares.filter(function(s) {
    return (new Vector(square, s)).orthogonalOrDiagonal;
  });
  return new this.constructor({squares: _squares});
};

/**
 * Get all squares that are not orthogonal nor diagonal to square.
 * @param {Square} square - The origin square.
 * @return {Grid}
 */
export const notOrthogonalOrDiagonal = function(square) {
  let _squares = this.squares.filter(function(s) {
    return (new Vector(square, s)).notOrthogonalOrDiagonal;
  });
  return new this.constructor({squares: _squares});
};

/**
 * Get all occupied squares.
 * @return {Grid}
 */
export const occupied = function() {
  let _squares = this.squares.filter(function(s) {
    return s.occupied();
  });
  return new this.constructor({squares: _squares});
};

/**
 * Get all unoccupied squares.
 * @return {Grid}
 */
export const unoccupied = function() {
  let _squares = this.squares.filter(function(s) {
    return s.unoccupied();
  });
  return new this.constructor({squares: _squares});
};

/**
 * Get all squares occupied by player.
 * @param {number} playerNumber - The number of the player.
 * @return {Grid}
 */
export const occupiedByPlayer = function(playerNumber) {
  let _squares = this.squares.filter(function(s) {
    return s.occupiedByPlayer(playerNumber);
  });
  return new this.constructor({squares: _squares});
}

/**
 * Get all squares occupied by opponent of player.
 * @param {number} playerNumber - The number of the player.
 * @return {Grid}
 */
export const occupiedByOpponentOf = function(playerNumber) {
  let _squares = this.squares.filter(function(s) {
    return s.occupiedByOpponentOf(playerNumber);
  });
  return new this.constructor({squares: _squares});
};

/**
 * Filter all squares unoccupied or occupied by opponent.
 * @param {number} playerNumber - The number of the player.
 * @return {SquareSet}
 */
export const unoccupiedOrOccupiedByOpponent = function(playerNumber) {
  return this.filter(function(s) {
    return s.unoccupiedOrOccupiedByOpponentOf(playerNumber);
  });
};

/**
 * Filter all squares occupied by piece type.
 * @param {string} pieceType - The type of the piece.
 * @return {SquareSet}
 */
export const occupiedByPiece = function(pieceType) {
  return this.filter(function(s) {
    return s.occupiedByPiece(pieceType);
  });
};

/**
 * Filter all squares not occupied by piece type.
 * @param {string} pieceType - The type of the piece.
 * @return {SquareSet}
 */
export const excludingPiece = function(pieceType) {
  return this.filter(function(s) {
    return s.notOccupiedByPiece(pieceType);
  });
};

/**
 * Get all squares that are not blocked from origin.
 * @param {Square} origin - The origin square.
 * @param {Grid} board - The complete board state.
 * @return {Grid}
 */
export const unblocked = function(origin, board) {
  let _squares = this.squares.filter((destination) => {
    return board.between(origin, destination).squares.every(function(s) {
      return s.unoccupied();
    });
  });
  return new this.constructor({squares: _squares});
};

/**
 * Get all squares between two squares.
 * @param {Square} a - The origin square.
 * @param {Square} b - The destination square.
 * @return {Grid}
 */
export const between = function(a, b) {
  let vector = new Vector(a, b);
  let squares = [];

  if (vector.orthogonalOrDiagonal) {
    let pointCounter = a.point();
    let direction = vector.direction;
    squares = [];

    while (pointCounter.notEq(b.point())) {
      pointCounter = pointCounter.add(direction);
      let square = this.findByCoordinate(pointCounter.x, pointCounter.y);

      if (exists(square) && square.point().notEq(b.point())) {
        squares.push(square);
      }
    }
  } else {
    squares = [];
  }
  return new this.constructor({squares: squares});
};
