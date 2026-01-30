import { z } from "zod";

export function getCodenameSchema<const TCodenames extends readonly string[]>(codenames?: TCodenames): z.ZodType<TCodenames[number]> {
	return codenames && codenames.length > 0 ? z.enum(codenames) : z.string();
}
