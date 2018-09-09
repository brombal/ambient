/**
 * Compares a and b for differences.
 * If a and b are equivalent, a is returned.
 * If any properties of a and b are different, b is returned.
 * However, all properties of b will be deep-checked for equality and any equal values will remain identical.
 */
module.exports = function compare(a, b) {
  if (a === b) return a;
  if (typeof a !== typeof b) return b;
  if (typeof a === 'object') {
    let changed = false;
    for (let key in a) {
      const compared = compare(a[key], b[key]);
      if (compared !== a[key]) {
        b[key] = compared;
        changed = true;
      } else {
        b[key] = a[key];
      }
    }
    for (let key in b) {
      if (!(key in a)) changed = true;
    }
    return changed ? b : a;
  } else {
    return b;
  }
};
