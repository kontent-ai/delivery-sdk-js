/** biome-ignore-all lint/correctness/noUnusedVariables: Disabled for clarity of the sample */
/**
 * Sample: taxonomy queries (`listTaxonomies`, `fetchTaxonomy`).
 *
 * Taxonomy codenames are checked against the schema and term codenames are narrowed to the terms of each taxonomy.
 */

import type { TaxonomyTermCodenamesOf } from "../../lib/public_api.js";
import { client } from "./client.js";
import type { SampleProjectSchema } from "./sample-project.schema.js";

/**
 * 1. Fetching a taxonomy
 *
 * Term codenames are narrowed to the terms of the fetched taxonomy, at every nesting level.
 */
export async function fetchTaxonomy(): Promise<void> {
	const category = await client.fetchTaxonomy({ codename: "category" }).fetch();
	const codename: "category" = category.payload.system.codename;
	const termCodename: "term1" | "term2" | undefined = category.payload.terms[0]?.codename;
	const nestedTermCodename: "term1" | "term2" | undefined = category.payload.terms[0]?.terms[0]?.codename;

	// @ts-expect-error "categories" is not a taxonomy codename.
	client.fetchTaxonomy({ codename: "categories" });
}

/**
 * 2. Listing taxonomies
 *
 * Listed taxonomies are a union of each taxonomy with its own terms.
 */
export async function listTaxonomies(): Promise<void> {
	const taxonomies = await client.listTaxonomies({ query: { order: "system.codename[asc]" } }).fetchPage();
	const codename: "category" | "categoryActor" | "tag" | undefined = taxonomies.payload.taxonomies[0]?.system.codename;
	const anyTerm: "term1" | "term2" | "term3" | "term4" | "news" | "featured" | undefined =
		taxonomies.payload.taxonomies[0]?.terms[0]?.codename;

	const tagTerm: TaxonomyTermCodenamesOf<SampleProjectSchema, "tag"> = "featured";
}
