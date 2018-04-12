import { IRichTextHtmlParser } from './parse-models';

export function getParserAdapter(): IRichTextHtmlParser {
    let parser: IRichTextHtmlParser | undefined;

    const adapter = require('./adapters/browser-rich-text.parser');

    // instantiate class
    parser = new adapter.BrowserRichTextParser();

    if (!parser) {
        throw Error(`Invalid or unsupported parser adapter`);
    }

    return parser;
}

