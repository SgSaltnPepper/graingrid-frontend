import { type SchemaTypeDefinition } from 'sanity'
import { badgeType } from './badgeType'
import { categoryType } from './categoryType'
import { productType } from './productType'
import { faqType } from './faqType'
import { variantType } from './variantType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [badgeType, categoryType, productType, faqType, variantType],
}