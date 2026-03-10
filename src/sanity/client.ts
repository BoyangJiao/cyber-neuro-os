import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { createQueryStore } from '@sanity/react-loader';

export const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'argneoi8';
export const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
export const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01';

// Custom fetch to proxy Sanity through our API route
// This ensures that users in regions where Sanity is blocked (like China) 
// can still see the content, as Vercel (Edge Functions) can reach Sanity.
const proxyFetch = (url: string | URL, init?: any) => {
    const urlStr = url.toString();
    
    // Check if we are in a browser environment and requesting Sanity
    if (typeof window !== 'undefined' && (urlStr.includes('.sanity.io') || urlStr.includes('sanity.io'))) {
        // Rewrite the host to point to our Vercel API Proxy
        // e.g., https://abc.api.sanity.io/v1/... -> /api/sanity/v1/...
        const proxiedUrl = urlStr.replace(/^https:\/\/[^/]+/, `${window.location.origin}/api/sanity`);
        
        // Log to console so we can verify if the proxy is being used in staging
        console.log(`[SanityProxy] Intercepted: ${urlStr} -> ${proxiedUrl}`);
        
        return fetch(proxiedUrl, init);
    }
    return fetch(url, init);
};

const clientConfig: any = {
    projectId,
    dataset,
    apiVersion,
    useCdn: false, // Must be false so we only have to proxy api.sanity.io (not apicdn)
    stega: {
        enabled: true,
        studioUrl: import.meta.env.VITE_SANITY_STUDIO_URL || 'http://localhost:3333',
    },
    // Use our custom fetch interceptor
    fetch: proxyFetch as any,
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
