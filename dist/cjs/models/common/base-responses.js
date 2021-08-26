"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseKontentResponseArrayDebug = exports.BaseKontentResponseStandardDebug = exports.BaseKontentResponse = void 0;
const staleContentHeaderName = 'X-Stale-Content';
function getHasStaleContent(response) {
    const hasStaleContentHeader = response.headers.find(m => m.header.toLowerCase() === staleContentHeaderName.toLowerCase());
    if (hasStaleContentHeader) {
        if (hasStaleContentHeader.value.toString() === '1') {
            return true;
        }
    }
    return false;
}
function getResponseDebug(response) {
    return {
        response: response.response,
        headers: response.headers,
        status: response.status
    };
}
class BaseKontentResponse {
    constructor() {
    }
}
exports.BaseKontentResponse = BaseKontentResponse;
class BaseKontentResponseStandardDebug extends BaseKontentResponse {
    constructor(response, isDeveloperMode) {
        super();
        this.hasStaleContent = getHasStaleContent(response);
        this.isDeveloperMode = isDeveloperMode;
        if (isDeveloperMode) {
            this.debug = getResponseDebug(response);
        }
    }
}
exports.BaseKontentResponseStandardDebug = BaseKontentResponseStandardDebug;
class BaseKontentResponseArrayDebug extends BaseKontentResponse {
    constructor(responses, isDeveloperMode) {
        super();
        this.debug = [];
        /**
         * Always false for joined response data
         */
        this.hasStaleContent = false;
        this.isDeveloperMode = isDeveloperMode;
        if (isDeveloperMode) {
            for (const response of responses) {
                if (this.debug) {
                    this.debug.push(getResponseDebug(response));
                }
            }
        }
    }
}
exports.BaseKontentResponseArrayDebug = BaseKontentResponseArrayDebug;
//# sourceMappingURL=base-responses.js.map