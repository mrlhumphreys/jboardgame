import Direction from './direction';

/** A Vector represented by two points */
class Vector {
  /** 
   * Create a Vector.
   * @param {Point} pointA - The origin point.
   * @param {Point} pointB - The destination point.
   */
  constructor(pointA, pointB) {
    /** @member {Point} */
    this.pointA = pointA;

    /** @member {Point} */
    this.pointB = pointB;
  }

  /**
   * The x distance.
   * @return {number}
   */
  get dx() {
    return this.pointB.x - this.pointA.x;
  }

  /**
   * The y distance.
   * @return {number}
   */
  get dy() {
    return this.pointB.y - this.pointA.y;
  }

  /**
   * The absolute x distance.
   * @return {number}
   */
  get absDx() {
    return Math.abs(this.dx);
  }

  /**
   * The absolute y distance.
   * @return {number}
   */
  get absDy() {
    return Math.abs(this.dy);
  }

  /**
   * Is the vector diagonal? 
   * @return {boolean}
   */
  get diagonal() {
    return this.absDx === this.absDy;
  }

  /**
   * Is the vector orthogonal? 
   * @return {boolean}
   */
  get orthogonal() {
    return this.dx === 0 || this.dy === 0;
  }

  /**
   * Is the vector orthogonal or diagonal? 
   * @return {boolean}
   */
  get orthogonalOrDiagonal() {
    return this.orthogonal || this.diagonal;
  }

  /**
   * Is the vector neither orthogonal nor diagonal? 
   * @return {boolean}
   */
  get notOrthogonalOrDiagonal() {
    return !this.orthogonal && !this.diagonal;
  }

  /**
   * The magnitude of the vector. 
   * @return {number}
   */
  get magnitude() {
    return Math.max(this.absDx, this.absDy);
  }

  // deprecate
  get distance() {
    if (this.diagonal) {
      return this.absDx;
    } else {
      return null;
    }
  }

  _directionD(d) {
    if (d > 0) {
      return 1;
    } else if (d === 0) {
      return 0;
    } else {
      return -1;
    }
  }

  /**
   * The direction on the y axis.
   * 1 for down, -1 for up.
   * @return {number}
   */
  get directionY() {
    return this._directionD(this.dy);
  }

  /**
   * The direction on the x axis.
   * 1 for right, -1 for left.
   * @return {number}
   */
  get directionX() {
    return this._directionD(this.dx);
  }

  /**
   * The direction unit.
   * @return {Direction}
   */
  get direction() {
    return new Direction(this.directionX, this.directionY);
  }
}

export default Vector;
