"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryError = void 0;
class DeliveryError {
    constructor(data) {
        this.message = data.message;
        this.requestId = data.requestId;
        this.errorCode = data.errorCode;
        this.specificCode = data.specificCode;
    }
}
exports.DeliveryError = DeliveryError;
//# sourceMappingURL=common-models.js.map