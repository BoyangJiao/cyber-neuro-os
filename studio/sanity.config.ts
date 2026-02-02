import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'
import { presentationTool } from 'sanity/presentation'
import { documentInternationalization } from '@sanity/document-internationalization'
import { assist } from '@sanity/assist'

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
    documentInternationalization({
      supportedLanguages: [
        { id: 'en', title: 'English' },
        { id: 'zh', title: 'Chinese' }
      ],
      schemaTypes: ['project'],
    }),
    assist(),
  ],

  schema: {
    types: schemaTypes,
  },
})
