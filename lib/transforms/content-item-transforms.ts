import { match } from "ts-pattern";
import type { DeliveryClientSchema } from "../models/core.models.js";
import type { ContentItemPayload, ContentItemPayloadExtended } from "../queries/content-items/models/content-item.models.js";
import type { ContentItemElementPayload, ContentItemElementPayloadExtended } from "../queries/content-items/models/element.models.js";

type IntermediateRecord<TSchema extends DeliveryClientSchema> = {
	readonly item: ContentItemPayload<TSchema>;
	readonly preparedItem: ContentItemPayloadExtended<TSchema>;
};

function getIntermediateMap<TSchema extends DeliveryClientSchema>({
	items,
	modular_content,
}: {
	readonly items: readonly ContentItemPayload<TSchema>[];
	readonly modular_content: Readonly<Record<string, ContentItemPayload<TSchema>>>;
}): Map<string, IntermediateRecord<TSchema>> {
	const createIntermediateRecord = <TSchema extends DeliveryClientSchema>(
		item: ContentItemPayload<TSchema>,
	): IntermediateRecord<TSchema> => ({ item, preparedItem: { system: item.system, elements: {} } });

	const modularContentRecords = Object.entries(modular_content).reduce<Map<string, IntermediateRecord<TSchema>>>(
		(map, [key, item]) => map.set(key, createIntermediateRecord(item)),
		new Map<string, IntermediateRecord<TSchema>>(),
	);
	return items.reduce<Map<string, IntermediateRecord<TSchema>>>(
		(map, item) => map.set(item.system.codename, createIntermediateRecord(item)),
		modularContentRecords,
	);
}

function resolveExtendedElement<TSchema extends DeliveryClientSchema>(
	element: ContentItemElementPayload,
	intermediateRecords: Readonly<Map<string, IntermediateRecord<TSchema>>>,
): ContentItemElementPayloadExtended {
	const resolveCodenamesToPreparedItems = <TSchema extends DeliveryClientSchema>(
		codenames: readonly string[],
		intermediateRecords: Readonly<Map<string, IntermediateRecord<TSchema>>>,
	): readonly ContentItemPayloadExtended<TSchema>[] =>
		codenames.reduce<ContentItemPayloadExtended<TSchema>[]>((preparedItems, codename) => {
			const record = intermediateRecords.get(codename);
			if (record) {
				preparedItems.push(record.preparedItem);
			}
			return preparedItems;
		}, []);

	return match(element)
		.returnType<ContentItemElementPayloadExtended>()
		.with({ type: "modular_content" }, (linkedItemElement) => ({
			...linkedItemElement,
			items: resolveCodenamesToPreparedItems(linkedItemElement.value, intermediateRecords),
		}))
		.with({ type: "rich_text" }, (richTextElement) => ({
			...richTextElement,
			items: resolveCodenamesToPreparedItems(richTextElement.modular_content, intermediateRecords),
		}))
		.otherwise((element) => element);
}

export function resolveExtendedItems<TSchema extends DeliveryClientSchema>({
	inputItems,
	modularContent,
}: {
	readonly inputItems: readonly ContentItemPayload<TSchema>[];
	readonly modularContent: Readonly<Record<string, ContentItemPayload<TSchema>>>;
}): {
	readonly extendedItems: readonly ContentItemPayloadExtended<TSchema>[];
	readonly extendedModularContent: Readonly<Record<string, ContentItemPayloadExtended<TSchema>>>;
} {
	const intermediateRecords = getIntermediateMap({
		items: inputItems,
		modular_content: modularContent,
	});

	for (const intermediateRecord of intermediateRecords.values()) {
		for (const [key, element] of Object.entries(intermediateRecord.item.elements)) {
			intermediateRecord.preparedItem.elements[key] = resolveExtendedElement(element, intermediateRecords);
		}
	}

	return {
		extendedItems: inputItems.reduce<ContentItemPayloadExtended<TSchema>[]>((items, item) => {
			const intermediateRecord = intermediateRecords.get(item.system.codename);
			if (intermediateRecord) {
				items.push(intermediateRecord.preparedItem);
			}
			return items;
		}, []),
		// filter only items that were initially present in the modular_content
		extendedModularContent: Object.keys(modularContent).reduce<Record<string, ContentItemPayloadExtended<TSchema>>>(
			(extendedModularContent, key) => {
				const record = intermediateRecords.get(key);
				if (record) {
					extendedModularContent[key] = record.preparedItem;
				}
				return extendedModularContent;
			},
			{},
		),
	};
}
