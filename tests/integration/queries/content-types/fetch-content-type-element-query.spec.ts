import { describe, expect, it } from "vitest";
import { DeliverySdkError } from "../../../../lib/models/error.models.js";
import { contentTypeElementSchema } from "../../../../lib/queries/content-types/schemas/content-type.schemas.js";
import {
	createFailingClient,
	createIntegrationClient,
	createMockedClient,
	expectToMatchSchema,
	getExpectedUrl,
} from "../../../utils/integration-test.utils.js";
import { isFetchQueryWithExpectedFunctions } from "../../../utils/test.utils.js";
import rawPayload from "./fetch-content-type-element-query.payload.js";

describe("Fetch content type element query", () => {
	const typeCodename = "movie";
	const schema = contentTypeElementSchema();

	describe.each(rawPayload)("element '$codename'", (elementPayload) => {
		const elementCodename = elementPayload.codename;
		const endpoint = `types/${typeCodename}/elements/${elementCodename}` as const;

		describe("with mocked response", () => {
			const client = createMockedClient(elementPayload);
			const query = client.fetchContentTypeElement({ typeCodename, elementCodename, config: { schema } });

			it(`requests the '${endpoint}' endpoint`, () => {
				expect(query.inspect().data?.url).toEqual(getExpectedUrl(client, endpoint));
			});

			it("is a fetch query", () => {
				expect(isFetchQueryWithExpectedFunctions(query)).toBe(true);
			});

			it("fetch returns the mocked payload", async () => {
				const { payload } = await query.fetch();
				expect(payload).toEqual(elementPayload);
			});
		});

		describe("against integration environment", () => {
			const client = createIntegrationClient();
			const query = client.fetchContentTypeElement({ typeCodename, elementCodename, config: { schema } });

			it("fetch returns a payload matching the schema", async () => {
				const { payload } = await query.fetch();
				await expectToMatchSchema(schema, payload);
			});
		});
	});

	it("wraps request failures in DeliverySdkError", async () => {
		const { error } = await createFailingClient().fetchContentTypeElement({ typeCodename, elementCodename: "title" }).fetchSafe();
		expect(error).toBeInstanceOf(DeliverySdkError);
	});
});
