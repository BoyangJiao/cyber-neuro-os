/**
 * Vercel Serverless Function — Sanity API Proxy
 * 
 * Proxies Sanity requests from the client to the Sanity API.
 * This allows users in restricted regions (like China) to access Sanity data
 * without a VPN, as the browser talks to Vercel (accessible), 
 * and Vercel talks to Sanity (outside China).
 */

export const config = {
    runtime: 'edge',
};

declare const process: any;

export default async function handler(req: Request) {
    const url = new URL(req.url);
    const projectId = (process.env as any).VITE_SANITY_PROJECT_ID || 'argneoi8';

    // Extract the relative path after /api/sanity
    const path = url.pathname.replace(/^\/api\/sanity/, '') || '/';
    const targetUrl = `https://${projectId}.api.sanity.io${path}${url.search}`;

    try {
        const response = await fetch(targetUrl, {
            method: req.method,
            headers: {
                // Forward content-type and other necessary headers
                'Content-Type': req.headers.get('Content-Type') || 'application/json',
            },
            // Forward body for POST/PUT if needed
            body: req.method !== 'GET' && req.method !== 'HEAD' ? await req.blob() : undefined,
        });

        // Copy response headers
        const responseHeaders = new Headers();
        response.headers.forEach((v, k) => {
            if (['content-type', 'cache-control'].includes(k.toLowerCase())) {
                responseHeaders.set(k, v);
            }
        });

        // Add CORS for development flexibility
        responseHeaders.set('Access-Control-Allow-Origin', '*');

        return new Response(response.body, {
            status: response.status,
            headers: responseHeaders,
        });
    } catch (error) {
        console.error('[SANITY PROXY ERROR]', error);
        return new Response(JSON.stringify({ error: 'Sanity Proxy Failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
