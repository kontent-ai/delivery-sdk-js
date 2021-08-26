"use strict";
// Polyfills for IE9, IE10 & IE11
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("es6-symbol/implement");
require("es6-promise/auto");
require("core-js/es/symbol");
require("core-js/es/object");
require("core-js/es/function");
require("core-js/es/number");
require("core-js/es/string");
require("core-js/es/date");
require("core-js/es/array");
require("core-js/es/map");
require("core-js/es/set");
// Public API
__exportStar(require("./client"), exports);
__exportStar(require("./sdk-info.generated"), exports);
__exportStar(require("./config"), exports);
__exportStar(require("./data-contracts"), exports);
__exportStar(require("./elements"), exports);
__exportStar(require("./parser"), exports);
__exportStar(require("./resolvers"), exports);
__exportStar(require("./services"), exports);
__exportStar(require("./mappers"), exports);
__exportStar(require("./query"), exports);
__exportStar(require("./models"), exports);
__exportStar(require("./images"), exports);
//# sourceMappingURL=index.legacy.js.map