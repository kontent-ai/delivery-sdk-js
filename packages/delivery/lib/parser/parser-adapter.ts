import { IRichTextHtmlParser } from './parse-models';

export function getParserAdapter(): IRichTextHtmlParser {
    let parser: IRichTextHtmlParser | undefined;
    // Only Node.JS has a process variable that is of [[Class]] process
    if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
        // For node use
        const adapter = require('./adapters/parse5-rich-text.parser');

        // instantiate class
        parser = new adapter.Parse5RichTextParser();

    } else if (typeof XMLHttpRequest !== 'undefined') {
        // For browsers use
        const adapter = require('./adapters/browser-rich-text.parser');

        // instantiate class
        parser = new adapter.BrowserRichTextParser();
    }

    if (!parser) {
        throw Error(`Invalid or unsupported parser adapter`);
    }

    return parser;
}

