/**
 * Compile-time tests for snippets in the schema. Checked by `pnpm run test:types`, never executed.
 */
import { expectTypeOf } from "vitest";
import type { DeliveryClientSchema, SnippetCodenameOf, SnippetElementCodenamesOf } from "../../lib/public_api.js";

type SchemaWithSnippets = DeliveryClientSchema<{
	readonly languageCodenames: readonly ["en"];
	readonly collectionCodenames: readonly ["default"];
	readonly taxonomies: Record<string, never>;
	readonly workflows: Record<string, never>;
	readonly contentTypes: {
		readonly movie: { readonly title: { readonly type: "text" }; readonly seo__title: { readonly type: "text" } };
	};
	readonly snippets: {
		readonly seo: { readonly seo__title: { readonly type: "text" }; readonly seo__description: { readonly type: "text" } };
		readonly empty: Record<string, never>;
	};
}>;

type SchemaWithoutSnippets = DeliveryClientSchema<{
	readonly languageCodenames: readonly ["en"];
	readonly collectionCodenames: readonly ["default"];
	readonly taxonomies: Record<string, never>;
	readonly workflows: Record<string, never>;
	readonly contentTypes: { readonly movie: { readonly title: { readonly type: "text" } } };
}>;

export function snippetHelpers(): void {
	expectTypeOf<SnippetCodenameOf<SchemaWithSnippets>>().toEqualTypeOf<"seo" | "empty">();
	expectTypeOf<SnippetElementCodenamesOf<SchemaWithSnippets, "seo">>().toEqualTypeOf<"seo__title" | "seo__description">();
	expectTypeOf<SnippetCodenameOf<SchemaWithoutSnippets>>().toEqualTypeOf<never>();
	expectTypeOf<SnippetCodenameOf<DeliveryClientSchema>>().toEqualTypeOf<string>();
	expectTypeOf<SnippetElementCodenamesOf<DeliveryClientSchema, "seo">>().toEqualTypeOf<string>();
}
