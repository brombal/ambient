const clone = require('./clone');
const compare = require('./compare');

/**
 * Calls `changer`, passing in a draft copy of `object`. If any changes are made, they are applied back to `object`
 * selectively so that equivalent objects and arrays remain "identical", but changed values do not.
 */
module.exports = function applyChanges(object, changer) {
  const draft = clone(object);
  changer(draft);
  return compare(object, draft);
};
