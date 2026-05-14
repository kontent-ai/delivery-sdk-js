import * as z from "zod/mini";

const nextPageSchema = z.union([z.url(), z.literal("")]);

const paginationObjectSchema = z.object({
	skip: z.number(),
	limit: z.number(),
	count: z.number(),
	next_page: nextPageSchema,
});

export const paginationSchema = z.object({
	pagination: z.readonly(paginationObjectSchema),
});

export const paginationWithTotalCountSchema = z.object({
	pagination: z.readonly(
		z.object({
			...paginationObjectSchema.shape,
			total_count: z.optional(z.number()),
		}),
	),
});
