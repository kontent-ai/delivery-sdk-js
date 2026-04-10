import { z } from "zod";

const paginationObjectSchema = z.object({
	skip: z.number(),
	limit: z.number(),
	count: z.number(),
	next_page: z.string(),
});

export const paginationSchema = z.object({
	pagination: paginationObjectSchema.readonly(),
});

export const paginationSchemaWithTotalCount = z.object({
	pagination: z
		.object({
			...paginationObjectSchema.shape,
			total_count: z.number().optional(),
		})
		.readonly(),
});

export type PaginationSchema = Readonly<z.infer<typeof paginationSchema>>;
export type PaginationSchemaWithTotalCount = Readonly<z.infer<typeof paginationSchemaWithTotalCount>>;
