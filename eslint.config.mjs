import kontentAiConfig from "@kontent-ai/eslint-config";
import { defineConfig } from "eslint/config";

const restrictedZodPaths = [
	{
		name: "zod",
		message: "Import from 'zod/mini' instead to keep the SDK tree-shakeable.",
	},
];

const restrictedSchemaPattern = {
	regex: "\\.schemas\\.js$",
	// Type-only imports are erased by the compiler, so they don't pull schema code into the bundle.
	// The model files legitimately `import type` from schemas to derive types via `z.infer`.
	allowTypeImports: true,
	message:
		"Schema modules must be loaded with a dynamic `await import(...)` so they're not bundled into the main entry. For top-level use, import them from the public '@kontent-ai/delivery-sdk/schemas' entry instead.",
};

export default defineConfig(
	{
		// Global ignores
		ignores: ["dist/**/*", "_legacy/**/*"],
	},
	{
		extends: [kontentAiConfig],
		files: ["lib/**/*.ts", "tests/**/*.ts", "scripts/**/*.ts", "sample/**/*.ts"],
		rules: {
			"no-unused-vars": "off",
			// Switched to the typescript-eslint variant so we can `allowTypeImports` on the schema pattern.
			"no-restricted-imports": "off",
			"@typescript-eslint/no-restricted-imports": [
				"error",
				{
					paths: restrictedZodPaths,
					patterns: [restrictedSchemaPattern],
				},
			],
			"no-restricted-syntax": [
				"error",
				{
					selector: "ImportDeclaration[source.value='zod/mini'] > ImportSpecifier[imported.name='z']",
					message:
						'Use `import * as z from "zod/mini"` instead. The named `{ z }` import defeats esbuild\'s namespace tree-shaking and pulls ~280 kB of zod locales into consumer bundles.',
				},
			],
		},
	},
	{
		// Schema files (which import each other), the public `./schemas` barrel, and tests are
		// allowed to import schema modules statically as values — they keep only the zod restriction.
		files: ["**/*.schemas.ts", "lib/public_schemas.ts", "tests/**/*.ts"],
		rules: {
			"@typescript-eslint/no-restricted-imports": ["error", { paths: restrictedZodPaths }],
		},
	},
);
