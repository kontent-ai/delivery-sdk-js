import { type ContinuationHeaderName, type Header, nilUuid } from "@kontent-ai/core-sdk";

export const fakeXContinuationTokenHeader: Header = {
	name: "X-Continuation" satisfies ContinuationHeaderName,
	value: "x",
};

export const unitEnvironmentId = "xyz";

export function getFakeUuid(): string {
	return nilUuid;
}
