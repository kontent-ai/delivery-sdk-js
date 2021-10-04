import {
    IResolvedRichTextHtmlResult,
    IRichTextResolver,
    IRichTextAsyncResolver,
    IRichTextHtmlResolverAsyncInput,
    IRichTextHtmlResolverInput
} from '../../resolvers/rich-text/rich-text.resolver';
import { resolveBrowserRichTextInternal } from './implementation/sync-browser-resolver.class';
import { resolveBrowserRichTextInternalAsync } from './implementation/async-browser-resolver.class';

export class BrowserRichTextResolver
    implements
        IRichTextResolver<IRichTextHtmlResolverInput, IResolvedRichTextHtmlResult>,
        IRichTextAsyncResolver<IRichTextHtmlResolverAsyncInput, IResolvedRichTextHtmlResult>
{
    resolveRichText(input: IRichTextHtmlResolverInput): IResolvedRichTextHtmlResult {
        return resolveBrowserRichTextInternal(input, input.element.value);
    }

    async resolveRichTextAsync(input: IRichTextHtmlResolverAsyncInput): Promise<IResolvedRichTextHtmlResult> {
        return await resolveBrowserRichTextInternalAsync(input, input.element.value);
    }
}

export const browserRichTextResolver = new BrowserRichTextResolver();
