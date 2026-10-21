/** biome-ignore-all lint/correctness/noUnusedVariables: Disabled for clarity of the sample */
/**
 * Sample: safe vs unsafe queries.
 *
 * Every query the SDK exposes comes in two flavors:
 *  - unsafe (`fetchPage`, `fetchAllPages`, `pages`): throws on error.
 *  - safe (`fetchPageSafe`, `fetchAllPagesSafe`, `pagesSafe`): returns a
 *    discriminated `{ success, response | error }` result and never throws.
 *
 * The only difference is how a failure is delivered to your code.
 *
 * `listLanguages` is used here as a representative paged query. The same
 * pattern applies to every other query on the delivery client.
 */

import { createDeliveryClient } from "../lib/client/delivery-client.js";

// Minimal client setup. A real consumer would supply their own environmentId
// and (optionally) a typed schema generic; both are irrelevant to the topic here.
const client = createDeliveryClient({
	apiMode: "public",
	environmentId: "x",
});

/**
 * 1. Unsafe single page
 *
 * `fetchPage()` throws on any failure, regardless of cause (transport,
 * validation, anything else). Wrap at the call boundary if you want the
 * error to propagate to your framework.
 */
export async function listLanguagesUnsafe(): Promise<void> {
	try {
		const response = await client.listLanguages().fetchPage();

		// response.payload is the validated, fully typed languages page.
		const firstLanguageCodename: string | undefined = response.payload.languages[0]?.system.codename;
	} catch (error) {
		console.error("listLanguages failed:", error);
	}
}

/**
 * 2. Safe single page
 *
 * `fetchPageSafe()` never throws. Branch on `result.success` to access
 * either the validated payload or the error.
 */
export async function listLanguagesSafe(): Promise<void> {
	const result = await client.listLanguages().fetchPageSafe();

	if (result.success) {
		// Same payload shape as the unsafe path, reached via `result.response`.
		const firstLanguageCodename: string | undefined = result.response.payload.languages[0]?.system.codename;
	} else {
		// `result.error` is always a `DeliverySdkError` regardless of the underlying cause.
		console.error("listLanguages failed:", result.error);
	}
}

/**
 * 3. All pages, unsafe
 *
 * `fetchAllPages()` walks the entire result set and throws on the first
 * failure. Any pages already fetched before the failure are lost.
 */
export async function listAllLanguagesUnsafe(): Promise<void> {
	try {
		const response = await client.listLanguages().fetchAllPages();

		// response.responses is one entry per page.
		const totalLanguages = response.responses.flatMap((page) => page.payload.languages).length;
	} catch (error) {
		console.error("listLanguages paging failed:", error);
	}
}

/**
 * 4. All pages, safe
 *
 * `fetchAllPagesSafe()` is the strongest reason to reach for the safe API:
 * on failure, `partialResponses` still contains the pages fetched before
 * the error - you can recover whatever progress was made.
 */
export async function listAllLanguagesSafe(): Promise<void> {
	const result = await client.listLanguages().fetchAllPagesSafe();

	if (result.success) {
		const totalLanguages = result.responses.flatMap((page) => page.payload.languages).length;
	} else {
		console.error("listLanguages paging failed", result.error);
	}
}
