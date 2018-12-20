import clone from './clone';
import compare from './compare';

/**
 * Calls `changer`, passing in a draft copy of `object`.
 * If `changer` returns a value other than undefined, it is returned.
 * If `changer` mutates the draft copy, any changes made are applied back to `object`
 * selectively so that equivalent values remain "identical", but changed values do not.
 */
export default function applyChanges<T>(object: T, changer: (T) => any): T {
  const draft = clone(object);
  const result = changer(draft);
  return result ? result : compare(object, draft);
};
