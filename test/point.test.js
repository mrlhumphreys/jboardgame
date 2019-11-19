import Point from '../src/point'

describe('Point', () => {
  describe('add', () => {
    test('must add the points together', () => {
      let a = new Point(1, 1);
      let b = new Point(2, 2);
      let result = a.add(b);
      expect(result.x).toEqual(3);
      expect(result.y).toEqual(3);
    });
  });

  describe('two points with the same coordinates', () => {
    test("must be equal", () => {
      let a = new Point(1, 1);
      let b = new Point(1, 1);
      expect(a.eq(b)).toBe(true);
      expect(a.notEq(b)).toBe(false);
    });
  });

  describe("two points with different same coordinates", () => {
    test("must not be equal", () => {
      let a = new Point(1, 1);
      let b = new Point(2, 2);
      expect(a.eq(b)).toBe(false);
      expect(a.notEq(b)).toBe(true);
    });
  });
});