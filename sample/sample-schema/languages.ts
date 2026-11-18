/** biome-ignore-all lint/correctness/noUnusedVariables: Disabled for clarity of the sample */
/**
 * Sample: the languages query (`listLanguages`).
 *
 * Language codenames are narrowed to the schema. The same codenames are accepted by the `language` parameter
 * of content item queries and by `system.language` filters (see `content-items.ts`).
 */

import type { LanguageCodenameOf } from "../../lib/public_api.js";
import { client } from "./client.js";
import type { SampleProjectSchema } from "./sample-project.schema.js";

export async function listLanguages(): Promise<void> {
	const response = await client.listLanguages({ query: { order: "system.name[asc]", limit: 10 } }).fetchPage();
	const codename: "en-us" | "es-es" | undefined = response.payload.languages[0]?.system.codename;

	const language: LanguageCodenameOf<SampleProjectSchema> = "es-es";

	// @ts-expect-error languages can be ordered by system properties only.
	client.listLanguages({ query: { order: "elements.title[asc]" } });
}
