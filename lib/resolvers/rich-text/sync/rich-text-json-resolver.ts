import { browserParser, IParser } from '../../../parser';
import { BaseRichTextResolver } from '../base/base-rich-text-resolver';
import { IRichTextObjectResolverInput, IRichTextJsonResult } from '../rich-text-resolver.models';
import { createRichTextObjectResolver } from './rich-text-object-resolver';

export class RichTextJsonResolver extends BaseRichTextResolver<
    IRichTextObjectResolverInput,
    IRichTextJsonResult
> {
    constructor(parser?: IParser<string>) {
        super(browserParser, parser);
    }

    resolveRichText(input: IRichTextObjectResolverInput): IRichTextJsonResult {
        const objectResult = createRichTextObjectResolver(this.getParser()).resolveRichText(input).data;

        return {
            json: JSON.stringify(objectResult)
        };
    }
}

export const createRichTextJsonResolver = (parser?: IParser<any>) => new RichTextJsonResolver(parser);
