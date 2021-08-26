"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RichTextItemIndexReferenceWrapper = void 0;
/**
 * This class as a wrapper is required so we can pass
 * index as a reference and not a value
 */
class RichTextItemIndexReferenceWrapper {
    constructor(index) {
        this.index = index;
    }
    increment() {
        this.index++;
    }
}
exports.RichTextItemIndexReferenceWrapper = RichTextItemIndexReferenceWrapper;
//# sourceMappingURL=parse-models.js.map