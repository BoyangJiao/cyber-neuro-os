import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { createQueryStore } from '@sanity/react-loader';

export const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'argneoi8';
export const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
export const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01';

const isDev = import.meta.env.DEV;

export const client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-05-01',
    // In dev mode, we default to our local Vite proxy to avoid direct connection issues.
    apiHost: import.meta.env.VITE_SANITY_API_HOST || (isDev ? '/api/sanity' : undefined),
    stega: {
        enabled: isDev,
        studioUrl: import.meta.env.VITE_SANITY_STUDIO_URL || 'http://localhost:3333',
    },
});

// Configure the React Loader with this client to enable Live Queries
const { loadQuery, useQuery, useLiveMode } = createQueryStore({ client });

export { loadQuery, useQuery, useLiveMode };

const builder = imageUrlBuilder(client);

// Image URL builder - accepts Sanity image references
// Using generic type as @sanity/image-url types may vary by version
export function urlFor(source: Parameters<typeof builder.image>[0]) {
    return builder.image(source);
}
