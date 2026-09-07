import { defineField, defineType } from 'sanity'

export const faqType = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'object', // 'object' allows it to be embedded directly inside the product
  fields: [
    defineField({
      name: 'Ques',
      title: 'Question',
      type: 'string',
    }),
    defineField({
      name: 'Ans',
      title: 'Answer',
      type: 'text', 
    }),
  ],
})