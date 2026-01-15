import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
	root: ".",
	test: {
		dir: "tests/unit",
		globals: true,
		environment: "node",
		setupFiles: ["dotenv/config"],
		env: loadEnv("", process.cwd(), ""), // loads .env variables
	},
	build: {
		target: "esnext",
	},
});
