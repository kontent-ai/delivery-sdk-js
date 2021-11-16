import { IParser } from '../../../parser';
import { IRichTextResolver } from '../rich-text-resolver.models';

export abstract class BaseRichTextResolver<TInput, TOutput> implements IRichTextResolver<TInput, TOutput> {
    constructor(private defaultParser: IParser<any>, private parser?: IParser<any>) {}

    abstract resolveRichText(input: TInput): TOutput;

    protected getParser(): IParser<any> {
        if (this.parser) {
            return this.parser;
        }

        return this.defaultParser;
    }
}
