import type { DeliveryClientSchema } from "../../../../lib/models/core.models.js";
import type { ContentTypePayload } from "../../../../lib/queries/content-types/content-type.models.js";

export default {
	system: {
		id: "445da25c-d991-4b0e-bece-c572124d91f5",
		name: "Movie",
		codename: "movie",
		last_modified: "2026-04-10T10:23:30.2425214Z",
	},
	elements: {
		title: {
			type: "text",
			name: "Title",
		},
		length_in_minutes: {
			type: "number",
			name: "Length in minutes",
		},
		description: {
			type: "rich_text",
			name: "Description",
		},
		is_blockbuster: {
			type: "multiple_choice",
			name: "Is blockbuster",
			options: [
				{
					name: "yes",
					codename: "yes",
				},
				{
					name: "no",
					codename: "no",
				},
			],
		},
		release_date: {
			type: "date_time",
			name: "Release date",
		},
		cover: {
			type: "asset",
			name: "Cover",
		},
		category: {
			type: "taxonomy",
			name: "Category",
			taxonomy_group: "movie_type",
		},
		url: {
			type: "url_slug",
			name: "Url",
		},
		metadata__metadata_description: {
			type: "text",
			name: "Metadata description",
		},
		cast: {
			type: "modular_content",
			name: "Cast",
		},
		custom: {
			type: "custom",
			name: "Custom",
			value: null,
		},
	},
} satisfies ContentTypePayload<DeliveryClientSchema>;
