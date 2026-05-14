import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { formatBytes, measureScenarios, scenarios } from "../../../scripts/utils/measure-bundle-utils.js";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url));

describe("bundle size", () => {
	const resultsPromise = measureScenarios(scenarios, { resolveDir: repoRoot });

	for (const scenario of scenarios) {
		it(`${scenario.name} stays under ${scenario.thresholdKb} kB gzipped`, async () => {
			const results = await resultsPromise;
			const result = results.find((r) => r.scenario === scenario.name);
			expect(result, `missing measurement for ${scenario.name}`).toBeDefined();
			const limitBytes = scenario.thresholdKb * 1024;
			expect(
				result?.gzip,
				`${scenario.name} is ${formatBytes(result?.gzip ?? 0)} gzipped, limit is ${formatBytes(limitBytes)}`,
			).toBeLessThanOrEqual(limitBytes);
		});
	}
});
