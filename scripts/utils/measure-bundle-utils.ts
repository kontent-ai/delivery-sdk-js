import { mkdir, writeFile } from "node:fs/promises";
import { brotliCompressSync, gzipSync } from "node:zlib";
import { build } from "esbuild";

export type Scenario<TName extends string> = {
	readonly name: TName;
	readonly entryContents: string;
	readonly thresholdKb: number;
};

export type SizeResult<TName extends string> = {
	readonly scenario: TName;
	readonly raw: number;
	readonly min: number;
	readonly gzip: number;
	readonly brotli: number;
};

export type ScenarioName = "public_api (full)" | "public_schemas (full)";

export const scenarios: readonly Scenario<ScenarioName>[] = [
	{
		name: "public_api (full)",
		entryContents: `export * from "./lib/public_api.ts";`,
		thresholdKb: 20,
	},
	{
		name: "public_schemas (full)",
		entryContents: `export * from "./lib/public_schemas.ts";`,
		thresholdKb: 11,
	},
];

const bundleScenario = async <TName extends string>(
	scenario: Scenario<TName>,
	{ resolveDir, minify }: { readonly resolveDir: string; readonly minify: boolean },
): Promise<Uint8Array> => {
	const result = await build({
		stdin: {
			contents: scenario.entryContents,
			resolveDir,
			loader: "ts",
		},
		bundle: true,
		format: "esm",
		platform: "neutral",
		target: "es2022",
		treeShaking: true,
		minify,
		write: false,
		legalComments: "none",
		logLevel: "silent",
	});

	const output = result.outputFiles?.[0];
	if (!output) {
		throw new Error(`esbuild produced no output for scenario "${scenario.name}"`);
	}
	return output.contents;
};

export const measureScenarios = async <TName extends string>(
	scenarios: readonly Scenario<TName>[],
	options: { readonly resolveDir: string },
): Promise<readonly SizeResult<TName>[]> =>
	Promise.all(
		scenarios.map(async (scenario): Promise<SizeResult<TName>> => {
			const [rawBytes, minBytes] = await Promise.all([
				bundleScenario(scenario, { resolveDir: options.resolveDir, minify: false }),
				bundleScenario(scenario, { resolveDir: options.resolveDir, minify: true }),
			]);
			return {
				scenario: scenario.name,
				raw: rawBytes.byteLength,
				min: minBytes.byteLength,
				gzip: gzipSync(minBytes).byteLength,
				brotli: brotliCompressSync(minBytes).byteLength,
			};
		}),
	);

const toSafeFileName = (name: string): string =>
	name
		.replaceAll(/[^a-z0-9]+/gi, "-")
		.replace(/^-+|-+$/g, "")
		.toLowerCase();

export type WrittenBundle<TName extends string> = {
	readonly scenario: TName;
	readonly path: string;
	readonly bytes: number;
};

export const writeBundles = async <TName extends string>(
	scenarios: readonly Scenario<TName>[],
	options: { readonly resolveDir: string; readonly outDir: string; readonly minify?: boolean },
): Promise<readonly WrittenBundle<TName>[]> => {
	await mkdir(options.outDir, { recursive: true });
	const minify = options.minify ?? true;
	return Promise.all(
		scenarios.map(async (scenario): Promise<WrittenBundle<TName>> => {
			const bytes = await bundleScenario(scenario, { resolveDir: options.resolveDir, minify });
			const suffix = minify ? ".min.js" : ".js";
			const path = `${options.outDir}/${toSafeFileName(scenario.name)}${suffix}`;
			await writeFile(path, bytes);
			return { scenario: scenario.name, path, bytes: bytes.byteLength };
		}),
	);
};

export const formatBytes = (n: number): string => {
	if (n < 1024) {
		return `${n} B`;
	}
	const kb = n / 1024;
	return `${kb.toFixed(1)} kB`;
};

const columns = ["scenario", "raw", "min", "gzip", "brotli"] as const;

export const printSizeTable = <TName extends string>(rows: readonly SizeResult<TName>[]): void => {
	const cell = (row: SizeResult<TName>, col: (typeof columns)[number]): string =>
		col === "scenario" ? row.scenario : formatBytes(row[col]);
	const widths = columns.map((col) => Math.max(col.length, ...rows.map((row) => cell(row, col).length)));
	const renderRow = (cells: readonly string[]): string => cells.map((value, i) => value.padEnd(widths[i] ?? 0)).join("  ");

	console.log(renderRow([...columns]));
	console.log(renderRow(widths.map((w) => "-".repeat(w))));
	for (const row of rows) {
		console.log(renderRow(columns.map((col) => cell(row, col))));
	}
};
