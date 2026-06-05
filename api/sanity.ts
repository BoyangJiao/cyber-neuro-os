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

    // This proxy is a public read relay for the Sanity *query* API (no token is
    // configured on the client — useCdn:false, anonymous). We therefore strip any
    // credential-bearing headers so the relay can never be abused to perform
    // authenticated writes on behalf of a token holder, and drop host-specific ones.
    const STRIPPED_HEADERS = new Set([
        'host', 'origin', 'referer', 'connection', 'content-length',
        'authorization', 'cookie', 'x-sanity-token',
    ]);
    const headers = new Headers();
    req.headers.forEach((v, k) => {
        if (!STRIPPED_HEADERS.has(k.toLowerCase())) {
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

        // CORS for the browser client. (Debug headers that leaked the upstream
        // project id / target URL have been removed.)
        responseHeaders.set('Access-Control-Allow-Origin', '*');

        return new Response(response.body, {
            status: response.status,
            headers: responseHeaders,
        });
    } catch (error) {
        console.error('[SANITY PROXY ERROR]', error);
        return new Response(JSON.stringify({ 
            error: 'Sanity Proxy Failed', 
            details: error instanceof Error ? error.message : String(error),
            status: 500,
            result: [] // Return empty array so .map() in frontend project store doesn't crash
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
