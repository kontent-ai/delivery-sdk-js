import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { formatBytes, getBundledInputs, measureScenarios, type SdkBundle } from "../../../scripts/utils/measure-bundle-utils.js";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url));

type BundleTestCase = SdkBundle<string> & {
	/**
	 * Maximum gzipped size of the minified bundle.
	 */
	readonly thresholdKb: number;
	/**
	 * Bundled module paths that must not appear in the bundle.
	 */
	readonly forbiddenInputs: readonly { readonly description: string; readonly pattern: RegExp }[];
};

const bundles: readonly BundleTestCase[] = [
	{
		name: "public_api (full)",
		entryContents: `export * from "./lib/public_api.ts";`,
		thresholdKb: 10,
		// Validation schemas are opt-in via the "schemas" subpath, so the client must not pull in zod or schema modules
		forbiddenInputs: [
			{ description: "zod", pattern: /[\\/](@zod[\\/]mini|zod)[\\/]/ },
			{ description: "schema modules", pattern: /\.schemas\.ts$/ },
		],
	},
	{
		name: "public_schemas (full)",
		entryContents: `export * from "./lib/public_schemas.ts";`,
		thresholdKb: 15,
		forbiddenInputs: [],
	},
];

describe("bundle size", () => {
	const resultsPromise = measureScenarios(bundles, { resolveDir: repoRoot });

	for (const bundle of bundles) {
		it(`${bundle.name} stays under ${bundle.thresholdKb} kB gzipped`, async () => {
			const results = await resultsPromise;
			const result = results.find((r) => r.scenario === bundle.name);
			expect(result, `missing measurement for ${bundle.name}`).toBeDefined();
			const limitBytes = bundle.thresholdKb * 1024;
			expect(
				result?.gzip,
				`${bundle.name} is ${formatBytes(result?.gzip ?? 0)} gzipped, limit is ${formatBytes(limitBytes)}`,
			).toBeLessThanOrEqual(limitBytes);
		});
	}
});

describe("bundle contents", () => {
	for (const bundle of bundles) {
		const inputsPromise = getBundledInputs(bundle, { resolveDir: repoRoot });

		it(`${bundle.name} includes modules from lib`, async () => {
			expect((await inputsPromise).some((input) => input.startsWith("lib/"))).toBe(true);
		});

		for (const { description, pattern } of bundle.forbiddenInputs) {
			it(`${bundle.name} does not include ${description}`, async () => {
				expect((await inputsPromise).filter((input) => pattern.test(input))).toStrictEqual([]);
			});
		}
	}
});
