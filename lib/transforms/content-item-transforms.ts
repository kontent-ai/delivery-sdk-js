import { match } from "ts-pattern";
import type { DeliveryClientSchema } from "../models/core.models.js";
import type { ContentItemPayload, ContentItemPayloadExtended } from "../queries/content-items/models/content-item.models.js";
import type { ContentItemElementPayload, ContentItemElementPayloadExtended } from "../queries/content-items/models/element.models.js";

export function mapToExtendedItem<TSchema extends DeliveryClientSchema>({
	allItems,
	item,
}: {
	readonly allItems: Readonly<Record<string, ContentItemPayload<TSchema>>>;
	readonly item: ContentItemPayload<TSchema>;
}): ContentItemPayloadExtended<TSchema> {
	for (const [key, element] of Object.entries(item.elements)) {
		item.elements[key] = resolveExtendedElement(element, allItems);
	}

	// we know that for each element we have it's extended version
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
	for (const item of Object.values(modularContent)) {
		mapToExtendedItem({ allItems, item });
	}

	// We know that for each item we have its extended version
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
	return codenames.reduce<ContentItemPayload<TSchema>[]>((preparedItems, codename) => {
		const record = allItems[codename];
		if (record) {
			preparedItems.push(record);
		}
		return preparedItems;
	}, []);
}

function resolveExtendedElement<TSchema extends DeliveryClientSchema>(
	element: ContentItemElementPayload,
	allItems: Readonly<Record<string, ContentItemPayload<TSchema>>>,
): ContentItemElementPayloadExtended {
	return match(element)
		.returnType<ContentItemElementPayloadExtended>()
		.with({ type: "modular_content" }, (linkedItemElement) => {
			return {
				...linkedItemElement,
				items: resolveCodenamesToItems(linkedItemElement.value, allItems),
			};
		})
		.with({ type: "rich_text" }, (richTextElement) => {
			return {
				...richTextElement,
				items: resolveCodenamesToItems(richTextElement.modular_content, allItems),
			};
		})
		.otherwise((element) => element);
}
