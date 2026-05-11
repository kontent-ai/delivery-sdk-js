import type { z } from "zod";
import type { DeliveryClientSchema } from "../../models/core.models.js";
import type { contentTypeElementSchema, contentTypeSchema, listContentTypesSchema } from "./content-type.schemas.js";

export type ContentTypePayload<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof contentTypeSchema<TSchema>>>;

export type ContentTypeElementPayload = z.infer<ReturnType<typeof contentTypeElementSchema>>;

export type ListContentTypesPayload<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof listContentTypesSchema<TSchema>>>;
