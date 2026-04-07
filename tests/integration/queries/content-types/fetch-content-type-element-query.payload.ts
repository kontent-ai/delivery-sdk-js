import type { DeliveryClientSchema } from "../../../../lib/models/core.models.js";
import type { ContentTypeElementPayload } from "../../../../lib/queries/content-types/content-type.models.js";

export default [
	{
		type: "text",
		name: "Title",
		codename: "title",
	},
	{
		type: "custom",
		name: "Custom",
		codename: "custom",
	},
	{
		type: "number",
		name: "Length in minutes",
		codename: "length_in_minutes",
	},
	{
		type: "rich_text",
		name: "Description",
		codename: "description",
	},
	{
		type: "multiple_choice",
		name: "Is blockbuster",
		options: [
			{
				name: "yes",
				codename: "yes",
			},
		],
		codename: "is_blockbuster",
	},
	{
		type: "date_time",
		name: "Release date",
		codename: "release_date",
	},
	{
		type: "asset",
		name: "Cover",
		codename: "cover",
	},
	{
		type: "taxonomy",
		name: "Category",
		taxonomy_group: "movie_type",
		codename: "category",
	},
	{
		type: "text",
		name: "Metadata description",
		codename: "metadata__metadata_description",
	},
	{
		type: "modular_content",
		name: "Cast",
		codename: "cast",
	},
] satisfies readonly ContentTypeElementPayload<DeliveryClientSchema>[];
