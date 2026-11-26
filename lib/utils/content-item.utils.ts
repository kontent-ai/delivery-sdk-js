import type {
	ContentItemLike,
	ContentItemOfType,
	ContentItemSnippetCodenameOf,
	ContentItemWithElementsLike,
	ContentItemWithSnippet,
} from "../queries/content-items/models/content-item.models.js";

/**
 * Checks whether a content item is of the given content type(s) and narrows it to the matching item model.
 *
 * TypeScript can't narrow an item union by `item.system.type === "movie"` because the discriminant is nested,
 * so use this guard (or the `ofContentTypes` request parameter) instead.
 *
 * @example
 * ```ts
 * if (isContentItemOfType(item, "movie")) {
 *   item.elements.title.value; // item is narrowed to the Movie model
 * }
 * ```
 */
export function isContentItemOfType<TItem extends ContentItemLike, const TTypeCodename extends TItem["system"]["type"]>(
	item: TItem | null | undefined,
	type: TTypeCodename | readonly TTypeCodename[],
): item is ContentItemOfType<TItem, TTypeCodename> {
	if (!item) {
		return false;
	}
	const types: readonly string[] = typeof type === "string" ? [type] : type;
	return types.includes(item.system.type);
}

/**
 * Checks whether a content item uses the given content type snippet and narrows it to the item models that contain
 * the snippet's elements. Like {@link isContentItemOfType}, the accepted snippet codenames come from the item models.
 *
 * Snippet elements are named `<snippet codename>__<element codename>`, and the check looks for elements with that
 * prefix. It returns `false` when the `elements` or `excludeElements` query parameter removed every snippet element
 * from the response. Item models that leave out the snippet elements are not narrowed to.
 *
 * @example
 * ```ts
 * if (isContentItemWithSnippet(item, "metadata")) {
 *   item.elements.metadata__title.value; // item is narrowed to the models using the "metadata" snippet
 * }
 * ```
 */
export function isContentItemWithSnippet<
	TItem extends ContentItemWithElementsLike,
	const TSnippet extends ContentItemSnippetCodenameOf<TItem>,
>(item: TItem | null | undefined, snippet: TSnippet): item is ContentItemWithSnippet<TItem, TSnippet> {
	if (!item) {
		return false;
	}
	const prefix = `${snippet}__`;
	return Object.keys(item.elements).some((codename) => codename.startsWith(prefix));
}
