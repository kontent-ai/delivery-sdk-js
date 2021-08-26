"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxonomyTerms = exports.TaxonomySystemAttributes = exports.TaxonomyGroup = void 0;
class TaxonomyGroup {
    constructor(system, terms) {
        this.system = system;
        this.terms = terms;
    }
}
exports.TaxonomyGroup = TaxonomyGroup;
class TaxonomySystemAttributes {
    constructor(data) {
        Object.assign(this, data);
    }
}
exports.TaxonomySystemAttributes = TaxonomySystemAttributes;
class TaxonomyTerms {
    constructor(data) {
        Object.assign(this, data);
    }
}
exports.TaxonomyTerms = TaxonomyTerms;
//# sourceMappingURL=taxonomy-models.js.map