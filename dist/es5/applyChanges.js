"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var clone_1 = require("./clone");
var compare_1 = require("./compare");
/**
 * Calls `changer`, passing in a draft copy of `object`.
 * If `changer` returns a value other than undefined, it is returned.
 * If `changer` mutates the draft copy, any changes made are applied back to `object`
 * selectively so that equivalent values remain "identical", but changed values do not.
 */
function applyChanges(object, changer) {
    var draft = clone_1.default(object);
    var result = changer(draft);
    return result ? result : compare_1.default(object, draft);
}
exports.default = applyChanges;
;
//# sourceMappingURL=applyChanges.js.map