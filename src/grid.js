import { exists } from './utils'
import Vector from './vector'

export const squaresAsJson = function(squareSet) {
  return {
    squares: squareSet.squares.map(function(square) { return square.asJson; })
  };
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

export const selected = function(squareSet) {
  return squareSet.squares.filter(function(s) {
    return (exists(s.piece) && s.piece.selected);
  })[0];
};

export const length = function(squareSet) {
  return squareSet.squares.length;
};

export const map = function(squareSet, callback) {
  return squareSet.squares.map(callback);
};

export const include = function(squareSet, square) {
  return exists(square) && squareSet.squares.some(function(s) {
    return square.id === s.id;
  });
};

export const difference = function(squareSetA, squareSetB) {
  let _squares = squareSetA.squares.filter(function(a) {
    return squareSetB.squares.filter(function(b) {
      return a.id === b.id;
    }).length === 0
  });
  return new squareSetA.constructor({"squares": _squares});
};

export const first = function(squareSet) {
  return squareSet.squares[0];
};

export const last = function(squareSet) {
  return squareSet.squares.slice(-1)[0];
};

export const many = function(squareSet) {
  return squareSet.squares.length > 1;
};

export const any = function(squareSet) {
  return squareSet.squares.length > 0;
};

export const empty = function(squareSet) {
  return squareSet.squares.length === 0;
};

export const filter = function(squareSet, callback) {
  let _squares = squareSet.squares.filter(callback);
  return new squareSet.constructor({"squares": _squares});
};

export const occupiedByOpponentOf = function(squareSet, playerNumber) {
  return filter(squareSet, function(s) {
    return s.occupiedByOpponentOf(playerNumber);
  });
};

export const occupiedBy = function(squareSet, playerNumber) {
  return filter(squareSet, function(s) {
    return s.occupiedBy(playerNumber);
  });
}

export const occupied = function(squareSet) {
  return filter(squareSet, function(s) {
    return s.occupied;
  });
};

export const unoccupied = function(squareSet) {
  return filter(squareSet, function(s) {
    return s.unoccupied;
  });
};

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

export const between = function(squareSet, a, b) {
  let vector = new Vector(a, b);
  let squares = [];

  if (vector.diagonal) {
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
