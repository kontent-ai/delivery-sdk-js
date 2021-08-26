/**
 * This class as a wrapper is required so we can pass
 * index as a reference and not a value
 */
export class RichTextItemIndexReferenceWrapper {
    constructor(index) {
        this.index = index;
    }
    increment() {
        this.index++;
    }
}
//# sourceMappingURL=parse-models.js.map