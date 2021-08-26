"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParserAdapter = void 0;
function getParserAdapter() {
    let parser;
    const adapter = require('./adapters/browser-rich-text.parser');
    // instantiate class
    parser = new adapter.BrowserRichTextParser();
    if (!parser) {
        throw Error(`Invalid or unsupported parser adapter`);
    }
    return parser;
}
exports.getParserAdapter = getParserAdapter;
//# sourceMappingURL=parser-browser-adapter.js.map