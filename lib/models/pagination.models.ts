import z from "zod";

export const paginationSchema = z.object({
	pagination: z
		.object({
			skip: z.number(),
			limit: z.number(),
			count: z.number(),
			next_page: z.string(),
		})
		.readonly(),
});

export type PaginationSchema = Readonly<z.infer<typeof paginationSchema>>;
