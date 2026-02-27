import { type ContinuationHeaderName, type Header, nilUuid } from "@kontent-ai/core-sdk";
import { config } from "dotenv";

// needed to load .env environment to current process when run via package.json script
config();

export const fakeXContinuationTokenHeader: Header = {
	name: "X-Continuation" satisfies ContinuationHeaderName,
	value: "x",
};

export const unitEnvironmentId = "xyz";

export function getFakeUuid(): string {
	return nilUuid;
}
