import { describe } from "vitest";
import type { ContentTypeElementPayload } from "../../../../lib/queries/content-types/models/content-type.models.js";
import { contentTypeElementSchema } from "../../../../lib/queries/content-types/schemas/content-type.schemas.js";
import { runQueryTestsAsync } from "../../../utils/integration-test.utils.js";
import rawPayload from "./fetch-content-type-element-query.payload.js";

describe("Fetch content type element query", async () => {
	const typeCodename = "movie";

	const tests: readonly Promise<void>[] = rawPayload.map(async (payload) =>
		runQueryTestsAsync<ContentTypeElementPayload>({
			endpoint: `types/${typeCodename}/elements/${payload.codename}`,
			rawPayload: payload,
			selectQuery: (client) => client.fetchContentTypeElement({ typeCodename, elementCodename: payload.codename }),
			expectedSchema: contentTypeElementSchema(),
		}),
	);

	await Promise.all(tests);
});
