/**
 * Compile-time tests for the strongly typed client. Checked by `pnpm run test:types`, never executed.
 */
import { expectTypeOf } from "vitest";
import {
	type ContentItemFilter,
	type ContentItemOfType,
	type ContentItemPayloadExtended,
	type ContentTypeElementPayload,
	type DeliveryClient,
	type DeliveryClientSchema,
	isContentItemOfType,
} from "../../lib/public_api.js";
import type { Actor, Movie, SampleDeliveryClient, SampleItem, SampleProjectSchema } from "../../sample/sample-schema.js";

declare const client: SampleDeliveryClient;
declare const untypedClient: DeliveryClient;

export async function responseNarrowing(): Promise<void> {
	const all = await client.listContentItems().fetchPage();
	expectTypeOf(all.payload.items).toEqualTypeOf<readonly SampleItem[]>();
	expectTypeOf(all.payload.modular_content).toEqualTypeOf<Readonly<Record<string, SampleItem | undefined>>>();

	const movies = await client.listContentItems({ ofContentTypes: ["movie"] }).fetchPage();
	expectTypeOf(movies.payload.items).toEqualTypeOf<readonly Movie[]>();

	const feed = await client.itemsFeed({ ofContentTypes: ["actor"] }).fetchPage();
	expectTypeOf(feed.payload.items).toEqualTypeOf<readonly Actor[]>();

	const single = await client.fetchContentItem({ codename: "x" }).fetch();
	expectTypeOf(single.payload.item).toEqualTypeOf<SampleItem>();

	// @ts-expect-error "moive" is not a content type codename.
	client.listContentItems({ ofContentTypes: ["moive"] });
}

export async function untypedClientFallsBackToGenericItems(): Promise<void> {
	const all = await untypedClient.listContentItems({ ofContentTypes: ["anything"] }).fetchPage();
	expectTypeOf(all.payload.items[0]?.system.type).toEqualTypeOf<"anything" | undefined>();
	expectTypeOf(all.payload.items).toExtend<readonly ContentItemPayloadExtended<DeliveryClientSchema>[]>();
}

export function guard(item: SampleItem): void {
	if (isContentItemOfType(item, "movie")) {
		expectTypeOf(item).toEqualTypeOf<Movie>();
	}
	if (isContentItemOfType(item, ["movie", "actor"])) {
		expectTypeOf(item).toEqualTypeOf<Movie | Actor>();
	}
	expectTypeOf<ContentItemOfType<SampleItem, "actor">>().toEqualTypeOf<Actor>();
}

export function workflowSteps(movie: Movie): void {
	if (movie.system.workflow === "default") {
		expectTypeOf(movie.system.workflow_step).toEqualTypeOf<"draft" | "review" | "published">();
	}
}

export async function contentTypes(): Promise<void> {
	const type = await client.fetchContentType({ codename: "actor" }).fetch();
	expectTypeOf(type.payload.system.codename).toEqualTypeOf<"actor">();
	expectTypeOf<keyof typeof type.payload.elements>().toEqualTypeOf<
		"first_name" | "last_name" | "role" | "related_actors" | "metadata__internal_id" | "categories"
	>();

	const element = await client.fetchContentTypeElement({ typeCodename: "movie", elementCodename: "categories" }).fetch();
	expectTypeOf(element.payload.type).toEqualTypeOf<"taxonomy">();
	expectTypeOf(element.payload.codename).toEqualTypeOf<"categories">();
	expectTypeOf<ContentTypeElementPayload<SampleProjectSchema, "movie", "rating">["type"]>().toEqualTypeOf<"number">();
}

export function filters(): void {
	expectTypeOf<{ readonly property: "elements.rating"; readonly operator: "range"; readonly value: readonly [1, 5] }>().toExtend<
		ContentItemFilter<SampleProjectSchema>
	>();
	expectTypeOf<{ readonly property: "elements.rating"; readonly operator: "eq"; readonly value: "5" }>().not.toExtend<
		ContentItemFilter<SampleProjectSchema>
	>();
	expectTypeOf<{ readonly property: "elements.poster"; readonly operator: "contains"; readonly value: "x" }>().not.toExtend<
		ContentItemFilter<SampleProjectSchema>
	>();
	expectTypeOf<{ readonly property: "system.collection"; readonly operator: "eq"; readonly value: "movies" }>().toExtend<
		ContentItemFilter<SampleProjectSchema>
	>();
	expectTypeOf<{ readonly property: "system.collection"; readonly operator: "eq"; readonly value: "music" }>().not.toExtend<
		ContentItemFilter<SampleProjectSchema>
	>();
}
