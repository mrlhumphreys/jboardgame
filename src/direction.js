/** The direction unit */
class Direction {
  /** 
   * Create a direction.
   * @param {number} x - The x direction.
   * @param {number} y - The y direction.
   */
  constructor(x, y) {
    /** @member {number} */
    this.x = x;

    /** @member {number} */
    this.y = y;
  }
};

export default Direction;
