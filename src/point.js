/** A point on a cartesian plane */
class Point {
  /**
   * Create a point.
   * @param {number} x - The x co-ordinate.
   * @param {number} y - The y co-ordinate.
   */
  constructor(x, y) {
    /** @member {number} */
    this.x = x;

    /** @member {number} */
    this.y = y;
  }

  /** 
   * Add two points together.
   * @param {Point} point - The other point.
   * @return {Point}
   */
  add(point) {
    let newX = this.x + point.x;
    let newY = this.y + point.y;
    return new Point(newX, newY);
  }

  /**
   * Are the points equal?
   * @param {Point} point - The other point.
   * @return {Point}
   */
  eq(point) {
    return (this.x === point.x) && (this.y === point.y);
  }

  /**
   * Are the points not equal?
   * @param {Point} point - The other point.
   * @return {Point}
   */
  notEq(point) {
    return !this.eq(point);
  }
}

export default Point;
