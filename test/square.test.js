import Point from '../src/point'
import { exists } from '../src/utils'

import {
  squareAsJson,
  squareDup,
  attributeMatch,
  squareOccupied,
  squareUnoccupied,
  squareOccupiedByPlayer,
  squareOccupiedByOpponentOf,
  squareUnoccupiedOrOccupiedByOpponentOf,
  squareOccupiedByPiece,
  squareNotOccupiedByPiece,
  point,
  select,
  deselect,
  addPiece,
  removePiece
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
    this.occupied = squareOccupied;
    this.unoccupied = squareUnoccupied;
    this.occupiedByPlayer = squareOccupiedByPlayer;
    this.occupiedByOpponentOf = squareOccupiedByOpponentOf;
    this.unoccupiedOrOccupiedByOpponentOf = squareUnoccupiedOrOccupiedByOpponentOf;
    this.occupiedByPiece = squareOccupiedByPiece;
    this.notOccupiedByPiece = squareNotOccupiedByPiece;
    this.point = point;
    this.select = select;
    this.deselect = deselect;
    this.addPiece = addPiece;
    this.removePiece = removePiece;
  }
}

class Piece {
  constructor(args) {
    this.id = args.id;
    this.playerNumber = args.player_number;
    this.type = args.type;
    this.selected = exists(args.selected) || false;
  }

  select() {
    this.selected = true;
  }

  deselect() {
    this.selected = false;
  }
}

describe('square', () => {
  describe('asJson', () => {
    it('returns a json representation of the square', () => {
      let square = new Square({
        id: 1,
        x: 2,
        y: 3,
        piece: { 
          id: 1, 
          player_number: 2, 
          type: 'pawn',
          asJson: {
            id: 1,
            player_number: 2,
            type: 'pawn'
          }
        }
      });

      let expected = {
        id: 1,
        x: 2,
        y: 3,
        piece: {
          id: 1,
          player_number: 2,
          type: 'pawn'
        }
      };

      let result = square.asJson();

      expect(result).toEqual(expected);
    });
  });

  describe('dup', () => {
    it('returns a duplicate of the square', () => {
      let square = new Square({
        id: 1,
        x: 2,
        y: 3,
        piece: { id: 1, player_number: 2, type: 'pawn', dup: { id: 1, player_number: 2, type: 'pawn' } }
      });

      let result = square.dup();

      expect(result.constructor).toEqual(Square); 
      expect(result.id).toEqual(1);
      expect(result.x).toEqual(2);
      expect(result.y).toEqual(3);
      expect(result.piece).toEqual({ id: 1, player_number: 2, type: 'pawn'});
    });
  });

  describe('attributeMatch', () => {
    describe('deep match', () => {
      it('returns true if value matches deep attribute', () => {
        let square = new Square({
          id: 1,
          x: 2,
          y: 3,
          piece: { id: 1, player_number: 2, type: 'pawn' }
        });

        let result = square.attributeMatch('piece', { player_number: 2 });

        expect(result).toBe(true);
      });

      it('returns false if value does not match deep attribute', () => {
        let square = new Square({
          id: 1,
          x: 2,
          y: 3,
          piece: { id: 1, player_number: 2, type: 'pawn' }
        });

        let result = square.attributeMatch('piece', { player_number: 1 });

        expect(result).toBe(false);
      });
    });

    describe('in array match', () => {
      it('returns true if value in array', () => {
        let square = new Square({
          id: 1,
          x: 2,
          y: 3,
          piece: { id: 1, player_number: 2, type: 'pawn' }
        });

        let result = square.attributeMatch('x', [2,3]);

        expect(result).toBe(true);
      });

      it('returns false if value not in array', () => {
        let square = new Square({
          id: 1,
          x: 2,
          y: 3,
          piece: { id: 1, player_number: 2, type: 'pawn' }
        });

        let result = square.attributeMatch('x', [4,5]);

        expect(result).toBe(false);
      });
    });

    describe('function match', () => {
      it('returns true if function returns true', () => {
        let square = new Square({
          id: 1,
          x: 2,
          y: 3,
          piece: { id: 1, player_number: 2, type: 'pawn' }
        });

        let result = square.attributeMatch('x', (x) => { return x === 2; });

        expect(result).toBe(true);
      });

      it('returns false if function returns false', () => {
        let square = new Square({
          id: 1,
          x: 2,
          y: 3,
          piece: { id: 1, player_number: 2, type: 'pawn' }
        });

        let result = square.attributeMatch('x', (x) => { return x === 5; });

        expect(result).toBe(false);
      });
    });

    describe('value match', () => {
      it('returns true if values are equal', () => {
        let square = new Square({
          id: 1,
          x: 2,
          y: 3,
          piece: { id: 1, player_number: 2, type: 'pawn' }
        });

        let result = square.attributeMatch('x', 2);

        expect(result).toBe(true);
      });

      it('returns false if values are not equal', () => {
        let square = new Square({
          id: 1,
          x: 2,
          y: 3,
          piece: { id: 1, player_number: 2, type: 'pawn' }
        });

        let result = square.attributeMatch('x', 5);

        expect(result).toBe(false);
      });
    });
  });

  describe('occupied', () => {
    it('returns true with piece', () => {
      let square = new Square({
        id: 1,
        x: 2,
        y: 3,
        piece: { id: 1, player_number: 2, type: 'pawn' }
      });

      expect(square.occupied()).toBe(true);
    });

    it('returns false without piece', () => {
      let square = new Square({
        id: 1,
        x: 2,
        y: 3,
        piece: null 
      });

      expect(square.occupied()).toBe(false);
    });
  });

  describe('unoccupied', () => {
    it('returns true without piece', () => {
      let square = new Square({
        id: 1,
        x: 2,
        y: 3,
        piece: null 
      });

      expect(square.unoccupied()).toBe(true);
    });

    it('returns false with piece', () => {
      let square = new Square({
        id: 1,
        x: 2,
        y: 3,
        piece: { id: 1, player_number: 2, type: 'pawn' } 
      });

      expect(square.unoccupied()).toBe(false);
    });
  });

  describe('occupiedByPlayer', () => {
    it('returns true when same player number', () => {
      let square = new Square({
        id: 1,
        x: 2,
        y: 3,
        piece: { id: 1, playerNumber: 1, type: 'pawn' } 
      });

      expect(square.occupiedByPlayer(1)).toBe(true);
    });

    it('returns false when different player number', () => {
      let square = new Square({
        id: 1,
        x: 2,
        y: 3,
        piece: { id: 1, playerNumber: 2, type: 'pawn' } 
      });

      expect(square.occupiedByPlayer(1)).toBe(false);
    });

    it('returns false when no piece', () => {
      let square = new Square({
        id: 1,
        x: 2,
        y: 3,
        piece: null 
      });

      expect(square.occupiedByPlayer(1)).toBe(false);
    });
  });

  describe('occupiedByOpponentOf', () => {
    it('returns true when different player number', () => {
      let square = new Square({
        id: 1,
        x: 2,
        y: 3,
        piece: { id: 1, playerNumber: 1, type: 'pawn' } 
      });

      expect(square.occupiedByOpponentOf(2)).toBe(true);
    });

    it('returns false when same player number', () => {
      let square = new Square({
        id: 1,
        x: 2,
        y: 3,
        piece: { id: 1, playerNumber: 2, type: 'pawn' } 
      });

      expect(square.occupiedByOpponentOf(2)).toBe(false);
    });

    it('returns false when no piece', () => {
      let square = new Square({
        id: 1,
        x: 2,
        y: 3,
        piece: null 
      });

      expect(square.occupiedByOpponentOf(1)).toBe(false);
    });
  });

  describe('unoccupiedOrOccupiedByOpponentOf', () => {
    it('returns true when different player number', () => {
      let square = new Square({
        id: 1,
        x: 2,
        y: 3,
        piece: { id: 1, playerNumber: 1, type: 'pawn' } 
      });

      expect(square.unoccupiedOrOccupiedByOpponentOf(2)).toBe(true);
    });

    it('returns false when same player number', () => {
      let square = new Square({
        id: 1,
        x: 2,
        y: 3,
        piece: { id: 1, playerNumber: 2, type: 'pawn' } 
      });

      expect(square.unoccupiedOrOccupiedByOpponentOf(2)).toBe(false);
    });

    it('returns false when no piece', () => {
      let square = new Square({
        id: 1,
        x: 2,
        y: 3,
        piece: null 
      });

      expect(square.unoccupiedOrOccupiedByOpponentOf(1)).toBe(true);
    });
  });

  describe('occupiedByPiece', () => {
    describe('with single string', () => {
      it('returns true if occupied by that piece', () => {
        let square = new Square({
          id: 1,
          x: 2,
          y: 3,
          piece: { id: 1, playerNumber: 2, type: 'pawn' } 
        });

        expect(square.occupiedByPiece('pawn')).toBe(true);
      });

      it('returns false if not occupied by that piece', () => {
        let square = new Square({
          id: 1,
          x: 2,
          y: 3,
          piece: { id: 1, playerNumber: 2, type: 'king' } 
        });

        expect(square.occupiedByPiece('pawn')).toBe(false);
      });

      it('returns false if not occupied', () => {
        let square = new Square({
          id: 1,
          x: 2,
          y: 3,
          piece: null 
        });

        expect(square.occupiedByPiece('pawn')).toBe(false);
      });
    });

    describe('with array of strings', () => {
      it('returns true if occupied by that piece', () => {
        let square = new Square({
          id: 1,
          x: 2,
          y: 3,
          piece: { id: 1, playerNumber: 2, type: 'pawn' } 
        });

        expect(square.occupiedByPiece(['pawn', 'rook'])).toBe(true);
      });

      it('returns false if not occupied by that piece', () => {
        let square = new Square({
          id: 1,
          x: 2,
          y: 3,
          piece: { id: 1, playerNumber: 2, type: 'king' } 
        });

        expect(square.occupiedByPiece(['pawn','rook'])).toBe(false);
      });

      it('returns false if not occupied', () => {
        let square = new Square({
          id: 1,
          x: 2,
          y: 3,
          piece: null 
        });

        expect(square.occupiedByPiece(['pawn','rook'])).toBe(false);
      });
    });
  });

  describe('notOccupiedByPiece', () => {
    describe('with single string', () => {
      it('returns true if not occupied by that piece', () => {
        let square = new Square({
          id: 1,
          x: 2,
          y: 3,
          piece: { id: 1, playerNumber: 2, type: 'pawn' } 
        });

        expect(square.notOccupiedByPiece('rook')).toBe(true);
      });

      it('returns false if occupied by that piece', () => {
        let square = new Square({
          id: 1,
          x: 2,
          y: 3,
          piece: { id: 1, playerNumber: 2, type: 'king' } 
        });

        expect(square.notOccupiedByPiece('king')).toBe(false);
      });

      it('returns false if not occupied', () => {
        let square = new Square({
          id: 1,
          x: 2,
          y: 3,
          piece: null 
        });

        expect(square.notOccupiedByPiece('pawn')).toBe(false);
      });
    });

    describe('with array of strings', () => {
      it('returns true if not occupied by that piece', () => {
        let square = new Square({
          id: 1,
          x: 2,
          y: 3,
          piece: { id: 1, playerNumber: 2, type: 'pawn' } 
        });

        expect(square.notOccupiedByPiece(['king', 'rook'])).toBe(true);
      });

      it('returns false if occupied by that piece', () => {
        let square = new Square({
          id: 1,
          x: 2,
          y: 3,
          piece: { id: 1, playerNumber: 2, type: 'king' } 
        });

        expect(square.notOccupiedByPiece(['king','rook'])).toBe(false);
      });

      it('returns false if not occupied', () => {
        let square = new Square({
          id: 1,
          x: 2,
          y: 3,
          piece: null 
        });

        expect(square.notOccupiedByPiece(['pawn','rook'])).toBe(false);
      });
    });
  });

  describe('point', () => {
    it('returns a point with the same co-ordinates as the square', () => {
      let square = new Square({
        id: 1,
        x: 2,
        y: 3,
        piece: null 
      });

      let result = square.point(); 

      expect(result.constructor).toEqual(Point);
      expect(result.x).toEqual(square.x);
      expect(result.y).toEqual(square.y);
    });
  });

  describe('select', () => {
    it('selects the piece when there is a piece', () => {
      let piece = new Piece({
        id: 1,
        player_number: 2,
        type: 'pawn',
        selected: false
      });
      let square = new Square({
        id: 1,
        x: 2,
        y: 3,
        piece: piece
      });

      square.select();

      expect(square.piece.selected).toBe(true);
    });

    it('returns false if there is no piece', () => {
      let square = new Square({
        id: 1,
        x: 2,
        y: 3,
        piece: null 
      });

      expect(square.select()).toBe(false);
    });
  });

  describe('deselect', () => {
    it('deselects the piece if there is one', () => {
      let piece = new Piece({
        id: 1,
        player_number: 2,
        type: 'pawn',
        selected: true 
      });
      let square = new Square({
        id: 1,
        x: 2,
        y: 3,
        piece: piece
      });

      square.deselect();

      expect(square.piece.selected).toBe(false);
    });

    it('returns false if there is no piece', () => {
      let square = new Square({
        id: 1,
        x: 2,
        y: 3,
        piece: null 
      });

      expect(square.deselect()).toBe(false);
    });
  });

  describe('addPiece', () => {
    it('adds the piece to the square', () => {
      let piece = new Piece({
        id: 1,
        player_number: 2,
        type: 'pawn',
        selected: true 
      });
      let square = new Square({
        id: 1,
        x: 2,
        y: 3,
        piece: null 
      });

      square.addPiece(piece);

      expect(square.piece.id).toEqual(1);
      expect(square.piece.playerNumber).toEqual(2);
    });
  });

  describe('removePiece', () => {
    it('removes the piece if there is a piece', () => {
      let piece = new Piece({
        id: 1,
        player_number: 2,
        type: 'pawn',
        selected: true 
      });
      let square = new Square({
        id: 1,
        x: 2,
        y: 3,
        piece: piece 
      });

      square.removePiece();

      expect(square.piece).toBe(null);
    });

    it('returns false if there is no piece', () => {
      let square = new Square({
        id: 1,
        x: 2,
        y: 3,
        piece: null 
      });

      expect(square.removePiece()).toBe(false);
    });
  });
});

