import z from "zod";

export function getCodenameSchema<TCodename extends string>(codenames: readonly TCodename[]): z.ZodEnum<{ [K in TCodename]: K }>;
export function getCodenameSchema(codenames: undefined): z.ZodString;
export function getCodenameSchema(codenames?: readonly string[]) {
	return codenames ? z.enum(codenames) : z.string();
}
