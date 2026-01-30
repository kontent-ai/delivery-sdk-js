import { z } from "zod";

export function getCodenameSchema<const TCodenames extends string>(codenames?: readonly TCodenames[]): z.ZodType<TCodenames> {
	return codenames ? z.enum(codenames) : (z.string() as unknown as z.ZodType<TCodenames>);
}
