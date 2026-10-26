import { fileURLToPath } from "node:url";
import { measureScenarios, printSizeTable, sdkBundles } from "./utils/measure-bundle-utils.js";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));

printSizeTable(await measureScenarios(sdkBundles, { resolveDir: repoRoot }));
