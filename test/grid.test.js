import { exists } from '../src/utils'
import Point from '../src/point'

import {
  squaresAsJson,
  squaresDup,
  some,
  many,
  none,
  every,
  map,
  filter,
  push,
  concat,
  union,
  difference,
  intersection,
  uniq,
  where,
  length,
  includes,
  excludes,
  first,
  last,
  selected,
  findById,
  findByCoordinate,
  findByPieceId,
  whereX,
  whereY,
  squaresAwayFrom,
  twoSquaresAwayFrom,
  oneSquareAwayFrom,
  inRange,
  atRange,
  ranksAway,
  filesAway,
  sameRank,
  sameFile,
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
  unoccupiedOrOccupiedByOpponent,
  occupiedByPiece,
  excludingPiece,
  unblocked,
  between
} from '../src/grid'

import {
  squareAsJson,
  squareDup,
  attributeMatch,
  point,
  squareOccupied,
  squareUnoccupied,
  squareOccupiedByPlayer,
  squareOccupiedByOpponentOf,
  squareUnoccupiedOrOccupiedByOpponentOf,
  squareOccupiedByPiece,
  squareNotOccupiedByPiece,
} from '../src/square'

class Square {
  constructor(args) {
    this.id = args.id;
    this.x = args.x;
    this.y = args.y;
    this.piece = args.piece;

    this.asJson = squareAsJson;
    this.dup = squareDup;
    this.attributeMatch = attributeMatch;
    this.point = point;
    this.occupied = squareOccupied;
    this.unoccupied = squareUnoccupied;
    this.occupiedByPlayer = squareOccupiedByPlayer;
    this.occupiedByOpponentOf = squareOccupiedByOpponentOf;
    this.unoccupiedOrOccupiedByOpponentOf = squareUnoccupiedOrOccupiedByOpponentOf;
    this.occupiedByPiece = squareOccupiedByPiece;
    this.notOccupiedByPiece = squareNotOccupiedByPiece;
  }
}

class SquareSet {
  constructor(args) {
    this.squares = args.squares.map(function(s) { return new Square(s) });
    this.squaresAsJson = squaresAsJson;
    this.dup = squaresDup;
    this.some = some;
    this.many = many;
    this.none = none;
    this.every = every;
    this.map = map;
    this.filter = filter;
    this.push = push;
    this.concat = concat;
    this.union = union;
    this.difference = difference;
    this.intersection = intersection;
    this.uniq = uniq;
    this.where = where;
    this.length = length;
    this.includes = includes;
    this.excludes = excludes;
    this.first = first;
    this.last = last;
    this.selected = selected;
    this.findById = findById;
    this.findByCoordinate = findByCoordinate;
    this.findByPieceId = findByPieceId;
    this.whereX = whereX;
    this.whereY = whereY;
    this.squaresAwayFrom = squaresAwayFrom;
    this.twoSquaresAwayFrom = twoSquaresAwayFrom;
    this.oneSquareAwayFrom = oneSquareAwayFrom;
    this.inRange = inRange;
    this.atRange = atRange;
    this.ranksAway = ranksAway;
    this.filesAway = filesAway;
    this.sameRank = sameRank;
    this.sameFile = sameFile;
    this.inDirection = inDirection;
    this.orthogonal = orthogonal;
    this.diagonal = diagonal;
    this.sideways = sideways;
    this.orthogonalOrDiagonal = orthogonalOrDiagonal;
    this.notOrthogonalOrDiagonal = notOrthogonalOrDiagonal;
    this.occupied = occupied;
    this.unoccupied = unoccupied;
    this.occupiedByPlayer = occupiedByPlayer;
    this.occupiedByOpponentOf = occupiedByOpponentOf;
    this.unoccupiedOrOccupiedByOpponent = unoccupiedOrOccupiedByOpponent;
    this.occupiedByPiece = occupiedByPiece;
    this.excludingPiece = excludingPiece;
    this.unblocked = unblocked;
    this.between = between;
  }
}

describe('grid', () => {
  describe('squaresAsJson', () => {
    it('must return an array of simple objects', () => {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 2, y: 3, piece: null },
          { id: 2, x: 3, y: 4, piece: null }
        ]
      });
      let expected = {
        squares: [
          { id: 1, x: 2, y: 3, piece: null },
          { id: 2, x: 3, y: 4, piece: null }
        ]
      };

      let result = squareSet.squaresAsJson();

      expect(result).toEqual(expected);
    });
  });

  describe('dup', () => {
    it('returns a square set with the same content', () => {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 2, y: 3, piece: { selected: false } },
          { id: 2, x: 3, y: 4, piece: { selected: true } },
          { id: 3, x: 4, y: 5, piece: { selected: false } }
        ]
      });

      let result = squareSet.dup();
      expect(result.squares.length).toEqual(squareSet.squares.length);      
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

        let result = squareSet.some();
        expect(result).toBe(true);
      });
    });

    describe('with no elements', () => {
      it('must return false', () => {
        let squareSet = new SquareSet({
          squares: []
        });

        let result = squareSet.some();
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

        let result = squareSet.many();
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

        let result = squareSet.many();
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

        let result = squareSet.none();
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

        let result = squareSet.none();
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

        let result = squareSet.every(function(s) { return s.piece === null; });
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

        let result = squareSet.every(function(s) { return s.piece === null; });
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
      let result = squareSet.map(function(s) { return s.x; });
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

      let result = squareSet.filter(function(s) { return s.x == 3; });
      expect(result.squares.length).toEqual(1);
      expect(result.squares[0].id).toEqual(2);
    });
  });

  describe('push', () => {
    describe('object', () => {
      let squareSet = new SquareSet({ squares: [] });
      let square = new Square({ id: 1, x: 2, y: 3, piece: { selected: false }});

      let result = squareSet.push(square);

      expect(result.squares.length).toEqual(1);
      expect(result.squares[0].id).toEqual(1);
    });

    describe('null', () => {
      let squareSet = new SquareSet({ squares: [] });

      let result = squareSet.push(null);

      expect(result.squares.length).toEqual(0);
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

      let result = squareSetA.concat(squareSetB);
      expect(result.squares.length).toEqual(2);
      expect(result.squares[0].id).toEqual(1);
      expect(result.squares[1].id).toEqual(2);
    });
  });

  describe('union', () => {
    it('returns a square set with all elements without duplicates', () => {
      let squareSetA = new SquareSet({
        squares: [
          { id: 1, x: 2, y: 3, piece: { selected: false } },
          { id: 2, x: 3, y: 4, piece: { selected: true } },
        ]
      });

      let squareSetB = new SquareSet({
        squares: [
          { id: 2, x: 3, y: 4, piece: { selected: true } },
          { id: 3, x: 4, y: 5, piece: { selected: true } }
        ]
      });

      let result = squareSetA.union(squareSetB);
      expect(result.squares.length).toEqual(3);
      expect(result.squares[0].id).toEqual(1);
      expect(result.squares[1].id).toEqual(2);
      expect(result.squares[2].id).toEqual(3);
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

      let result = squareSetA.difference(squareSetB);
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

      let result = squareSetA.intersection(squareSetB);
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

      let result = squareSet.uniq();
      expect(result.squares.length).toEqual(2);
      expect(result.squares[0].id).toEqual(1);
      expect(result.squares[1].id).toEqual(2);
    });
  });

  describe('where', () => {
    it('must return squares matching attribute', function() {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 2, y: 3, piece: { selected: false } },
          { id: 2, x: 3, y: 4, piece: { selected: true } },
        ]
      });

      let result = squareSet.where({x: 2});
      expect(result.squares.length).toEqual(1);
      expect(result.squares[0].x).toEqual(2);
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
      let result = squareSet.length();
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
        let result = squareSet.includes(square);
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
        let result = squareSet.includes(square);
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
        let result = squareSet.includes(undefined);
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
        let result = squareSet.excludes(square);
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
        let result = squareSet.excludes(square);
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
        let result = squareSet.excludes(undefined);
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

      let result = squareSet.first();
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

      let result = squareSet.last();
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
      let result = squareSet.selected();
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
        let result = squareSet.findById(undefined);
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
        let result = squareSet.findById([1,2]);
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
        let result = squareSet.findById(1);
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
      let result = squareSet.findByCoordinate(2, 3);
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

      let result = squareSet.findByPieceId(20);
      expect(result.id).toEqual(2);
    });
  });

  describe('whereX', () => {
    it('must return all squares with the matching x co-ordinate', () => {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 2, y: 3, piece: { id: 10, playerNumber: 1 } },
          { id: 2, x: 3, y: 4, piece: { id: 20, playerNumber: 1 } }
        ]
      });

      let result = squareSet.whereX(3);

      expect(result.length()).toEqual(1);
      expect(result.squares[0].id).toEqual(2);
    });
  });

  describe('whereY', () => {
    it('must return all squares with the matching y co-ordinate', () => {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 2, y: 3, piece: { id: 10, playerNumber: 1 } },
          { id: 2, x: 3, y: 4, piece: { id: 20, playerNumber: 1 } }
        ]
      });

      let result = squareSet.whereY(3);

      expect(result.length()).toEqual(1);
      expect(result.squares[0].id).toEqual(1);
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

      let result = squareSet.squaresAwayFrom(3, origin);
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

      let result = squareSet.twoSquaresAwayFrom(origin);
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

      let result = squareSet.oneSquareAwayFrom(origin);
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

      let result = squareSet.inRange(origin, 2);
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

      let result = squareSet.atRange(origin, 2);
      expect(result.squares.length).toEqual(2);
      expect(result.squares[0].id).toEqual(2);
      expect(result.squares[1].id).toEqual(6);
    });
  });

  describe('ranksAway', () => {
    it('must return squares at n ranks away', () => {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 1, y: 1, piece: { selected: false, playerNumber: 2 } },
          { id: 2, x: 2, y: 2, piece: null },
          { id: 3, x: 3, y: 3, piece: null },
          { id: 4, x: 4, y: 4, piece: { selected: false, playerNumber: 1 } },
          { id: 5, x: 4, y: 5, piece: null },
          { id: 6, x: 4, y: 6, piece: null },
          { id: 6, x: 4, y: 7, piece: null },
          { id: 7, x: 5, y: 4, piece: null },
          { id: 8, x: 6, y: 4, piece: null }
        ]
      });
      let origin = new Square({ id: 4, x: 4, y: 4, piece: { selected: false, playerNumber: 1 }});

      let result = squareSet.ranksAway(origin, 2);
      expect(result.squares.length).toEqual(2);
      expect(result.squares[0].id).toEqual(2);
      expect(result.squares[1].id).toEqual(6);
    });
  });

  describe('filesAway', () => {
    it('must return squares at n files away', () => {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 1, y: 1, piece: { selected: false, playerNumber: 2 } },
          { id: 2, x: 2, y: 2, piece: null },
          { id: 3, x: 3, y: 3, piece: null },
          { id: 4, x: 4, y: 4, piece: { selected: false, playerNumber: 1 } },
          { id: 5, x: 4, y: 5, piece: null },
          { id: 6, x: 4, y: 6, piece: null },
          { id: 6, x: 4, y: 7, piece: null },
          { id: 7, x: 5, y: 4, piece: null },
          { id: 8, x: 6, y: 4, piece: null }
        ]
      });
      let origin = new Square({ id: 4, x: 4, y: 4, piece: { selected: false, playerNumber: 1 }});

      let result = squareSet.filesAway(origin, 2);
      expect(result.squares.length).toEqual(2);
      expect(result.squares[0].id).toEqual(2);
      expect(result.squares[1].id).toEqual(8);
    });
  });

  describe('sameRank', () => {
    it('returns squares with the same y co-ordinate', function() {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 1, y: 1, piece: null },
          { id: 2, x: 2, y: 1, piece: null },
          { id: 3, x: 2, y: 2, piece: null }
        ]
      });

      let origin = new Square({ id: 2, x: 2, y: 1, piece: null});

      let result = squareSet.sameRank(origin);
      expect(result.squares.length).toEqual(2);
      expect(result.squares[0].y).toEqual(1);
      expect(result.squares[1].y).toEqual(1);
    });
  });

  describe('sameFile', () => {
    it('returns squares with the same x co-ordinate', function() {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 1, y: 1, piece: null },
          { id: 2, x: 2, y: 1, piece: null },
          { id: 3, x: 2, y: 2, piece: null }
        ]
      });

      let origin = new Square({ id: 2, x: 2, y: 1, piece: null});

      let result = squareSet.sameFile(origin);
      expect(result.squares.length).toEqual(2);
      expect(result.squares[0].x).toEqual(2);
      expect(result.squares[1].x).toEqual(2);
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

      let result = squareSet.inDirection(origin, 1);
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

      let result = squareSet.orthogonal(origin);
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

      let result = squareSet.diagonal(origin);
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

      let result = squareSet.sideways(origin);
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

      let result = squareSet.orthogonalOrDiagonal(origin);
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

      let result = squareSet.notOrthogonalOrDiagonal(origin);
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

      let result = squareSet.occupied();
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

      let result = squareSet.unoccupied();
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

      let result = squareSet.occupiedByPlayer(1);
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

      let result = squareSet.occupiedByOpponentOf(1);
      expect(result.squares.length).toEqual(1);
      expect(result.squares[0].id).toEqual(3);
    });
  });

  describe('unoccupiedOrOccupiedByOpponent', () => {
    it('returns unoccupied or occupied by opponent squares', () => {
      let squareSet = new SquareSet({
        squares: [
          { id: 1, x: 2, y: 3, piece: { selected: false, playerNumber: 1 } },
          { id: 2, x: 3, y: 4, piece: null },
          { id: 3, x: 4, y: 5, piece: { selected: false, playerNumber: 2 } }
        ]
      });

      let result = squareSet.unoccupiedOrOccupiedByOpponent(1);
      expect(result.squares.length).toEqual(2);
      expect(result.squares[0].id).toEqual(2);
      expect(result.squares[1].id).toEqual(3);
    });
  });

  describe('occupiedByPiece', () => {
    describe('with string', () => {
      it('returns pieces occupied by that piece type', () => {
        let squareSet = new SquareSet({
          squares: [
            { id: 1, x: 2, y: 3, piece: { selected: false, playerNumber: 1, type: 'king' } },
            { id: 2, x: 3, y: 4, piece: { selected: false, playerNumber: 1, type: 'pawn' } },
            { id: 3, x: 4, y: 5, piece: { selected: false, playerNumber: 1, type: 'rook' } }
          ]
        });

        let result = squareSet.occupiedByPiece('king');

        expect(result.squares.length).toEqual(1);
        expect(result.squares[0].piece.type).toEqual('king');
      });
    });

    describe('with array', () => {
      it('returns pieces matching any of the types in the array', () => {
        let squareSet = new SquareSet({
          squares: [
            { id: 1, x: 2, y: 3, piece: { selected: false, playerNumber: 1, type: 'king' } },
            { id: 2, x: 3, y: 4, piece: { selected: false, playerNumber: 1, type: 'pawn' } },
            { id: 3, x: 4, y: 5, piece: { selected: false, playerNumber: 1, type: 'rook' } }
          ]
        });

        let result = squareSet.occupiedByPiece(['king']);

        expect(result.squares.length).toEqual(1);
        expect(result.squares[0].piece.type).toEqual('king');
      });
    });
  });

  describe('excludingPiece', () => {
    describe('with single string', () => {
      it('returns squares occupied by without that piece', () => {
        let squareSet = new SquareSet({
          squares: [
            { id: 1, x: 2, y: 3, piece: { selected: false, playerNumber: 1, type: 'king' } },
            { id: 2, x: 3, y: 4, piece: { selected: false, playerNumber: 1, type: 'pawn' } },
            { id: 3, x: 4, y: 5, piece: { selected: false, playerNumber: 1, type: 'rook' } }
          ]
        });

        let result = squareSet.excludingPiece('king');

        expect(result.squares.length).toEqual(2);
        expect(result.squares[0].piece.type).toEqual('pawn');
        expect(result.squares[1].piece.type).toEqual('rook');
      });
    });

    describe('with array of strings', () => {
      it('returns squares occupied by without that piece', () => {
        let squareSet = new SquareSet({
          squares: [
            { id: 1, x: 2, y: 3, piece: { selected: false, playerNumber: 1, type: 'king' } },
            { id: 2, x: 3, y: 4, piece: { selected: false, playerNumber: 1, type: 'pawn' } },
            { id: 3, x: 4, y: 5, piece: { selected: false, playerNumber: 1, type: 'rook' } }
          ]
        });

        let result = squareSet.excludingPiece(['king']);

        expect(result.squares.length).toEqual(2);
        expect(result.squares[0].piece.type).toEqual('pawn');
        expect(result.squares[1].piece.type).toEqual('rook');
      });
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

      let result = squareSet.unblocked(origin, squareSet); 
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

        let result = squareSet.between(origin, destination);
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

        let result = squareSet.between(origin, destination);
        expect(result.squares.length).toEqual(0);
      });
    });
  });
});
