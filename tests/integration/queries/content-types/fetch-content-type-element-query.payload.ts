import type { DeliveryClientSchema } from "../../../../lib/models/core.models.js";
import type { ContentTypeElementPayload } from "../../../../lib/queries/content-types/content-type.models.js";

export default {
	type: "text",
	name: "Title",
	codename: "title",
} satisfies ContentTypeElementPayload<DeliveryClientSchema>;
