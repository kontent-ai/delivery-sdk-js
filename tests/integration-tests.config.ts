import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";
import type { BaseUrl } from "@kontent-ai/core-sdk";
import { getEnvironmentOptionalValue, getEnvironmentRequiredValue } from "@kontent-ai/core-sdk/devkit";

export function getIntegrationTestConfig() {
	loadEnvironmentVariables();

	const host = getEnvironmentOptionalValue("INTEGRATION_DELIVERY_HOST");
	const protocol = getEnvironmentOptionalValue("INTEGRATION_DELIVERY_PROTOCOL");

	const deliveryBaseUrl: BaseUrl | undefined = host ? { protocol: protocol === "http" ? "http" : "https", host } : undefined;

	const integrationEnv: {
		readonly id: string;
		readonly deliveryBaseUrl: BaseUrl | undefined;
	} = {
		id: getEnvironmentRequiredValue("INTEGRATION_ENVIRONMENT_ID"),
		deliveryBaseUrl,
	} as const;

	return {
		env: integrationEnv,
	};
}

function loadEnvironmentVariables(): void {
	const envFilePath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", ".env");

	if (!existsSync(envFilePath)) {
		return;
	}

	// Unlike `process.loadEnvFile`, this also fills variables that are already set but blank,
	// while a non-empty value from the shell or CI still takes precedence over `.env`.
	Object.entries(parseEnv(readFileSync(envFilePath, "utf8")))
		.filter(([name]) => !process.env[name]?.trim())
		.forEach(([name, value]) => {
			process.env[name] = value;
		});
}
