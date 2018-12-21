/**
 * Compares a and b for differences.
 * If a and b are identical (===) or equivalent (recursive deep object/array comparison), a is returned.
 * If any properties of a and b are different, `b` is returned. However, all properties of `b` will be compared against
 * `a` using this method.
 */
export default function compare(a, b) {
    if (a === b)
        return a;
    if (typeof a !== typeof b)
        return b;
    if (!b || !a)
        return b;
    if (typeof a === 'object') {
        let changed = false;
        for (let key in b) {
            const compared = compare(a[key], b[key]);
            if (compared !== a[key]) {
                b[key] = compared;
                changed = true;
            }
            else {
                b[key] = a[key];
            }
        }
        for (let key in a) {
            if (!(key in b))
                changed = true;
        }
        return changed ? b : a;
    }
    else {
        return b;
    }
}
;
//# sourceMappingURL=compare.js.map