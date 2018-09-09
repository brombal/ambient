
module.exports = function cloneDeep(value) {
  let clone = value;
  if (typeof value === 'object') {
    clone = value.constructor === [].constructor ? [] : {};
    for (const key in value) {
      clone[key] = cloneDeep(value[key]);
    }
  }
  return clone;
};
