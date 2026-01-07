import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { createQueryStore } from '@sanity/react-loader';

export const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'argneoi8';
export const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
export const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01';

export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false, // Must be false for live preview to work instantly
    perspective: 'published', // We will swap to 'previewDrafts' via loader if needed
    stega: {
        enabled: true, // Enable Content Source Maps
        studioUrl: 'http://localhost:3333', // Absolute URL to Studio for correct linking
    },
});

// Configure the React Loader with this client to enable Live Queries
const { loadQuery, useQuery, useLiveMode } = createQueryStore({ client: client as any }); // Cast as any if type mismatch occurs due to package versions

export { loadQuery, useQuery, useLiveMode };

const builder = imageUrlBuilder(client);

// Image URL builder - accepts Sanity image references
// Using generic type as @sanity/image-url types may vary by version
export function urlFor(source: Parameters<typeof builder.image>[0]) {
    return builder.image(source);
}
