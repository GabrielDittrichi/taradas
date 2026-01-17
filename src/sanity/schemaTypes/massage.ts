import { defineField, defineType } from 'sanity'

export const massage = defineType({
  name: 'massage',
  title: 'Massagem',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nome da Massagem',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descrição Curta',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'duration',
      title: 'Duração (ex: 60 min)',
      type: 'string',
    }),
    defineField({
      name: 'price',
      title: 'Preço',
      type: 'number',
    }),
    defineField({
      name: 'image',
      title: 'Imagem de Capa',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
})
