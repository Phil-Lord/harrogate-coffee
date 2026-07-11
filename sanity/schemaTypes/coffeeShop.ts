import {defineField, defineType} from 'sanity'
import { Coffee } from "lucide-react";

export const coffeeShop = defineType({
  name: 'coffeeShop',
  title: 'Coffee Shop',
  type: 'document',
  icon: Coffee,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'The URL for this café’s page. Click “Generate” to make it from the name.',
      options: {source: 'name', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short description',
      type: 'text',
      rows: 2,
      description: 'The one-line “vibe” shown in the list. Keep it punchy.',
      validation: (rule) => rule.max(160).warning('Aim for under 160 characters.'),
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      description: 'Our rating out of 10.',
      validation: (rule) => rule.required().min(1).max(10),
    }),
    defineField({
      name: 'priceLevel',
      title: 'Price level',
      type: 'number',
      description: 'How pricey, 1 (cheap) to 10 (expensive).',
      validation: (rule) => rule.required().min(1).max(10),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          description: 'Describe the photo for screen readers and SEO.',
          validation: (rule) => rule.required().warning('Alt text is important for SEO.'),
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'rating', media: 'mainImage'},
    prepare({title, subtitle, media}) {
      return {
        title,
        subtitle: subtitle ? `Rated ${subtitle}/10` : 'No rating yet',
        media,
      }
    },
  },
})
