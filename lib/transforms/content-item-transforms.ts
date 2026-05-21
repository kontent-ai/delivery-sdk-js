import { match } from "ts-pattern";
import type { DeliveryClientSchema } from "../models/core.models.js";
import type { ContentItemPayload, ContentItemPayloadExtended } from "../queries/content-items/models/content-item.models.js";
import type { ContentItemElementPayload, ContentItemElementPayloadExtended } from "../queries/content-items/models/element.models.js";
import type { LinkedItems, RichText } from "../queries/content-items/models/element-types.js";

export function mapToExtendedItem<TSchema extends DeliveryClientSchema>({
	allItems,
	item,
}: {
	readonly allItems: Readonly<Record<string, ContentItemPayload<TSchema>>>;
	readonly item: ContentItemPayload<TSchema>;
}): ContentItemPayloadExtended<TSchema> {
	// biome-ignore lint/nursery/noForIn: We intentionally want to use "in" for getting properties of elements (perf. reasons)
	for (const key in item.elements) {
		// biome-ignore lint/style/noNonNullAssertion: The element exists as we iterating through keys of it
		item.elements[key] = resolveExtendedElement(item.elements[key]!, allItems);
	}

	return item as ContentItemPayloadExtended<TSchema>;
}

export function mapToExtendedModularContent<TSchema extends DeliveryClientSchema>({
	modularContent,
	allItems,
}: {
	modularContent: Readonly<Record<string, ContentItemPayload<TSchema>>>;
	allItems: Readonly<Record<string, ContentItemPayload<TSchema>>>;
}): {
	[key: string]: ContentItemPayloadExtended<TSchema>;
} {
	// biome-ignore lint/nursery/noForIn: We intentionally want to use "in" for getting properties of elements (perf. reasons)
	for (const key in modularContent) {
		// biome-ignore lint/style/noNonNullAssertion: Item is guaranteed to be here as we iterate over keys in the condition above
		mapToExtendedItem({ allItems, item: modularContent[key]! });
	}

	return modularContent as Readonly<Record<string, ContentItemPayloadExtended<TSchema>>>;
}

export function joinItems<TSchema extends DeliveryClientSchema>({
	items,
	modularContent,
}: {
	readonly items: readonly ContentItemPayload<TSchema>[];
	readonly modularContent: readonly Readonly<Record<string, ContentItemPayload<TSchema>>>[];
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
	allItems: Readonly<Record<string, ContentItemPayload<TSchema>>>,
): readonly ContentItemPayload<TSchema>[] {
	const result: ContentItemPayload<TSchema>[] = [];
	for (const codename of codenames) {
		const record = allItems[codename];
		if (record) {
			result.push(record);
		}
	}

	return result;
}

/**
 * We intentionally use type assertion & mutation here as to avoid immutability overhead by copying values across elements
 */
function resolveExtendedElement<TSchema extends DeliveryClientSchema>(
	element: ContentItemElementPayload,
	allItems: Readonly<Record<string, ContentItemPayload<TSchema>>>,
): ContentItemElementPayloadExtended {
	return match(element)
		.returnType<ContentItemElementPayloadExtended>()
		.with({ type: "modular_content" }, (linkedItemElement) => {
			(linkedItemElement as LinkedItems & { items: readonly ContentItemPayload<TSchema>[] }).items = resolveCodenamesToItems(
				linkedItemElement.value,
				allItems,
			);
			return linkedItemElement as LinkedItems;
		})
		.with({ type: "rich_text" }, (richTextElement) => {
			(richTextElement as RichText & { items: readonly ContentItemPayload<TSchema>[] }).items = resolveCodenamesToItems(
				richTextElement.modular_content,
				allItems,
			);
			return richTextElement as RichText;
		})
		.otherwise((element) => element);
}
