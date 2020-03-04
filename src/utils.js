/**
 * Is the object not undefined and not null?
 * @return {boolean}
 */
export const exists = function(e) {
  return typeof e !== 'undefined' && e!== null;
};
