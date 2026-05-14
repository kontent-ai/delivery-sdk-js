import type * as z from "zod/mini";
import type { paginationSchema, paginationWithTotalCountSchema } from "./pagination.schemas.js";

export type PaginationPayload = Readonly<z.infer<typeof paginationSchema>>;
export type PaginationWithTotalCountPayload = Readonly<z.infer<typeof paginationWithTotalCountSchema>>;
