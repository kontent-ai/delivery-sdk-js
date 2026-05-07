import type { elementDef } from "./element.models.js";

export type Text = typeof elementDef.text;
export type Number = typeof elementDef.number;
export type RichText = typeof elementDef.richText;
export type MultipleChoice<TCodename extends string = string> = ReturnType<typeof elementDef.multipleChoice<TCodename>>;
export type DateTime = typeof elementDef.dateTime;
export type Asset = typeof elementDef.asset;
export type Taxonomy<TCodename extends string = string> = ReturnType<typeof elementDef.taxonomy<TCodename>>;
export type UrlSlug = typeof elementDef.urlSlug;
export type Custom = typeof elementDef.custom;
export type LinkedItems = typeof elementDef.linkedItems;
