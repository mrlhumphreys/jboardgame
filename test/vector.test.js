import Point from '../src/point'
import Direction from '../src/direction'
import Vector from '../src/vector'

describe("Vector", () => {
  describe("dx", () => {
    it("must be the difference on the x axis", () => {
      let v = new Vector({x: 3, y: 1}, {x: 1, y: 1});
      expect(v.dx).toEqual(-2);
    });
  });

  describe("dy", () => {
    it("must be the difference on the y axis", () => {
      let v = new Vector({x: 1, y: 3}, {x: 1, y: 1});
      expect(v.dy).toEqual(-2);
    });
  });

  describe("absDx", () => {
    it("must be the absolute difference on the x axis", () => {
      let v = new Vector({x: 3, y: 1}, {x: 1, y: 1});
      expect(v.absDx).toEqual(2);
    });
  });

  describe("absDy", () => {
    it("must be the absolute difference on the y axis", () => {
      let v = new Vector({x: 1, y: 3}, {x: 1, y: 1});
      expect(v.absDy).toEqual(2);
    });
  });

  describe('diagonal', () => {
    describe('when abs dx and abs dy are equal', () => {
      it('must return true', () => {
        let v = new Vector({x: 3, y: 3}, {x: 4, y: 4});
        expect(v.diagonal).toBe(true);
      });
    });

    describe('when abs dx and abs dy are not equal', () => {
      it('must return false', () => {
        let v = new Vector({x: 3, y: 3}, {x: 3, y: 4});
        expect(v.diagonal).toBe(false);
      });
    });
  });

  describe('orthogonal', () => {
    describe('with the same x co-ordinates', () => {
      it('must return true', () => {
        let v = new Vector({x: 3, y: 3}, {x: 3, y: 4});
        expect(v.orthogonal).toBe(true);
      });
    });

    describe('with the same y co-ordinates', () => {
      it('must return true', () => {
        let v = new Vector({x: 3, y: 3}, {x: 4, y: 3});
        expect(v.orthogonal).toBe(true);
      });
    });

    describe('with different x and y co-ordinates', () => {
      it('must return false', () => {
        let v = new Vector({x: 3, y: 3}, {x: 4, y: 4});
        expect(v.orthogonal).toBe(false);
      });
    });
  });

  describe('orthogonalOrDiagonal', () => {
    describe('orthogonal', () => {
      it('must return true', () => {
        let v = new Vector({x: 3, y: 3}, {x: 3, y: 4});
        expect(v.orthogonalOrDiagonal).toBe(true);
      });
    });

    describe('diagonal', () => {
      it('must return true', () => {
        let v = new Vector({x: 3, y: 3}, {x: 4, y: 4});
        expect(v.orthogonalOrDiagonal).toBe(true);
      });
    });

    describe('l shaped', () => {
      it('must return false', () => {
        let v = new Vector({x: 3, y: 3}, {x: 5, y: 4});
        expect(v.orthogonalOrDiagonal).toBe(false);
      });
    });
  });

  describe('notOrthogonalOrDiagonal', () => {
    describe('orthogonal', () => {
      it('must return false', () => {
        let v = new Vector({x: 3, y: 3}, {x: 3, y: 4});
        expect(v.notOrthogonalOrDiagonal).toBe(false);
      });
    });

    describe('diagonal', () => {
      it('must return false', () => {
        let v = new Vector({x: 3, y: 3}, {x: 4, y: 4});
        expect(v.notOrthogonalOrDiagonal).toBe(false);
      });
    });

    describe('l shaped', () => {
      it('must return true', () => {
        let v = new Vector({x: 3, y: 3}, {x: 5, y: 4});
        expect(v.notOrthogonalOrDiagonal).toBe(true);
      });
    });
  });

  describe('magnitude', () => {
    it('returns the maximum distance', () => {
      let v = new Vector({x: 3, y: 3}, {x: 5, y: 4});
      expect(v.magnitude).toEqual(2);  
    });
  });

  describe("directionY", () => {
    describe("a vector moving down", () => {
      it("must have a positive y direction", () => {
        let v = new Vector({x: 1, y: 1}, {x: 3, y: 3});
        expect(v.directionY).toBe(1);
      });
    });

    describe("a vector moving up", () => {
      it("must have a negative y direction", () => {
        let v = new Vector({x: 3, y: 3}, {x: 1, y: 1});
        expect(v.directionY).toBe(-1);
      });
    });
  });

  describe("directionX", () => {
    describe("a vector moving right", () => {
      it("must have a positive x direction", () => {
        let v = new Vector({x: 1, y: 1}, {x: 3, y: 3});
        expect(v.directionX).toBe(1);
      });
    });

    describe("a vector moving left", () => {
      it("must have a negative x direction", () => {
        let v = new Vector({x: 3, y: 3}, {x: 1, y: 1});
        expect(v.directionX).toBe(-1);
      });
    });
  });

  describe("direction", () => {
    describe("a vector moving towards the bottom right", () => {
      it("must have a positive x and y direction", () => {
        let v = new Vector({x: 1, y: 1}, {x: 3, y: 3});
        expect(v.direction.x).toBe(1);
        expect(v.direction.y).toBe(1);
      });
    });
  });
});
