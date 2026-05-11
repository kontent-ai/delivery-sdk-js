import type { z } from "zod";
import type { assetValueSchema, contentItemElementSchema } from "./element.schemas.js";

export type Asset = z.infer<typeof assetValueSchema>;

export type ContentItemElementPayload = z.infer<typeof contentItemElementSchema>;
