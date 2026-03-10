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
    const projectId = (process.env as any).VITE_SANITY_PROJECT_ID || (process.env as any).SANITY_PROJECT_ID || 'argneoi8';

    // Extract the relative path after /api/sanity
    const path = url.pathname.replace(/^\/api\/sanity/, '') || '/';
    const targetUrl = `https://${projectId}.api.sanity.io${path}${url.search}`;

    const headers = new Headers();
    // Forward most headers except sensitive or host-specific ones
    req.headers.forEach((v, k) => {
        const key = k.toLowerCase();
        if (!['host', 'origin', 'referer', 'connection', 'content-length'].includes(key)) {
            headers.set(k, v);
        }
    });

    try {
        const body = req.method !== 'GET' && req.method !== 'HEAD' ? await req.arrayBuffer() : undefined;

        const response = await fetch(targetUrl, {
            method: req.method,
            headers,
            body: body,
        });

        // Copy response headers
        const responseHeaders = new Headers();
        response.headers.forEach((v, k) => {
            // Forward relevant metadata to client
            if (['content-type', 'cache-control', 'x-sanity-asset-id'].includes(k.toLowerCase())) {
                responseHeaders.set(k, v);
            }
        });

        // Add CORS and Debug info
        responseHeaders.set('Access-Control-Allow-Origin', '*');
        responseHeaders.set('x-debug-sanity-project-id', projectId);
        responseHeaders.set('x-debug-target-url', targetUrl);

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
