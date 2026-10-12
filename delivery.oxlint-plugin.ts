type ImportLikeNode = {
	readonly importKind?: "type" | "value";
	readonly exportKind?: "type" | "value";
	readonly specifiers?: readonly { readonly importKind?: "type" | "value" }[];
};

type OxlintRuleContext = {
	readonly report: (descriptor: { readonly node: unknown; readonly message: string }) => void;
};

type OxlintRule = {
	readonly create: (context: OxlintRuleContext) => Readonly<Record<string, (node: ImportLikeNode) => void>>;
};

const deliveryOxlintPluginName = "delivery";
const noStaticSchemaImportRuleName = "no-static-schema-import";
const schemaSourceRegex = String.raw`/\.schemas\.js$/`;

const noStaticSchemaImportMessage =
	"Schema modules must be loaded with a dynamic `await import(...)` so they're not bundled into the main entry. For top-level use, import them from the public '@kontent-ai/delivery-sdk/schemas' entry instead.";

/**
 * Type-only imports are erased by the compiler, so they don't pull schema code into the bundle.
 * The model files legitimately `import type` from schemas to derive types via `z.infer`.
 */
const isTypeOnly = (node: ImportLikeNode): boolean =>
	node.importKind === "type" ||
	node.exportKind === "type" ||
	(node.specifiers !== undefined && node.specifiers.length > 0 && node.specifiers.every((specifier) => specifier.importKind === "type"));

/**
 * Unlike oxlint's `no-restricted-imports`, this ignores dynamic `import()` expressions,
 * which are the intended way to load schema modules.
 */
const noStaticSchemaImportRule: OxlintRule = {
	create: (context) => {
		const reportUnlessTypeOnly = (node: ImportLikeNode): void => {
			if (isTypeOnly(node)) {
				return;
			}
			context.report({ node, message: noStaticSchemaImportMessage });
		};

		return {
			[`ImportDeclaration[source.value=${schemaSourceRegex}]`]: reportUnlessTypeOnly,
			[`ExportNamedDeclaration[source.value=${schemaSourceRegex}]`]: reportUnlessTypeOnly,
			[`ExportAllDeclaration[source.value=${schemaSourceRegex}]`]: reportUnlessTypeOnly,
		};
	},
};

const deliveryOxlintPlugin = {
	meta: { name: deliveryOxlintPluginName },
	rules: {
		[noStaticSchemaImportRuleName]: noStaticSchemaImportRule,
	},
};

export default deliveryOxlintPlugin;
