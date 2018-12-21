"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function cloneDeep(value) {
    var clone = value;
    if (clone && typeof value === 'object') {
        clone = (value.constructor === [].constructor ? [] : {});
        for (var key in value) {
            clone[key] = cloneDeep(value[key]);
        }
    }
    return clone;
}
exports.default = cloneDeep;
;
//# sourceMappingURL=clone.js.map