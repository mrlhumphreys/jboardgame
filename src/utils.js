/**
 * Is the object not undefined and not null?
 * @return {boolean}
 */
export const exists = function(e) {
  return typeof e !== 'undefined' && e!== null;
};

/**
 * Remove non-unique elements from the array
 * @param {Object[]} array - The array.
 * @return {Object[]}
 */
export const uniq = function(array) {
  return array.filter(function(e, i, a) {
    return a.indexOf(e) === i;
  });
};

/**
 * Return all elements in all arrays without duplicates
 * @param {Object[]} a - The first array.
 * @param {Object[]} b - The second array.
 * @return {Object[]}
 */
export const union = function(a, b) {
  return uniq(a.concat(b));
};

