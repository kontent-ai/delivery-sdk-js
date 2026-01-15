import { replaceSdkVersionPlaceholder } from "@kontent-ai/core-sdk/devkit";
// biome-ignore lint/correctness/useImportExtensions: package.json is a JSON file
import packageJson from "../package.json" with { type: "json" };

replaceSdkVersionPlaceholder("./dist/sdk-info.js", packageJson.version);
