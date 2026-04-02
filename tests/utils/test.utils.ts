import {
	type ContinuationHeaderName,
	type FetchQuery,
	type Header,
	type KontentSdkError,
	nilUuid,
	type PagedFetchQuery,
} from "@kontent-ai/core-sdk";

export const fakeXContinuationTokenHeader: Header = {
	name: "X-Continuation" satisfies ContinuationHeaderName,
	value: "x",
};

export const unitEnvironmentId = "xyz";

export function getFakeUuid(): string {
	return nilUuid;
}

export function isFetchQueryWithExpectedFunctions(query: unknown): query is FetchQuery<unknown, unknown, KontentSdkError> {
	type ExpectedFunctions = keyof FetchQuery<unknown, unknown, KontentSdkError>;
	if (!query || typeof query !== "object") {
		return false;
	}

	const expectedFunctions: readonly ExpectedFunctions[] = ["fetchSafe", "fetch", "schema", "url"];

	if (expectedFunctions.every((func) => func in query)) {
		return true;
	}
	return false;
}

export function isPagedFetchQueryWithExpectedFunctions(query: unknown): query is PagedFetchQuery<unknown, unknown, KontentSdkError> {
	type ExpectedFunctions = keyof PagedFetchQuery<unknown, unknown, KontentSdkError>;
	if (!query || typeof query !== "object") {
		return false;
	}

	const expectedFunctions: readonly ExpectedFunctions[] = [
		"fetchAllPagesSafe",
		"fetchPageSafe",
		"pages",
		"schema",
		"url",
		"fetchAllPages",
		"fetchPage",
		"pagesSafe",
	];

	if (expectedFunctions.every((func) => func in query)) {
		return true;
	}
	return false;
}
