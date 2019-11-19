import { exists } from '../src/utils'
import Point from '../src/point'
import {
  squaresAsJson,
  findById,
  findByCoordinate,
  selected,
  length,
  map,
  include,
  difference,
  first,
  last,
  many,
  any,
  empty,
  filter,
  occupiedByOpponentOf,
  occupiedBy,
  occupied,
  unoccupied,
  squaresAwayFrom,
  twoSquaresAwayFrom,
  oneSquareAwayFrom,
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

  occupiedBy(playerNumber) {
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

  describe('include', () => {
    describe('with the element in the set', () => {
      it('must return true', () => {
        let squareSet = new SquareSet({
          squares: [
            { id: 1, x: 2, y: 3, piece: { selected: false } },
            { id: 2, x: 3, y: 4, piece: { selected: true } }
          ]
        });
        let square = new Square({ id: 1, x: 2, y: 3, piece: { selected: false }});
        let result = include(squareSet, square);
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
        let result = include(squareSet, square);
        expect(result).toBe(false);
      });
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

  describe('any', () => {
    describe('with at least one element', () => {
      it('must return true', () => {
        let squareSet = new SquareSet({
          squares: [
            { id: 1, x: 2, y: 3, piece: { selected: false } },
            { id: 2, x: 3, y: 4, piece: { selected: true } },
            { id: 3, x: 4, y: 5, piece: { selected: false } }
          ]
        });

        let result = any(squareSet);
        expect(result).toBe(true);
      });
    });

    describe('with no elements', () => {
      it('must return false', () => {
        let squareSet = new SquareSet({
          squares: []
        });

        let result = any(squareSet);
        expect(result).toBe(false);
      });
    });
  });

  describe('empty', () => {
    describe('with no elements', () => {
      it('must return true', () => {
        let squareSet = new SquareSet({
          squares: []
        });

        let result = empty(squareSet);
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

        let result = empty(squareSet);
        expect(result).toBe(false);
      });
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

  describe('occupiedBy', () => {
    it('must return a set of elements occupied by the player', () => {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 2, y: 3, piece: { selected: false, playerNumber: 1 } },
          { id: 2, x: 3, y: 4, piece: null },
          { id: 3, x: 4, y: 5, piece: { selected: false, playerNumber: 2 } }
        ]
      });

      let result = occupiedBy(squareSet, 1);
      expect(result.squares.length).toEqual(1);
      expect(result.squares[0].id).toEqual(1);
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
