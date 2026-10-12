import { fileURLToPath } from "node:url";
import { bundles, measureScenarios, printSizeTable } from "./utils/measure-bundle-utils.js";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));

printSizeTable(await measureScenarios(bundles, { resolveDir: repoRoot }));
