import { z } from "zod";

const nextPageSchema = z.url().or(z.literal(""));

const paginationObjectSchema = z.object({
	skip: z.number(),
	limit: z.number(),
	count: z.number(),
	next_page: nextPageSchema,
});

export const paginationSchema = z.object({
	pagination: paginationObjectSchema.readonly(),
});

export const paginationWithTotalCountSchema = z.object({
	pagination: z
		.object({
			...paginationObjectSchema.shape,
			total_count: z.number().optional(),
		})
		.readonly(),
});
