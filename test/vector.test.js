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

  describe("points on with unequal distances on x and y axes", () => {
    it("must not be diagonal", () => {
      let v = new Vector({x: 1, y: 3}, {x: 1, y: 1});
      expect(v.diagonal).toBe(false);
    });

    it("must not have a distance", () => {
      let v = new Vector({x: 1, y: 3}, {x: 1, y: 1});
      expect(v.distance).toBe(null);
    });
  });

  describe("points on with equal distances on x and y axes", () => {
    it("must be diagonal", () => {
      let v = new Vector({x: 1, y: 1}, {x: 3, y: 3});
      expect(v.diagonal).toBe(true);
    });

    it("must have a distance equal to one of the axes", () => {
      let v = new Vector({x: 1, y: 1}, {x: 3, y: 3});
      expect(v.distance).toBe(2);
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
