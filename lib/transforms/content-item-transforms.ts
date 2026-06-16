import { isDefined } from "@kontent-ai/core-sdk";
import type { DeliveryClientSchema } from "../models/core.models.js";
import type { ContentItemPayload, ContentItemPayloadExtended } from "../queries/content-items/models/content-item.models.js";
import type { ContentItemElementPayload, ContentItemElementPayloadExtended } from "../queries/content-items/models/element.models.js";

export function mapToExtendedItem<TSchema extends DeliveryClientSchema>({
	allItems,
	item,
}: {
	readonly allItems: Readonly<Record<string, ContentItemPayload<TSchema> | undefined>>;
	readonly item: ContentItemPayload<TSchema>;
}): ContentItemPayloadExtended<TSchema> {
	for (const [key, element] of Object.entries(item.elements)) {
		// the item.elements is readonly, but we do want to mutate it here rather then creating new object
		(item.elements as Record<string, ContentItemElementPayloadExtended>)[key] = resolveExtendedElement(element, allItems);
	}

	// we know that for each element we have it's extended version
	return item as ContentItemPayloadExtended<TSchema>;
}

export function mapToExtendedModularContent<TSchema extends DeliveryClientSchema>({
	modularContents,
	allItems,
}: {
	readonly modularContents: Readonly<Record<string, ContentItemPayload<TSchema> | undefined>>;
	readonly allItems: Readonly<Record<string, ContentItemPayload<TSchema> | undefined>>;
}): Readonly<Record<string, ContentItemPayloadExtended<TSchema> | undefined>> {
	for (const modularContent of Object.values(modularContents).filter(isDefined)) {
		mapToExtendedItem({ allItems, item: modularContent });
	}

	// We know that for each item we have its extended version
	return modularContents as Readonly<Record<string, ContentItemPayloadExtended<TSchema> | undefined>>;
}

export function joinItems<TSchema extends DeliveryClientSchema>({
	items,
	modularContent,
}: {
	readonly items: readonly ContentItemPayload<TSchema>[];
	readonly modularContent: readonly Readonly<Record<string, ContentItemPayload<TSchema> | undefined>>[];
}): Readonly<Record<string, ContentItemPayload<TSchema>>> {
	const joinedItems: Record<string, ContentItemPayload<TSchema>> = {};
	for (const content of modularContent) {
		Object.assign(joinedItems, content);
	}

	for (const item of items) {
		joinedItems[item.system.codename] = item;
	}

	return joinedItems;
}

function resolveCodenamesToItems<TSchema extends DeliveryClientSchema>(
	codenames: readonly string[],
	allItems: Readonly<Record<string, ContentItemPayload<TSchema> | undefined>>,
): readonly ContentItemPayload<TSchema>[] {
	return codenames.reduce<ContentItemPayload<TSchema>[]>((preparedItems, codename) => {
		const record = allItems[codename];
		if (record) {
			preparedItems.push(record);
		}
		return preparedItems;
	}, []);
}

/**
 * We intentionally mutate element here rather then creating new object
 */
function resolveExtendedElement<TSchema extends DeliveryClientSchema>(
	element: ContentItemElementPayload,
	allItems: Readonly<Record<string, ContentItemPayload<TSchema> | undefined>>,
): ContentItemElementPayloadExtended {
	// Note - intentionally not using ts-pattern here for perf. reasons
	// also intentionally not using switch because biome cant infer the source types correctly here and reports false positives
	if (element.type === "modular_content") {
		return {
			...element,
			items: resolveCodenamesToItems(element.value, allItems),
		};
	}
	if (element.type === "rich_text") {
		return {
			...element,
			items: resolveCodenamesToItems(element.modular_content, allItems),
		};
	}
	return element;
}
