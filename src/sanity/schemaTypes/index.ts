import { type SchemaTypeDefinition } from 'sanity'
import { therapist } from './therapist'
import { massage } from './massage'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [therapist, massage],
}
