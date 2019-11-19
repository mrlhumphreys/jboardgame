import Direction from '../src/direction'

describe("Direction", () => {
  describe("initialize", () => {
    it("must set x and y", () => {
      let direction = new Direction(1,2);
      expect(direction.x).toEqual(1);
      expect(direction.y).toEqual(2);
    });
  });
});
