import type { z } from "zod";
import type { DeliveryClientSchema } from "../../../models/core.models.js";
import type { languageSchema, listLanguagesSchema } from "../schemas/language.schemas.js";

export type LanguagePayload<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof languageSchema<TSchema>>>;

export type ListLanguagesPayload<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof listLanguagesSchema<TSchema>>>;
