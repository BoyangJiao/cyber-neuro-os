import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { createQueryStore } from '@sanity/react-loader';

export const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'argneoi8';
export const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
export const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01';

// Initialize client configuration with defaults
const clientConfig: any = {
    projectId,
    dataset,
    apiVersion,
    useCdn: false, // Ensure consistency with react-loader
    stega: {
        enabled: true,
        studioUrl: import.meta.env.VITE_SANITY_STUDIO_URL || 'http://localhost:3333',
    },
    // Use proxy by default to ensure access in restricted regions (like China)
    apiHost: import.meta.env.VITE_SANITY_API_HOST || '/api/sanity',
};

export const client = createClient(clientConfig);

// Configure the React Loader with this client to enable Live Queries
const { loadQuery, useQuery, useLiveMode } = createQueryStore({ client });

export { loadQuery, useQuery, useLiveMode };

const builder = imageUrlBuilder(client);

// Image URL builder - accepts Sanity image references
// Using generic type as @sanity/image-url types may vary by version
export function urlFor(source: Parameters<typeof builder.image>[0]) {
    return builder.image(source);
}
