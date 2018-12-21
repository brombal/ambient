/**
 * Compares a and b for differences.
 * If a and b are identical (===) or equivalent (recursive deep object/array comparison), a is returned.
 * If any properties of a and b are different, `b` is returned. However, all properties of `b` will be compared against
 * `a` using this method.
 */
export default function compare(a: any, b: any): any;
