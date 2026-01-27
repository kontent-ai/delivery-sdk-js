import type { ContinuationHeaderName, Header } from "@kontent-ai/core-sdk";
import chalk from "chalk";
import { config } from "dotenv";

// needed to load .env environment to current process when run via package.json script
config();

export function getEnvironmentRequiredValue(variableName: string): string {
	const value = getEnvironmentOptionalValue(variableName);

	if (!value) {
		throw new Error(`Missing environment variable '${chalk.red(variableName)}'`);
	}

	return value;
}

export function getEnvironmentOptionalValue(variableName: string): string | undefined {
	return process.env[variableName];
}

export const fakeXContinuationTokenHeader: Header = {
	name: "X-Continuation" satisfies ContinuationHeaderName,
	value: "x",
};
