import { fileURLToPath } from "node:url";
import { bundles, formatBytes, writeBundles } from "./utils/measure-bundle-utils.js";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const outDir = `${repoRoot}bundles`;

const [minified, unminified] = await Promise.all([
	writeBundles(bundles, { resolveDir: repoRoot, outDir, minify: true }),
	writeBundles(bundles, { resolveDir: repoRoot, outDir, minify: false }),
]);

console.log(`Wrote ${minified.length + unminified.length} bundles to ${outDir}:`);
for (const { path, bytes } of [...unminified, ...minified]) {
	console.log(`  ${path}  (${formatBytes(bytes)})`);
}
