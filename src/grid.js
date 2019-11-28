import { exists } from './utils'
import Vector from './vector'

export const squaresAsJson = function() {
  return {
    squares: this.squares.map(function(square) { return square.asJson; })
  };
};

// callbacks

export const some = function(callback) {
  if (exists(callback)) {
    return this.squares.some(callback);
  } else {
    return this.squares.length > 0;
  }
};

export const many = function(callback) {
  if (exists(callback)) {
    return this.squares.filter(callback).length > 1;
  } else {
    return this.squares.length > 1;
  }
};

export const none = function(callback) {
  if (exists(callback)) {
    return !this.squares.some(callback);
  } else {
    return this.squares.length === 0;
  }
};

export const every = function(callback) {
  return this.squares.every(callback);
};

export const map = function(callback) {
  return this.squares.map(callback);
};

export const filter = function(callback) {
  let _squares = this.squares.filter(callback);
  return new this.constructor({squares: _squares});
};

// operations

export const concat = function(other) {
  let _squares = this.squares.concat(other.squares);
  return new this.constructor({squares: _squares});
};

export const difference = function(other) {
  let _squares = this.squares.filter(function(squareA) {
    return !other.squares.some(function(squareB) {
      return squareA.id === squareB.id;
    })
  });
  return new this.constructor({"squares": _squares});
};

export const intersection = function(other) {
  let _squares = this.squares.filter(function(squareA) {
    return other.squares.some(function(squareB) {
      return squareA.id === squareB.id; 
    }); 
  });
  return new this.constructor({squares: _squares});
};

export const uniq = function() {
  let ids = this.squares.map(function(square) {
    return square.id;
  }).filter(function(id, index, array) {
    return array.indexOf(id) === index;
  });
  
  let _squares = ids.map((id) => {
    return this.squares.filter(function(square) {
      return square.id === id;
    })[0];
  });

  return new this.constructor({squares: _squares});
}

export const length = function() {
  return this.squares.length;
};

// queries

export const includes = function(square) {
  if (square === undefined) {
    return false;
  }
  return this.squares.some(function(s) {
    return s.id === square.id;
  });
};

export const excludes = function(square) {
  if (square === undefined) {
    return true;
  }
  return !this.squares.some(function(s) {
    return s.id === square.id;
  });
};

// finder

export const first = function() {
  return this.squares[0];
};

export const last = function() {
  return this.squares.slice(-1)[0];
};

export const selected = function() {
  return this.squares.filter(function(s) {
    return (exists(s.piece) && s.piece.selected);
  })[0];
};

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

export const findByCoordinate = function(x, y) {
  return this.squares.filter(function(s) {
    return (s.x === x) && (s.y === y);
  })[0];
};

export const findByPieceId = function(pieceId) {
  return this.squares.filter(function(s) {
    return exists(s.piece) && s.piece.id === pieceId;
  })[0];
};

// filters

export const squaresAwayFrom = function(number, from) {
  let _squares = this.squares.filter((s) => {
    return (new Vector(s, from)).distance === number;
  });
  return new this.constructor({squares: _squares});
};

export const twoSquaresAwayFrom = function(from) {
  return this.squaresAwayFrom(2, from);
};

export const oneSquareAwayFrom = function(from) {
  return this.squaresAwayFrom(1, from);
};

export const inRange = function(square, distance) {
  let _squares = this.squares.filter(function(s) {
    return (new Vector(square, s)).magnitude <= distance;
  });
  return new this.constructor({squares: _squares});
};

export const atRange = function(square, distance) {
  let _squares = this.squares.filter(function(s) {
    return (new Vector(square, s)).magnitude === distance;
  });
  return new this.constructor({squares: _squares});
};

export const inDirection = function(square, playerNumber) {
  let direction = (playerNumber === 1 ? -1 : 1);
  let _squares = this.squares.filter(function(s) { 
    return (new Vector(square, s)).directionY === direction;
  });
  return new this.constructor({squares: _squares});
};

export const orthogonal = function(square) {
  let _squares = this.squares.filter(function(s) {
    return (new Vector(square, s)).orthogonal;
  });
  return new this.constructor({squares: _squares});
};

export const diagonal = function(square) {
  let _squares = this.squares.filter(function(s) {
    return (new Vector(square, s)).diagonal;
  });
  return new this.constructor({squares: _squares});
};

export const sideways = function(square) {
  let _squares = this.squares.filter(function(s) {
    return square.y === s.y;
  });
  return new this.constructor({squares: _squares});
};

export const orthogonalOrDiagonal = function(square) {
  let _squares = this.squares.filter(function(s) {
    return (new Vector(square, s)).orthogonalOrDiagonal;
  });
  return new this.constructor({squares: _squares});
};

export const notOrthogonalOrDiagonal = function(square) {
  let _squares = this.squares.filter(function(s) {
    return (new Vector(square, s)).notOrthogonalOrDiagonal;
  });
  return new this.constructor({squares: _squares});
};

export const occupied = function() {
  let _squares = this.squares.filter(function(s) {
    return s.occupied;
  });
  return new this.constructor({squares: _squares});
};

export const unoccupied = function() {
  let _squares = this.squares.filter(function(s) {
    return s.unoccupied;
  });
  return new this.constructor({squares: _squares});
};

export const occupiedByPlayer = function(playerNumber) {
  let _squares = this.squares.filter(function(s) {
    return s.occupiedByPlayer(playerNumber);
  });
  return new this.constructor({squares: _squares});
}

export const occupiedByOpponentOf = function(playerNumber) {
  let _squares = this.squares.filter(function(s) {
    return s.occupiedByOpponentOf(playerNumber);
  });
  return new this.constructor({squares: _squares});
};

export const unblocked = function(origin, board) {
  let _squares = this.squares.filter((destination) => {
    return this.between(origin, destination).squares.every(function(s) {
      return s.unoccupied;
    });
  });
  return new this.constructor({squares: _squares});
};

export const between = function(a, b) {
  let vector = new Vector(a, b);
  let squares = [];

  if (vector.orthogonalOrDiagonal) {
    let pointCounter = a.point;
    let direction = vector.direction;
    squares = [];

    while (pointCounter.notEq(b.point)) {
      pointCounter = pointCounter.add(direction);
      let square = this.findByCoordinate(pointCounter.x, pointCounter.y);

      if (exists(square) && square.point.notEq(b.point)) {
        squares.push(square);
      }
    }
  } else {
    squares = [];
  }
  return new this.constructor({squares: squares});
};
