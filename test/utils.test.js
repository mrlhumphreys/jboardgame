import { exists, uniq, union } from '../src/utils'

describe('exists', () => {
  it('returns true for objects', () => {
    let result = exists({});
    expect(result).toBe(true);
  });

  it('returns true for strings', () => {
    let result = exists("");
    expect(result).toBe(true);
  });

  it('returns true for numbers', () => {
    let result = exists(2);
    expect(result).toBe(true);
  });

  it('returns false for undefined', () => {
    let result = exists(undefined);
    expect(result).toBe(false);
  });

  it('returns false for null', () => {
    let result = exists(null);
    expect(result).toBe(false);
  });
});

describe('uniq', () => {
  it('returns an array with unique elements', () => {
    let result = uniq([1, 2, 2, 3]);
    expect(result).toEqual([1, 2, 3]);
  });
});

describe('union', () => {
  it('returns elements from both arrays with no duplicates', () => {
    let a = [1, 2, 3];
    let b = [3, 4, 5];
    let result = union(a, b);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });
});
