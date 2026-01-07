import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'
import { presentationTool } from 'sanity/presentation'

export default defineConfig({
  name: 'default',
  title: 'Cyber Neurospace',

  projectId: 'argneoi8',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
    presentationTool({
      previewUrl: 'http://localhost:5173/projects',
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
