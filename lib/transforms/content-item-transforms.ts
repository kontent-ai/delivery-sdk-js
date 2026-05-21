import { isDefined } from "@kontent-ai/core-sdk";
import { match } from "ts-pattern";
import type { DeliveryClientSchema } from "../models/core.models.js";
import type { ContentItemPayload, ContentItemPayloadExtended } from "../queries/content-items/models/content-item.models.js";
import type { ContentItemElementPayload, ContentItemElementPayloadExtended } from "../queries/content-items/models/element.models.js";

type IntermediateItem<TSchema extends DeliveryClientSchema> = ContentItemPayloadExtended<TSchema> & {
	$rawElements?: Readonly<Record<string, ContentItemElementPayload>>;
};

function joinToIntermediateItems<TSchema extends DeliveryClientSchema>({
	items,
	modular_content,
}: {
	readonly items: readonly ContentItemPayload<TSchema>[];
	readonly modular_content: readonly Readonly<Record<string, ContentItemPayload<TSchema>>>[];
}): Record<string, IntermediateItem<TSchema>> {
	const createIntermediateRecord = <TSchema extends DeliveryClientSchema>(
		item: ContentItemPayload<TSchema>,
	): IntermediateItem<TSchema> => ({
		system: item.system,
		$rawElements: item.elements,
		elements: {},
	});

	// first prepare map from modular content
	const modularContentRecords = modular_content.reduce<Record<string, IntermediateItem<TSchema>>>((records, content) => {
		Object.entries(content).forEach(([key, item]) => {
			records[key] = createIntermediateRecord(item);
		});
		return records;
	}, {});

	// then merge input items into the map
	return items.reduce<Record<string, IntermediateItem<TSchema>>>((records, item) => {
		records[item.system.codename] = createIntermediateRecord(item);
		return records;
	}, modularContentRecords);
}

function resolveCodenamesToPreparedItems<TSchema extends DeliveryClientSchema>(
	codenames: readonly string[],
	intermediateRecords: Readonly<Record<string, IntermediateItem<TSchema>>>,
): readonly ContentItemPayloadExtended<TSchema>[] {
	return codenames.reduce<ContentItemPayloadExtended<TSchema>[]>((preparedItems, codename) => {
		const record = intermediateRecords[codename];
		if (record) {
			preparedItems.push(record);
		}
		return preparedItems;
	}, []);
}

function resolveExtendedElement<TSchema extends DeliveryClientSchema>(
	element: ContentItemElementPayload,
	intermediateRecords: Readonly<Record<string, IntermediateItem<TSchema>>>,
): ContentItemElementPayloadExtended {
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

export function mapExtendedItems<TSchema extends DeliveryClientSchema>({
	resolvedItems,
	originalItems,
	originalModularContent,
}: {
	readonly resolvedItems: Readonly<Record<string, ContentItemPayloadExtended<TSchema>>>;
	readonly originalItems: readonly ContentItemPayload<TSchema>[];
	readonly originalModularContent: Readonly<Record<string, ContentItemPayload<TSchema>>>;
}): {
	readonly modularContent: Readonly<Record<string, ContentItemPayloadExtended<TSchema>>>;
	readonly items: readonly ContentItemPayloadExtended<TSchema>[];
} {
	return {
		items: originalItems
			.map<ContentItemPayloadExtended<TSchema> | undefined>((originalItem) => {
				return resolvedItems[originalItem.system.codename];
			})
			.filter(isDefined),
		modularContent: Object.keys(originalModularContent).reduce<Record<string, ContentItemPayloadExtended<TSchema>>>(
			(resolvedModularContent, codename) => {
				const extendedItem = resolvedItems[codename];

				if (!extendedItem) {
					throw new Error(`Item with codename "${codename}" not found in resolved items`);
				}
				resolvedModularContent[codename] = extendedItem;
				return resolvedModularContent;
			},
			{},
		),
	};
}

export function mapExtendedItem<TSchema extends DeliveryClientSchema>({
	resolvedItems,
	originalItem,
	originalModularContent,
}: {
	readonly resolvedItems: Readonly<Record<string, ContentItemPayloadExtended<TSchema>>>;
	readonly originalItem: ContentItemPayload<TSchema>;
	readonly originalModularContent: Readonly<Record<string, ContentItemPayload<TSchema>>>;
}): {
	readonly modularContent: Readonly<Record<string, ContentItemPayloadExtended<TSchema>>>;
	readonly item: ContentItemPayloadExtended<TSchema>;
} {
	const extendedItem = resolvedItems[originalItem.system.codename];

	if (!extendedItem) {
		throw new Error(`Item with codename "${originalItem.system.codename}" not found in resolved items`);
	}

	return {
		item: extendedItem,
		modularContent: Object.keys(originalModularContent).reduce<Record<string, ContentItemPayloadExtended<TSchema>>>(
			(resolvedModularContent, codename) => {
				const extendedItem = resolvedItems[codename];

				if (!extendedItem) {
					throw new Error(`Item with codename "${codename}" not found in resolved items`);
				}
				resolvedModularContent[codename] = extendedItem;
				return resolvedModularContent;
			},
			{},
		),
	};
}

export function resolveExtendedItems<TSchema extends DeliveryClientSchema>({
	inputItems,
	modularContent,
}: {
	readonly inputItems: readonly ContentItemPayload<TSchema>[];
	readonly modularContent: readonly Readonly<Record<string, ContentItemPayload<TSchema>>>[];
}): Readonly<Record<string, ContentItemPayloadExtended<TSchema>>> {
	const intermediateRecords = joinToIntermediateItems({
		items: inputItems,
		modular_content: modularContent,
	});

	for (const intermediateRecord of Object.values(intermediateRecords)) {
		for (const [key, element] of Object.entries(intermediateRecord.$rawElements ?? {})) {
			intermediateRecord.elements[key] = resolveExtendedElement(element, intermediateRecords);
		}

		// delete $rawElement which was used to map extended elements
		delete intermediateRecord.$rawElements;
	}

	return intermediateRecords;
}
