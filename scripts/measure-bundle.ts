import { fileURLToPath } from "node:url";
import { measureScenarios, printSizeTable, scenarios } from "./utils/measure-bundle-utils.js";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));

printSizeTable(await measureScenarios(scenarios, { resolveDir: repoRoot }));
