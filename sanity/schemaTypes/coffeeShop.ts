import {defineField, defineType} from 'sanity'
import { Coffee } from "lucide-react";

import {overallRating} from '@/sanity/lib/rating'

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
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{type: 'block'}],
      description: 'The fuller write-up shown on the café’s own page.',
    }),
    defineField({
      name: 'scores',
      title: 'Scores',
      type: 'object',
      description:
        'Score each category out of 10, where 10 is always best. The overall rating shown on the site is the average of the three.',
      options: {columns: 3},
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: 'vibe',
          title: 'Vibe',
          type: 'number',
          description: 'Atmosphere, décor, welcome. 1 (grim) to 10 (lovely).',
          validation: (rule) => rule.required().min(1).max(10),
        }),
        defineField({
          name: 'coffee',
          title: 'Coffee',
          type: 'number',
          description: 'The coffee itself. 1 (undrinkable) to 10 (superb).',
          validation: (rule) => rule.required().min(1).max(10),
        }),
        defineField({
          name: 'affordability',
          title: 'Affordability',
          type: 'number',
          description: 'Judge the prices alone, not value for money, 1 (priciest) to 10 (cheapest).',
          validation: (rule) => rule.required().min(1).max(10),
        }),
      ],
    }),
    defineField({
      name: 'dogFriendly',
      title: 'Dog friendly',
      type: 'string',
      description: 'Leave blank if we haven’t checked; the site shows nothing rather than guessing.',
      options: {
        list: [
          {title: 'Yes', value: 'yes'},
          {title: 'No', value: 'no'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'ownership',
      title: 'Chain or independent',
      type: 'string',
      options: {
        list: [
          {title: 'Independent', value: 'independent'},
          {title: 'Chain', value: 'chain'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
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
    select: {
      title: 'name',
      vibe: 'scores.vibe',
      coffee: 'scores.coffee',
      affordability: 'scores.affordability',
      media: 'mainImage',
    },
    prepare({title, vibe, coffee, affordability, media}) {
      const rating = overallRating({vibe, coffee, affordability})
      return {
        title,
        subtitle: rating === null ? 'Not scored yet' : `Rated ${rating}/10`,
        media,
      }
    },
  },
})
