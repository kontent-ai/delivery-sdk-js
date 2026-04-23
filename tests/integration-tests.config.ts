import { existsSync } from "node:fs";
import path from "node:path";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";
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

	if (existsSync(envFilePath)) {
		loadEnvFile(envFilePath);
	}
}
