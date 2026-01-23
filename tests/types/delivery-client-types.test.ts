/** biome-ignore-all lint/correctness/noUnusedVariables: This file is for compile-time checks */
import { createDeliveryClientSchema } from "../../lib/public_api.js";

type OriginTypes = {
	readonly languageCodenames: "en-US" | "cs-CZ";
};

const schema = createDeliveryClientSchema<OriginTypes>()({
	languageCodenames: ["en-US", "cs-CZ"] as const,
});

// @ts-expect-error - missing "cs-CZ"
createDeliveryClientSchema<OriginTypes>()({ languageCodenames: ["en-US"] as const });

// @ts-expect-error - "de-DE" is not allowed
createDeliveryClientSchema<OriginTypes>()({ languageCodenames: ["en-US", "cs-CZ", "de-DE"] as const });

void schema;
