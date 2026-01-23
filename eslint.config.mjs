import kontentAiConfig from "@kontent-ai/eslint-config";
import { defineConfig } from "eslint/config";

export default defineConfig(
	{
		// Global ignores (applies regardless of which configs/plugins match files)
		ignores: ["dist/**/*", "_legacy/**/*"],
	},
	{
		extends: [kontentAiConfig],
		files: ["lib/**/*.ts", "tests/**/*.ts", "scripts/**/*.ts"],
		rules: {
			"no-unused-vars": "off",
		},
	},
);
