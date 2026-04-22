import { existsSync } from "node:fs";
import path from "node:path";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";
import type { BaseUrl } from "@kontent-ai/core-sdk";
import { getEnvironmentOptionalValue, getEnvironmentRequiredValue } from "@kontent-ai/core-sdk/devkit";
import { isBaseUrl } from "./utils/test.utils.js";

export function getIntegrationTestConfig() {
	loadEnvironmentVariables();
	const baseUrl = getEnvironmentOptionalValue("INTEGRATION_DELIVERY_BASE_URL");

	const integrationEnv: {
		readonly id: string;
		readonly deliveryBaseUrl: BaseUrl | undefined;
	} = {
		id: getEnvironmentRequiredValue("INTEGRATION_ENVIRONMENT_ID"),
		deliveryBaseUrl: isBaseUrl(baseUrl) ? baseUrl : undefined,
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
