export function getParserAdapter() {
    let parser;
    const adapter = require('./adapters/browser-rich-text.parser');
    // instantiate class
    parser = new adapter.BrowserRichTextParser();
    if (!parser) {
        throw Error(`Invalid or unsupported parser adapter`);
    }
    return parser;
}
//# sourceMappingURL=parser-browser-adapter.js.map