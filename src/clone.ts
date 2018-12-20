
export default function cloneDeep<T>(value: T): T {
  let clone = value;
  if (clone && typeof value === 'object') {
    clone = (value.constructor === [].constructor ? [] : {}) as T;
    for (const key in value) {
      clone[key] = cloneDeep(value[key]);
    }
  }
  return clone;
};
