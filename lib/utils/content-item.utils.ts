import type { ContentItemLike, ContentItemOfType } from "../queries/content-items/models/content-item.models.js";

/**
 * Checks whether a content item is of the given content type(s) and narrows it to the matching item model.
 *
 * TypeScript can't narrow an item union by `item.system.type === "movie"` because the discriminant is nested,
 * so use this guard (or the `contentTypes` request parameter) instead.
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
