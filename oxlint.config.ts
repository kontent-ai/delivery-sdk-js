import { kontentOxlintConfig } from "@kontent-ai/core-sdk/devkit";
import { defineConfig } from "oxlint";

export default defineConfig({
	extends: [kontentOxlintConfig],
	overrides: [
		{
			// Schema files (which import each other), the public `./schemas` barrel, and tests are
			// allowed to import schema modules statically as values.
			files: ["**/*.schemas.ts", "lib/public_schemas.ts", "tests/**/*.ts"],
			rules: {
				"kontent/no-static-schema-import": "off",
			},
		},
	],
});
