import { defineField, defineType } from 'sanity'

export const variantType = defineType({
  name: 'variant',
  title: 'Product Variant',
  type: 'object',
  fields: [
    defineField({
      name: 'Type',
      title: 'Variant Type',
      type: 'string',
      description: 'e.g., Size, Weight, Packaging',
    }),
    defineField({
      name: 'Label',
      title: 'Label',
      type: 'string',
    }),
    defineField({
      name: 'Value',
      title: 'Value',
      type: 'string',
    }),
    defineField({
      name: 'Description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'variantImage',
      title: 'Variant Image',
      type: 'cloudinary.asset',
      options: { hotspot: true },
    }),
  ],
})