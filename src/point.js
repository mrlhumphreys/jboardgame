class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(point) {
    let newX = this.x + point.x;
    let newY = this.y + point.y;
    return new Point(newX, newY);
  }

  eq(point) {
    return (this.x === point.x) && (this.y === point.y);
  }

  notEq(point) {
    return !this.eq(point);
  }
}

export default Point;
