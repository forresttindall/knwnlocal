import { defineField, defineType } from "sanity";

export const sitePageType = defineType({
  name: "sitePage",
  title: "Site Page",
  type: "document",
  fields: [
    defineField({
      name: "pageKey",
      title: "Page key",
      type: "string",
      validation: (rule) => rule.required(),
      options: {
        list: [
          { title: "Home", value: "home" },
          { title: "YouTube", value: "youtube" },
          { title: "Email", value: "email" },
          { title: "Podcast", value: "podcast" },
        ],
      },
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "path",
      title: "Path",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "fields",
      title: "Fields",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [],
    }),
    defineField({
      name: "createdAt",
      title: "Created at",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "updatedAt",
      title: "Updated at",
      type: "datetime",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "pageKey",
    },
  },
});
