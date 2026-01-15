import kontentAiConfig from "@kontent-ai/eslint-config";
import { defineConfig } from "eslint/config";

export default defineConfig({
	extends: [kontentAiConfig],
	files: ["lib/**/*.ts", "tests/**/*.ts", "scripts/**/*.ts"],
});
