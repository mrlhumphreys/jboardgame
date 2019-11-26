import { exists } from '../src/utils'
import Point from '../src/point'
import {
  squaresAsJson,
  some,
  many,
  none,
  every,
  map,
  filter,
  concat,
  difference,
  intersection,
  uniq,
  length,
  includes,
  excludes,
  first,
  last,
  selected,
  findById,
  findByCoordinate,
  findByPieceId,
  squaresAwayFrom,
  twoSquaresAwayFrom,
  oneSquareAwayFrom,
  inRange,
  atRange,
  inDirection,
  orthogonal,
  diagonal,
  sideways,
  orthogonalOrDiagonal,
  notOrthogonalOrDiagonal,
  occupied,
  unoccupied,
  occupiedByPlayer,
  occupiedByOpponentOf,
  unblocked,
  between
} from '../src/grid'

class Square {
  constructor(args) {
    this.id = args.id;
    this.x = args.x;
    this.y = args.y;
    this.piece = args.piece;
  }

  get point() {
    return new Point(this.x, this.y);
  }

  occupiedByOpponentOf(playerNumber) {
    return exists(this.piece) && this.piece.playerNumber !== playerNumber;
  }

  occupiedByPlayer(playerNumber) {
    return exists(this.piece) && this.piece.playerNumber === playerNumber;
  }

  get occupied() {
    return exists(this.piece);
  }

  get unoccupied() {
    return !exists(this.piece);
  }

  get asJson() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      piece: this.piece
    };
  }
}

class SquareSet {
  constructor(args) {
    this.squares = args.squares.map(function(s) { return new Square(s) });
  }
}

describe('grid', () => {
  describe('squaresAsJson', () => {
    it('must return an array of simple objects', () => {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 2, y: 3 },
          { id: 2, x: 3, y: 4 }
        ]
      });
      let expected = {
        squares: [
          { id: 1, x: 2, y: 3 },
          { id: 2, x: 3, y: 4 }
        ]
      };

      let result = squaresAsJson(squareSet);

      expect(result).toEqual(expected);
    });
  });

  describe('some', () => {
    describe('with at least one element', () => {
      it('must return true', () => {
        let squareSet = new SquareSet({
          squares: [
            { id: 1, x: 2, y: 3, piece: { selected: false } },
            { id: 2, x: 3, y: 4, piece: { selected: true } },
            { id: 3, x: 4, y: 5, piece: { selected: false } }
          ]
        });

        let result = some(squareSet);
        expect(result).toBe(true);
      });
    });

    describe('with no elements', () => {
      it('must return false', () => {
        let squareSet = new SquareSet({
          squares: []
        });

        let result = some(squareSet);
        expect(result).toBe(false);
      });
    });
  });

  describe('many', () => {
    describe('with more than one element', () => {
      it('must return true', () => {
        let squareSet = new SquareSet({
          squares: [
            { id: 1, x: 2, y: 3, piece: { selected: false } },
            { id: 2, x: 3, y: 4, piece: { selected: true } },
            { id: 3, x: 4, y: 5, piece: { selected: false } }
          ]
        });

        let result = many(squareSet);
        expect(result).toBe(true);
      });
    });
    
    describe('with only one element', () => {
      it('must return false', () => {
        let squareSet = new SquareSet({
          squares: [
            { id: 1, x: 2, y: 3, piece: { selected: false } },
          ]
        });

        let result = many(squareSet);
        expect(result).toBe(false);
      });
    });
  });

  describe('none', () => {
    describe('with no elements', () => {
      it('must return true', () => {
        let squareSet = new SquareSet({
          squares: []
        });

        let result = none(squareSet);
        expect(result).toBe(true);
      });
    });

    describe('with at least one element', () => {
      it('must return false', () => {
        let squareSet = new SquareSet({
          squares: [
            { id: 1, x: 2, y: 3, piece: { selected: false } },
            { id: 2, x: 3, y: 4, piece: { selected: true } },
            { id: 3, x: 4, y: 5, piece: { selected: false } }
          ]
        });

        let result = none(squareSet);
        expect(result).toBe(false);
      });
    });
  });

  describe('every', () => {
    describe('every element satisfies callback', () => {
      it('must return true', () => {
        let squareSet = new SquareSet({
          squares: [
            { id: 1, x: 2, y: 3, piece: null },
            { id: 2, x: 3, y: 4, piece: null },
            { id: 3, x: 4, y: 5, piece: null }
          ]
        });

        let result = every(squareSet, function(s) { return s.piece === null; });
        expect(result).toBe(true);
      });
    });

    describe('not every element satisfies callback', () => {
      it('must return false', () => {
        let squareSet = new SquareSet({
          squares: [
            { id: 1, x: 2, y: 3, piece: null },
            { id: 2, x: 3, y: 4, piece: { selected: false } },
            { id: 3, x: 4, y: 5, piece: null }
          ]
        });

        let result = every(squareSet, function(s) { return s.piece === null; });
        expect(result).toBe(false);
      });
    });
  });

  describe('map', () => {
    it('must call map on the array with the specified callback', () => {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 2, y: 3, piece: { selected: false } },
          { id: 2, x: 3, y: 4, piece: { selected: true } }
        ]
      });
      let result = map(squareSet, function(s) { return s.x; });
      expect(result).toEqual([2,3]);
    });
  });

  describe('filter', () => {
    it('must return results that match the callback', () => {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 2, y: 3, piece: { selected: false } },
          { id: 2, x: 3, y: 4, piece: { selected: true } },
          { id: 3, x: 4, y: 5, piece: { selected: false } }
        ]
      });

      let result = filter(squareSet, function(s) { return s.x == 3; });
      expect(result.squares.length).toEqual(1);
      expect(result.squares[0].id).toEqual(2);
    });
  });

  describe('concat', () => {
    it('must return a set containing the elements of both sets', () => {
      let squareSetA = new SquareSet({
        squares: [
          { id: 1, x: 2, y: 3, piece: { selected: false } },
        ]
      });

      let squareSetB = new SquareSet({
        squares: [
          { id: 2, x: 3, y: 4, piece: { selected: true } }
        ]
      });

      let result = concat(squareSetA, squareSetB);
      expect(result.squares.length).toEqual(2);
      expect(result.squares[0].id).toEqual(1);
      expect(result.squares[1].id).toEqual(2);
    });
  });

  describe('difference', () => {
    it('must return a set with elements in set a not in set b', () => {
      let squareSetA = new SquareSet({
        squares: [
          { id: 1, x: 2, y: 3, piece: { selected: false } },
          { id: 2, x: 3, y: 4, piece: { selected: true } },
          { id: 3, x: 4, y: 5, piece: { selected: false } }
        ]
      });
      let squareSetB = new SquareSet({
        squares: [
          { id: 1, x: 2, y: 3, piece: { selected: false } },
          { id: 3, x: 4, y: 5, piece: { selected: false } }
        ]
      });

      let result = difference(squareSetA, squareSetB);
      expect(result.squares.length).toEqual(1);
      expect(result.squares[0].id).toEqual(2);
    });
  });

  describe('intersection', () => {
    it('must return a set only with elements in both sets', () => {
      let squareSetA = new SquareSet({
        squares: [
          { id: 1, x: 2, y: 3, piece: { selected: false } },
          { id: 2, x: 3, y: 4, piece: { selected: true } },
          { id: 3, x: 4, y: 5, piece: { selected: false } }
        ]
      });
      let squareSetB = new SquareSet({
        squares: [
          { id: 3, x: 4, y: 5, piece: { selected: false } },
          { id: 4, x: 5, y: 6, piece: { selected: false } }
        ]
      });

      let result = intersection(squareSetA, squareSetB);
      expect(result.squares.length).toEqual(1);
      expect(result.squares[0].id).toEqual(3);
    });
  });

  describe('uniq', () => {
    it('must return a set with unique elements from set', () => {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 2, y: 3, piece: { selected: false } },
          { id: 1, x: 2, y: 3, piece: { selected: false } },
          { id: 2, x: 3, y: 4, piece: { selected: true } },
        ]
      });

      let result = uniq(squareSet);
      expect(result.squares.length).toEqual(2);
      expect(result.squares[0].id).toEqual(1);
      expect(result.squares[1].id).toEqual(2);
    });
  });

  describe('length', () => {
    it('must return the length of the array', () => {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 2, y: 3, piece: { selected: false } },
          { id: 2, x: 3, y: 4, piece: { selected: true } }
        ]
      });
      let result = length(squareSet);
      expect(result).toEqual(2);
    });
  });

  describe('includes', () => {
    describe('with the element in the set', () => {
      it('must return true', () => {
        let squareSet = new SquareSet({
          squares: [
            { id: 1, x: 2, y: 3, piece: { selected: false } },
            { id: 2, x: 3, y: 4, piece: { selected: true } }
          ]
        });
        let square = new Square({ id: 1, x: 2, y: 3, piece: { selected: false }});
        let result = includes(squareSet, square);
        expect(result).toBe(true);
      });
    });

    describe('with the element not in the set', () => {
      it('must return false', () => {
        let squareSet = new SquareSet({
          squares: [
            { id: 1, x: 2, y: 3, piece: { selected: false } },
            { id: 2, x: 3, y: 4, piece: { selected: true } }
          ]
        });
        let square = new Square({ id: 3, x: 4, y: 5, piece: { selected: false }});
        let result = includes(squareSet, square);
        expect(result).toBe(false);
      });
    });

    describe('passing in undefined', () => {
      it('must return false', () => {
        let squareSet = new SquareSet({
          squares: [
            { id: 1, x: 2, y: 3, piece: { selected: false } },
            { id: 2, x: 3, y: 4, piece: { selected: true } }
          ]
        });
        let result = includes(squareSet, undefined);
        expect(result).toBe(false);
      });
    });
  });

  describe('excludes', () => {
    describe('with the element in the set', () => {
      it('must return false', () => {
        let squareSet = new SquareSet({
          squares: [
            { id: 1, x: 2, y: 3, piece: { selected: false } },
            { id: 2, x: 3, y: 4, piece: { selected: true } }
          ]
        });
        let square = new Square({ id: 1, x: 2, y: 3, piece: { selected: false }});
        let result = excludes(squareSet, square);
        expect(result).toBe(false);
      });
    });

    describe('with the element not in the set', () => {
      it('must return true', () => {
        let squareSet = new SquareSet({
          squares: [
            { id: 1, x: 2, y: 3, piece: { selected: false } },
            { id: 2, x: 3, y: 4, piece: { selected: true } }
          ]
        });
        let square = new Square({ id: 3, x: 4, y: 5, piece: { selected: false }});
        let result = excludes(squareSet, square);
        expect(result).toBe(true);
      });
    });

    describe('passing in undefined', () => {
      it('must return true', () => {
        let squareSet = new SquareSet({
          squares: [
            { id: 1, x: 2, y: 3, piece: { selected: false } },
            { id: 2, x: 3, y: 4, piece: { selected: true } }
          ]
        });
        let result = excludes(squareSet, undefined);
        expect(result).toBe(true);
      });
    });
  });

  describe('first', () => {
    it('must return the first element', () => {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 2, y: 3, piece: { selected: false } },
          { id: 2, x: 3, y: 4, piece: { selected: true } },
          { id: 3, x: 4, y: 5, piece: { selected: false } }
        ]
      });

      let result = first(squareSet);
      expect(result.id).toEqual(1);
    });
  });

  describe('last', () => {
    it('must return the last element', () => {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 2, y: 3, piece: { selected: false } },
          { id: 2, x: 3, y: 4, piece: { selected: true } },
          { id: 3, x: 4, y: 5, piece: { selected: false } }
        ]
      });

      let result = last(squareSet);
      expect(result.id).toEqual(3);
    });
  });

  describe('selected', () => {
    it('must return the selected piece', () => {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 2, y: 3, piece: { selected: false } },
          { id: 2, x: 3, y: 4, piece: { selected: true } }
        ]
      });
      let result = selected(squareSet);
      expect(result.id).toEqual(2);
    });
  });

  describe('findById', () => {
    describe('without an id', () => {
      it('must return undefined', () => {
        let squareSet = new SquareSet({
          squares: [
            { id: 1, x: 2, y: 3 },
            { id: 2, x: 3, y: 4 }
          ]
        });
        let result = findById(squareSet, undefined);
        expect(result).toBe(undefined);
      });
    });

    describe('with multiple ids', () => {
      it('must return a square set with the specified squares', () => {
        let squareSet = new SquareSet({
          squares: [
            { id: 1, x: 2, y: 3 },
            { id: 2, x: 3, y: 4 }
          ]
        });
        let result = findById(squareSet, [1,2]);
        expect(result.squares.length).toBe(2);
        expect(result.squares[0].id).toEqual(1);
        expect(result.squares[1].id).toEqual(2);
      });
    });

    describe('with one id', () => {
      it('must return a square with the specified id', () => {
        let squareSet = new SquareSet({
          squares: [
            { id: 1, x: 2, y: 3 },
            { id: 2, x: 3, y: 4 }
          ]
        });
        let result = findById(squareSet, 1);
        expect(result.id).toEqual(1);
      });
    });
  });

  describe('findByCoordinates', () => {
    it('must return the square matching the coordinates', () => {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 2, y: 3 },
          { id: 2, x: 3, y: 4 }
        ]
      });
      let result = findByCoordinate(squareSet, 2, 3);
      expect(result.id).toEqual(1);
    });
  });

  describe('findByPieceId', () => {
    it('must return the square occupied by the piece matching that id', () => {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 2, y: 3, piece: { id: 10, playerNumber: 1 } },
          { id: 2, x: 3, y: 4, piece: { id: 20, playerNumber: 1 } }
        ]
      });

      let result = findByPieceId(squareSet, 20);
      expect(result.id).toEqual(2);
    });
  });

  describe('squaresAwayFrom', () => {
    it('must return all squares that are n squares away from origin', () => {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 1, y: 1, piece: { selected: false, playerNumber: 2 } },
          { id: 2, x: 2, y: 2, piece: null },
          { id: 3, x: 3, y: 4, piece: null },
          { id: 3, x: 4, y: 4, piece: { selected: false, playerNumber: 1 } },
          { id: 4, x: 5, y: 5, piece: null },
          { id: 5, x: 7, y: 7, piece: null },
        ]
      });
      let origin = new Square({ id: 3, x: 4, y: 4, piece: { selected: false, playerNumber: 1 }});

      let result = squaresAwayFrom(squareSet, 3, origin);
      expect(result.squares.length).toEqual(2);
      expect(result.squares[0].id).toEqual(1);
      expect(result.squares[1].id).toEqual(5);
    });
  });

  describe('twoSquaresAwayFrom', () => {
    it('must return all squares that are 2 squares away from origin', () => {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 1, y: 1, piece: { selected: false, playerNumber: 2 } },
          { id: 2, x: 2, y: 2, piece: null },
          { id: 3, x: 3, y: 4, piece: null },
          { id: 3, x: 4, y: 4, piece: { selected: false, playerNumber: 1 } },
          { id: 4, x: 5, y: 5, piece: null },
          { id: 5, x: 7, y: 7, piece: null },
        ]
      });
      let origin = new Square({ id: 3, x: 4, y: 4, piece: { selected: false, playerNumber: 1 }});

      let result = twoSquaresAwayFrom(squareSet, origin);
      expect(result.squares.length).toEqual(1);
      expect(result.squares[0].id).toEqual(2);
    });
  });

  describe('oneSquareAwayFrom', () => {
    it('must return all squares that are 1 squares away from origin', () => {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 1, y: 1, piece: { selected: false, playerNumber: 2 } },
          { id: 2, x: 2, y: 2, piece: null },
          { id: 3, x: 3, y: 4, piece: null },
          { id: 3, x: 4, y: 4, piece: { selected: false, playerNumber: 1 } },
          { id: 4, x: 5, y: 5, piece: null },
          { id: 5, x: 7, y: 7, piece: null },
        ]
      });
      let origin = new Square({ id: 3, x: 4, y: 4, piece: { selected: false, playerNumber: 1 }});

      let result = oneSquareAwayFrom(squareSet, origin);
      expect(result.squares.length).toEqual(1);
      expect(result.squares[0].id).toEqual(4);
    });
  });

  describe('inRange', () => {
    it('must return squares within that range', () => {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 1, y: 1, piece: { selected: false, playerNumber: 2 } },
          { id: 2, x: 2, y: 2, piece: null },
          { id: 3, x: 3, y: 3, piece: null },
          { id: 4, x: 4, y: 4, piece: { selected: false, playerNumber: 1 } },
          { id: 5, x: 4, y: 5, piece: null },
          { id: 6, x: 4, y: 6, piece: null },
          { id: 6, x: 4, y: 7, piece: null },
        ]
      });
      let origin = new Square({ id: 4, x: 4, y: 4, piece: { selected: false, playerNumber: 1 }});

      let result = inRange(squareSet, origin, 2);
      expect(result.squares.length).toEqual(5);
      expect(result.squares[0].id).toEqual(2);
      expect(result.squares[1].id).toEqual(3);
      expect(result.squares[2].id).toEqual(4);
      expect(result.squares[3].id).toEqual(5);
      expect(result.squares[4].id).toEqual(6);
    });
  });

  describe('atRange', () => {
    it('must return squares at that range', () => {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 1, y: 1, piece: { selected: false, playerNumber: 2 } },
          { id: 2, x: 2, y: 2, piece: null },
          { id: 3, x: 3, y: 3, piece: null },
          { id: 4, x: 4, y: 4, piece: { selected: false, playerNumber: 1 } },
          { id: 5, x: 4, y: 5, piece: null },
          { id: 6, x: 4, y: 6, piece: null },
          { id: 6, x: 4, y: 7, piece: null },
        ]
      });
      let origin = new Square({ id: 4, x: 4, y: 4, piece: { selected: false, playerNumber: 1 }});

      let result = atRange(squareSet, origin, 2);
      expect(result.squares.length).toEqual(2);
      expect(result.squares[0].id).toEqual(2);
      expect(result.squares[1].id).toEqual(6);
    });
  });

  describe('inDirection', () => {
    it('returns alls squares in that players direction', () => {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 1, y: 1, piece: { selected: false, playerNumber: 2 } },
          { id: 2, x: 2, y: 2, piece: null },
          { id: 3, x: 3, y: 3, piece: null },
          { id: 4, x: 4, y: 4, piece: { selected: false, playerNumber: 1 } },
          { id: 5, x: 4, y: 5, piece: null },
          { id: 6, x: 4, y: 6, piece: null },
          { id: 6, x: 4, y: 7, piece: null },
        ]
      });
      let origin = new Square({ id: 4, x: 4, y: 4, piece: { selected: false, playerNumber: 1 }});

      let result = inDirection(squareSet, origin, 1);
      expect(result.squares.length).toEqual(3);
      expect(result.squares[0].id).toEqual(1);
      expect(result.squares[1].id).toEqual(2);
      expect(result.squares[2].id).toEqual(3);
    });
  });

  describe('orthogonal', () => {
    it('returns all squares orthogonal to origin', () => {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 1, y: 1, piece: { selected: false, playerNumber: 2 } },
          { id: 2, x: 2, y: 2, piece: null },
          { id: 3, x: 3, y: 3, piece: null },
          { id: 4, x: 4, y: 4, piece: { selected: false, playerNumber: 1 } },
          { id: 5, x: 4, y: 5, piece: null },
          { id: 6, x: 4, y: 6, piece: null },
          { id: 7, x: 4, y: 7, piece: null },
        ]
      });
      let origin = new Square({ id: 4, x: 4, y: 4, piece: { selected: false, playerNumber: 1 }});

      let result = orthogonal(squareSet, origin);
      expect(result.squares.length).toEqual(4);
      expect(result.squares[0].id).toEqual(4);
      expect(result.squares[1].id).toEqual(5);
      expect(result.squares[2].id).toEqual(6);
      expect(result.squares[3].id).toEqual(7);
    });
  });

  describe('diagonal', () => {
    it('must return all squares diagonal to origin', () => {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 1, y: 1, piece: { selected: false, playerNumber: 2 } },
          { id: 2, x: 2, y: 2, piece: null },
          { id: 3, x: 3, y: 3, piece: null },
          { id: 4, x: 4, y: 4, piece: { selected: false, playerNumber: 1 } },
          { id: 5, x: 4, y: 5, piece: null },
          { id: 6, x: 4, y: 6, piece: null },
          { id: 7, x: 4, y: 7, piece: null },
        ]
      });
      let origin = new Square({ id: 4, x: 4, y: 4, piece: { selected: false, playerNumber: 1 }});

      let result = diagonal(squareSet, origin);
      expect(result.squares.length).toEqual(4);
      expect(result.squares[0].id).toEqual(1);
      expect(result.squares[1].id).toEqual(2);
      expect(result.squares[2].id).toEqual(3);
      expect(result.squares[3].id).toEqual(4);
    });
  });

  describe('sideways', () => {
    it('must return all squares sideways to the origin', () => {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 1, y: 1, piece: { selected: false, playerNumber: 2 } },
          { id: 2, x: 2, y: 2, piece: null },
          { id: 3, x: 3, y: 3, piece: null },
          { id: 4, x: 4, y: 4, piece: { selected: false, playerNumber: 1 } },
          { id: 5, x: 4, y: 5, piece: null },
          { id: 6, x: 4, y: 6, piece: null },
          { id: 7, x: 4, y: 7, piece: null },
          { id: 8, x: 5, y: 4, piece: null },
          { id: 9, x: 6, y: 4, piece: null },
          { id: 10, x: 7, y: 4, piece: null },
        ]
      });
      let origin = new Square({ id: 4, x: 4, y: 4, piece: { selected: false, playerNumber: 1 }});

      let result = sideways(squareSet, origin);
      expect(result.squares.length).toEqual(4);
      expect(result.squares[0].id).toEqual(4);
      expect(result.squares[1].id).toEqual(8);
      expect(result.squares[2].id).toEqual(9);
      expect(result.squares[3].id).toEqual(10);
    });
  });

  describe('orthogonalOrDiagonal', () => {
    it('must return square that are orthogonal or diagonal to the origin', () => {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 1, y: 1, piece: { selected: false, playerNumber: 2 } },
          { id: 2, x: 2, y: 2, piece: null },
          { id: 3, x: 3, y: 3, piece: null },
          { id: 4, x: 4, y: 4, piece: { selected: false, playerNumber: 1 } },
          { id: 5, x: 4, y: 5, piece: null },
          { id: 6, x: 4, y: 6, piece: null },
          { id: 7, x: 5, y: 6, piece: null },
          { id: 8, x: 4, y: 7, piece: null },
        ]
      });
      let origin = new Square({ id: 4, x: 4, y: 4, piece: { selected: false, playerNumber: 1 }});

      let result = orthogonalOrDiagonal(squareSet, origin);
      expect(result.squares.length).toEqual(7);
      expect(result.squares[0].id).toEqual(1);
      expect(result.squares[1].id).toEqual(2);
      expect(result.squares[2].id).toEqual(3);
      expect(result.squares[3].id).toEqual(4);
      expect(result.squares[4].id).toEqual(5);
      expect(result.squares[5].id).toEqual(6);
      expect(result.squares[6].id).toEqual(8);
    });
  });

  describe('notOrthogonalOrDiagonal', () => {
    it('must return the squares that are not orthogonal or diagonal', () => {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 1, y: 1, piece: { selected: false, playerNumber: 2 } },
          { id: 2, x: 2, y: 2, piece: null },
          { id: 3, x: 3, y: 3, piece: null },
          { id: 4, x: 4, y: 4, piece: { selected: false, playerNumber: 1 } },
          { id: 5, x: 4, y: 5, piece: null },
          { id: 6, x: 4, y: 6, piece: null },
          { id: 7, x: 5, y: 6, piece: null },
          { id: 8, x: 4, y: 7, piece: null },
        ]
      });
      let origin = new Square({ id: 4, x: 4, y: 4, piece: { selected: false, playerNumber: 1 }});

      let result = notOrthogonalOrDiagonal(squareSet, origin);
      expect(result.squares.length).toEqual(1);
      expect(result.squares[0].id).toEqual(7);
    });
  });

  describe('occupied', () => {
    it('must return a set of elements occupied', () => {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 2, y: 3, piece: { selected: false, playerNumber: 1 } },
          { id: 2, x: 3, y: 4, piece: null },
          { id: 3, x: 4, y: 5, piece: { selected: false, playerNumber: 2 } }
        ]
      });

      let result = occupied(squareSet);
      expect(result.squares.length).toEqual(2);
      expect(result.squares[0].id).toEqual(1);
      expect(result.squares[1].id).toEqual(3);
    });
  });

  describe('unoccupied', () => {
    it('must return a set of elements not occupied', () => {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 2, y: 3, piece: { selected: false, playerNumber: 1 } },
          { id: 2, x: 3, y: 4, piece: null },
          { id: 3, x: 4, y: 5, piece: { selected: false, playerNumber: 2 } }
        ]
      });

      let result = unoccupied(squareSet);
      expect(result.squares.length).toEqual(1);
      expect(result.squares[0].id).toEqual(2);
    });
  });

  describe('occupiedByPlayer', () => {
    it('must return a set of elements occupied by the player', () => {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 2, y: 3, piece: { selected: false, playerNumber: 1 } },
          { id: 2, x: 3, y: 4, piece: null },
          { id: 3, x: 4, y: 5, piece: { selected: false, playerNumber: 2 } }
        ]
      });

      let result = occupiedByPlayer(squareSet, 1);
      expect(result.squares.length).toEqual(1);
      expect(result.squares[0].id).toEqual(1);
    });
  });

  describe('occupiedByOpponentOf', () => {
    it('must return a set of elements occupied by the opponent of the player', () => {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 2, y: 3, piece: { selected: false, playerNumber: 1 } },
          { id: 2, x: 3, y: 4, piece: null },
          { id: 3, x: 4, y: 5, piece: { selected: false, playerNumber: 2 } }
        ]
      });

      let result = occupiedByOpponentOf(squareSet, 1);
      expect(result.squares.length).toEqual(1);
      expect(result.squares[0].id).toEqual(3);
    });
  });

  describe('unblocked', () => {
    it('must return possible destinations', () => {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 7, y: 7, piece: { selected: false, playerNumber: 1 } },
          { id: 2, x: 7, y: 6, piece: null },
          { id: 3, x: 7, y: 5, piece: { selected: false, playerNumber: 1 } },
          { id: 4, x: 7, y: 4, piece: null }
        ]
      });
      let origin = new Square({ id: 1, x: 7, y: 7, piece: { selected: false, playerNumber: 1 }});

      let result = unblocked(squareSet, origin, squareSet); 
      expect(result.squares.length).toEqual(3);
      expect(result.squares[0].id).toEqual(1);
      expect(result.squares[1].id).toEqual(2);
      expect(result.squares[2].id).toEqual(3);
    });
  });

  describe('between', () => {
    describe('when squares are diagonal', () => {
      it('returns the squares between the two', () => {
        let squareSet = new SquareSet({
          squares: [
            { id: 1, x: 1, y: 1, piece: { selected: false, playerNumber: 2 } },
            { id: 2, x: 2, y: 2, piece: null },
            { id: 3, x: 3, y: 3, piece: null },
            { id: 4, x: 3, y: 4, piece: null },
            { id: 5, x: 4, y: 4, piece: null },
            { id: 6, x: 5, y: 5, piece: null },
          ]
        });
        let origin = new Square({ id: 1, x: 1, y: 1, piece: { selected: false, playerNumber: 2 }});
        let destination = new Square({ id: 5, x: 4, y: 4, piece: null });

        let result = between(squareSet, origin, destination);
        expect(result.squares.length).toEqual(2);
        expect(result.squares[0].id).toEqual(2);
        expect(result.squares[1].id).toEqual(3);
      });
    });

    describe('when squares are not diagonal', () => {
      it('returns an empty set', () => {
        let squareSet = new SquareSet({
          squares: [
            { id: 1, x: 1, y: 1, piece: { selected: false, playerNumber: 2 } },
            { id: 2, x: 2, y: 2, piece: null },
            { id: 3, x: 3, y: 3, piece: null },
            { id: 4, x: 3, y: 4, piece: null },
            { id: 5, x: 4, y: 4, piece: null },
            { id: 6, x: 5, y: 5, piece: null },
          ]
        });
        let origin = new Square({ id: 1, x: 1, y: 1, piece: { selected: false, playerNumber: 2 }});
        let destination = new Square({ id: 4, x: 3, y: 4, piece: null });

        let result = between(squareSet, origin, destination);
        expect(result.squares.length).toEqual(0);
      });
    });
  });
});
