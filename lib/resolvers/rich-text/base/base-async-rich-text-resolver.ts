import { IAsyncParser } from '../../../parser';
import { IRichTextResolverAsync } from '../rich-text-resolver.models';

export abstract class BaseAsyncRichTextResolver<TInput, TOutput> implements IRichTextResolverAsync<TInput, TOutput> {
    constructor(private defaultParser: IAsyncParser<any>, private parser?: IAsyncParser<any>) {}

    abstract resolveRichTextAsync(input: TInput): Promise<TOutput>;

    protected getAsyncParser(): IAsyncParser<any> {
        if (this.parser) {
            return this.parser;
        }

        return this.defaultParser;
    }
}
