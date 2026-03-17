import { existsSync } from "node:fs";
import path from "node:path";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";
import { getEnvironmentOptionalValue, getEnvironmentRequiredValue } from "@kontent-ai/core-sdk/devkit";

export function getIntegrationTestConfig() {
	loadEnvironmentVariables();

	const integrationEnv = {
		id: getEnvironmentRequiredValue("INTEGRATION_ENVIRONMENT_ID"),
		deliveryBaseUrl: getEnvironmentOptionalValue("INTEGRATION_DELIVERY_BASE_URL"),
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
