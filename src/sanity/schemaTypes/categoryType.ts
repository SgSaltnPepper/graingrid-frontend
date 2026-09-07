import { defineField, defineType } from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'Name',
      title: 'Category Name',
      type: 'string',
    }),
    defineField({
      name: 'CatImage',
      title: 'Category Image',
      type: 'cloudinary.asset',
      options: { hotspot: true },
    }),
    defineField({
      name: 'parent',
      title: 'Parent Category',
      type: 'reference',
      to: [{ type: 'category' }], // Self-referential for subcategories
    }),
  ],
})