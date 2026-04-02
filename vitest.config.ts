import { defineConfig } from "vitest/config";

export default defineConfig({
	root: ".",
	test: {
		dir: "tests",
		exclude: ["types/**"],
		globals: true,
		environment: "node",
		coverage: {
			provider: "v8",
			reporter: ["text"],
			thresholds: { lines: 100, functions: 100, branches: 100 },
			exclude: ["**/tests/**", "**/types/**"],
		},
	},
	build: {
		target: "esnext",
	},
});
