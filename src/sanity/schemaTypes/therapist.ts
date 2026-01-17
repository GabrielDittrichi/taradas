import { defineField, defineType } from 'sanity'

export const therapist = defineType({
  name: 'therapist',
  title: 'Terapeuta',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nome',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Telefone / WhatsApp',
      type: 'string',
      description: 'Número para contato (ex: 351962252659)',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'specialties',
      title: 'Especialidades',
      type: 'array',
      description: 'Massagens que esta terapeuta realiza',
      of: [{ type: 'reference', to: { type: 'massage' } }],
    }),
    defineField({
      name: 'availability',
      title: 'Datas de Atendimento',
      type: 'array',
      of: [
        { 
          type: 'date',
          options: {
            dateFormat: 'DD-MM-YYYY',
          }
        }
      ],
    }),
    defineField({
      name: 'image',
      title: 'Foto',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Biografia',
      type: 'text',
    }),
    defineField({
      name: 'gallery',
      title: 'Galeria de Fotos',
      type: 'array',
      of: [{ type: 'image' }],
      options: {
        layout: 'grid',
      },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
})
