import { IRichTextResolver, IRichTextObjectResolverInput, IRichTextJsonResult } from './rich-text-resolver.models';
import { richTextObjectResolverExperimental } from './rich-text-object-resolver';

export class RichTextJsonResolverExperimental
    implements IRichTextResolver<IRichTextObjectResolverInput, IRichTextJsonResult>
{
    resolveRichText(input: IRichTextObjectResolverInput): IRichTextJsonResult {
        const objectResult = richTextObjectResolverExperimental.resolveRichText(input);

        return {
            json: JSON.stringify(objectResult)
        };
    }
}

export const richTextJsonResolverExperimental = new RichTextJsonResolverExperimental();
