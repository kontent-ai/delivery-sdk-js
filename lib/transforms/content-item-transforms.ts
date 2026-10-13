import { isDefined } from "@kontent-ai/core-sdk";
import type { DeliveryClientSchema } from "../models/core.models.js";
import type { ContentItemPayload, ContentItemPayloadExtended } from "../queries/content-items/models/content-item.models.js";
import type { ContentItemElementPayload, ContentItemElementPayloadExtended } from "../queries/content-items/models/element.models.js";

/**
 * Extends the item in place by replacing each of its elements with the extended version.
 *
 * Linked items are referenced rather than copied, so they are fully extended only once
 * every item in `allItems` has been extended as well.
 */
export function extendItemInPlace<TSchema extends DeliveryClientSchema>(
	item: ContentItemPayload<TSchema>,
	allItems: Readonly<Record<string, ContentItemPayload<TSchema> | undefined>>,
): asserts item is ContentItemPayloadExtended<TSchema> {
	for (const [key, element] of Object.entries(item.elements)) {
		// the item.elements is readonly, but we do want to mutate it here rather then creating new object
		(item.elements as Record<string, ContentItemElementPayloadExtended>)[key] = resolveExtendedElement(element, allItems);
	}
}

export function extendItemsInPlace<TSchema extends DeliveryClientSchema>(
	items: readonly ContentItemPayload<TSchema>[],
	allItems: Readonly<Record<string, ContentItemPayload<TSchema> | undefined>>,
): asserts items is readonly ContentItemPayloadExtended<TSchema>[] {
	for (const item of items) {
		extendItemInPlace(item, allItems);
	}
}

export function extendModularContentInPlace<TSchema extends DeliveryClientSchema>(
	modularContents: Readonly<Record<string, ContentItemPayload<TSchema> | undefined>>,
	allItems: Readonly<Record<string, ContentItemPayload<TSchema> | undefined>>,
): asserts modularContents is Readonly<Record<string, ContentItemPayloadExtended<TSchema> | undefined>> {
	for (const modularContent of Object.values(modularContents).filter(isDefined)) {
		extendItemInPlace(modularContent, allItems);
	}
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
	const preparedItems: (ContentItemPayload<TSchema> | undefined)[] = [];

	for (const codename of codenames) {
		preparedItems.push(allItems[codename]);
	}

	return preparedItems.filter(isDefined);
}

/**
 * We add the extra properties to the element where required (e.g. the "items" in RTE or Linked items elements)
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
