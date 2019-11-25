import { exists } from './utils'
import Vector from './vector'

export const squaresAsJson = function(squareSet) {
  return {
    squares: squareSet.squares.map(function(square) { return square.asJson; })
  };
};

// callbacks

export const some = function(squareSet, callback) {
  if (exists(callback)) {
    return squareSet.squares.some(callback);
  } else {
    return squareSet.squares.length > 0;
  }
};

export const many = function(squareSet, callback) {
  if (exists(callback)) {
    return squareSet.squares.filter(callback).length > 1;
  } else {
    return squareSet.squares.length > 1;
  }
};

export const none = function(squareSet, callback) {
  if (exists(callback)) {
    return !squareSet.squares.some(callback);
  } else {
    return squareSet.squares.length === 0;
  }
};

export const every = function(squareSet, callback) {
  return squareSet.squares.every(callback);
};

export const map = function(squareSet, callback) {
  return squareSet.squares.map(callback);
};

export const filter = function(squareSet, callback) {
  let _squares = squareSet.squares.filter(callback);
  return new squareSet.constructor({"squares": _squares});
};

// operations

export const concat = function(squareSetA, squareSetB) {
  let _squares = squareSetA.squares.concat(squareSetB.squares);
  return new squareSetA.constructor({squares: _squares});
};

export const difference = function(squareSetA, squareSetB) {
  let _squares = squareSetA.squares.filter(function(squareA) {
    return !squareSetB.squares.some(function(squareB) {
      return squareA.id === squareB.id;
    })
  });
  return new squareSetA.constructor({"squares": _squares});
};

export const intersection = function(squareSetA, squareSetB) {
  let _squares = squareSetA.squares.filter(function(squareA) {
    return squareSetB.squares.some(function(squareB) {
      return squareA.id === squareB.id; 
    }); 
  });
  return new squareSetA.constructor({"squares": _squares});
};

export const uniq = function(squareSet) {
  let ids = squareSet.squares.map(function(square) {
    return square.id;
  }).filter(function(id, index, array) {
    return array.indexOf(id) === index;
  });
  
  let _squares = ids.map(function(id) {
    return squareSet.squares.filter(function(square) {
      return square.id === id;
    })[0];
  });

  return new squareSet.constructor({"squares": _squares});
}

export const length = function(squareSet) {
  return squareSet.squares.length;
};

// queries

export const includes = function(squareSet, square) {
  return squareSet.squares.some(function(s) {
    return s.id === square.id;
  });
};

export const excludes = function(squareSet, square) {
  return !squareSet.squares.some(function(s) {
    return s.id === square.id;
  });
};

// finder

export const first = function(squareSet) {
  return squareSet.squares[0];
};

export const last = function(squareSet) {
  return squareSet.squares.slice(-1)[0];
};

export const selected = function(squareSet) {
  return squareSet.squares.filter(function(s) {
    return (exists(s.piece) && s.piece.selected);
  })[0];
};

export const findById = function(squareSet, id) {
  if (!exists(id)) {
    return undefined;
  } else if (id.constructor.name === "Array") {
    let _squares = id.map((i) => {
      return findById(squareSet, i);
    }).filter((s) => { 
      return exists(s); 
    });
    return new squareSet.constructor({"squares": _squares});
  } else {
    return squareSet.squares.filter(function(s) {
      return s.id === id;
    })[0];
  }
};

export const findByCoordinate = function(squareSet, x, y) {
  return squareSet.squares.filter(function(s) {
    return (s.x === x) && (s.y === y);
  })[0];
};

export const findByPieceId = function(squareSet, pieceId) {
  return squareSet.squares.filter(function(s) {
    return exists(s.piece) && s.piece.id === pieceId;
  })[0];
};

// filters

export const squaresAwayFrom = function(squareSet, number, from) {
  return filter(squareSet, (s) => {
    return (new Vector(s, from)).distance === number;
  });
};

export const twoSquaresAwayFrom = function(squareSet, from) {
  return squaresAwayFrom(squareSet, 2, from);
};

export const oneSquareAwayFrom = function(squareSet, from) {
  return squaresAwayFrom(squareSet, 1, from);
};

export const inRange = function(squareSet, square, distance) {
  let _squares = squareSet.squares.filter(function(s) {
    return (new Vector(square, s)).magnitude <= distance;
  });
  return new squareSet.constructor({squares: _squares});
};

export const atRange = function(squareSet, square, distance) {
  let _squares = squareSet.squares.filter(function(s) {
    return (new Vector(square, s)).magnitude === distance;
  });
  return new squareSet.constructor({squares: _squares});
};

export const inDirection = function(squareSet, square, playerNumber) {
  let direction = (playerNumber === 1 ? -1 : 1);
  let _squares = squareSet.squares.filter(function(s) { 
    return (new Vector(square, s)).directionY === direction;
  });
  return new squareSet.constructor({squares: _squares});
};

export const orthogonal = function(squareSet, square) {
  let _squares = squareSet.squares.filter(function(s) {
    return (new Vector(square, s)).orthogonal;
  });
  return new squareSet.constructor({squares: _squares});
};

export const diagonal = function(squareSet, square) {
  let _squares = squareSet.squares.filter(function(s) {
    return (new Vector(square, s)).diagonal;
  });
  return new squareSet.constructor({squares: _squares});
};

export const sideways = function(squareSet, square) {
  let _squares = squareSet.squares.filter(function(s) {
    return square.y === s.y;
  });
  return new squareSet.constructor({squares: _squares});
};

export const orthogonalOrDiagonal = function(squareSet, square) {
  let _squares = squareSet.squares.filter(function(s) {
    return (new Vector(square, s)).orthogonalOrDiagonal;
  });
  return new squareSet.constructor({squares: _squares});
};

export const notOrthogonalOrDiagonal = function(squareSet, square) {
  let _squares = squareSet.squares.filter(function(s) {
    return (new Vector(square, s)).notOrthogonalOrDiagonal;
  });
  return new squareSet.constructor({squares: _squares});
};

export const occupied = function(squareSet) {
  let _squares = squareSet.squares.filter(function(s) {
    return s.occupied;
  });
  return new squareSet.constructor({squares: _squares});
};

export const unoccupied = function(squareSet) {
  let _squares = squareSet.squares.filter(function(s) {
    return s.unoccupied;
  });
  return new squareSet.constructor({squares: _squares});
};

export const occupiedByPlayer = function(squareSet, playerNumber) {
  return filter(squareSet, function(s) {
    return s.occupiedByPlayer(playerNumber);
  });
}

export const occupiedByOpponentOf = function(squareSet, playerNumber) {
  return filter(squareSet, function(s) {
    return s.occupiedByOpponentOf(playerNumber);
  });
};

export const unblocked = function(squareSet, origin, board) {
  let _squares = squareSet.squares.filter(function(destination) {
    return between(squareSet, origin, destination).squares.every(function(s) {
      return s.unoccupied;
    });
  });
  return new squareSet.constructor({squares: _squares});
};

export const between = function(squareSet, a, b) {
  let vector = new Vector(a, b);
  let squares = [];

  if (vector.orthogonalOrDiagonal) {
    let pointCounter = a.point;
    let direction = vector.direction;
    squares = [];

    while (pointCounter.notEq(b.point)) {
      pointCounter = pointCounter.add(direction);
      let square = findByCoordinate(squareSet, pointCounter.x, pointCounter.y);

      if (exists(square) && square.point.notEq(b.point)) {
        squares.push(square);
      }
    }
  } else {
    squares = [];
  }
  return new squareSet.constructor({"squares": squares});
};
