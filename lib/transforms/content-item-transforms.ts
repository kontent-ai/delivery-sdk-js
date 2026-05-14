import { isDefined } from "@kontent-ai/core-sdk";
import { match } from "ts-pattern";
import type { DeliveryClientSchema } from "../models/core.models.js";
import type { ContentItemPayload, ContentItemPayloadExtended } from "../queries/content-items/models/content-item.models.js";
import type { ContentItemElementPayloadExtended } from "../queries/content-items/models/element.models.js";

function extractToMapByCodename<TSchema extends DeliveryClientSchema>({
	items,
	modular_content,
}: {
	readonly items: readonly ContentItemPayload<TSchema>[];
	readonly modular_content: Readonly<Record<string, ContentItemPayload<TSchema>>>;
}) {
	const itemsFromModularContent = new Map<string, ContentItemPayload<TSchema>>(
		Object.entries(modular_content).map(([codename, item]) => {
			return [codename, item];
		}),
	);

	const mainItems = new Map<string, ContentItemPayload<TSchema>>(items.map((m) => [m.system.codename, m]));

	return new Map<string, ContentItemPayload<TSchema>>([...itemsFromModularContent, ...mainItems]);
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
	const allInputItems = extractToMapByCodename({
		items: inputItems,
		modular_content: modularContent,
	});
	const preparedItems = new Map<string, ContentItemPayloadExtended<TSchema>>(
		allInputItems.entries().map(([codename, item]) => [codename, { system: item.system, elements: {} }]),
	);

	for (const item of allInputItems.values()) {
		const preparedItem = preparedItems.get(item.system.codename);

		if (!preparedItem) {
			throw new Error(
				`Item with codename ${item.system.codename} was not prepared for extension. This is a SDK related issue. Please, report it to the developers.`,
			);
		}

		for (const [key, element] of Object.entries(item.elements)) {
			const extendedElement = match(element)
				.returnType<ContentItemElementPayloadExtended>()
				.with({ type: "modular_content" }, (linkedItemElement) => ({
					...linkedItemElement,
					items: linkedItemElement.value.map((itemCodename) => preparedItems.get(itemCodename)).filter(isDefined),
				}))
				.with({ type: "rich_text" }, (richTextElement) => ({
					...richTextElement,
					items: richTextElement.modular_content.map((itemCodename) => preparedItems.get(itemCodename)).filter(isDefined),
				}))
				.otherwise((element) => element);

			preparedItem.elements[key] = extendedElement;
		}
	}

	return {
		extendedItems: inputItems.map((item) => preparedItems.get(item.system.codename)).filter(isDefined),
		// filter only items that were initially present in the modular_content
		extendedModularContent: Object.fromEntries(preparedItems.entries().filter(([key]) => modularContent[key])),
	};
}
