"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagination = void 0;
class Pagination {
    constructor(data) {
        this.skip = data.skip;
        this.limit = data.limit;
        this.count = data.count;
        this.nextPage = data.nextPage;
        this.totalCount = data.totalCount;
    }
}
exports.Pagination = Pagination;
//# sourceMappingURL=pagination.class.js.map