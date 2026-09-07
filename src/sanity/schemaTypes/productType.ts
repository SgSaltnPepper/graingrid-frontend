import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "Name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "Price",
      title: "Price",
      type: "number",
    }),
    defineField({
      name: "Description",
      title: "Main Product Description",
      type: "text", // Use 'text' for a simple text area, or 'array' (of 'block') for rich text
      description:
        "This description appears on the left side of the product page under the main title.",
    }),
    defineField({
      name: "Image",
      title: "Main Image",
      type: "cloudinary.asset",
      options: { hotspot: true },
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    }),
    defineField({
      name: "badges",
      title: "Badges",
      type: "array",
      of: [{ type: "reference", to: [{ type: "badge" }] }],
    }),
    defineField({
      name: "variants",
      title: "Variants",
      type: "array",
      of: [{ type: "variant" }], // References your new variant object
    }),
    defineField({
      name: "FAQs",
      title: "FAQs",
      type: "array",
      of: [{ type: "faq" }], // References your new faq object
    }),
  ],
});
