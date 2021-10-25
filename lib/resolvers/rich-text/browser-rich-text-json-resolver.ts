import { IRichTextResolver, IRichTextObjectResolverInput, IRichTextJsonResult } from './rich-text.resolver';
import { browserRichTextObjectResolverExperimental } from './browser-rich-text-object-resolver';

export class BrowserRichTextJsonResolverExperimental
    implements IRichTextResolver<IRichTextObjectResolverInput, IRichTextJsonResult>
{
    resolveRichText(input: IRichTextObjectResolverInput): IRichTextJsonResult {
        const objectResult = browserRichTextObjectResolverExperimental.resolveRichText(input);

        return {
            json: JSON.stringify(objectResult)
        };
    }
}

export const browserRichTextJsonResolverExperimental = new BrowserRichTextJsonResolverExperimental();
