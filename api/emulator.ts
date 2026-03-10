export const config = {
    runtime: 'edge',
};

export default async function handler(req: Request) {
    const url = new URL(req.url);
    // Forward to EmulatorJS CDN
    const path = url.pathname.replace(/^\/api\/emulator/, '') || '/';
    // Use the optimized CDN for EmulatorJS
    const targetUrl = `https://cdn.emulatorjs.org${path}${url.search}`;

    try {
        const response = await fetch(targetUrl, {
            method: req.method,
            headers: {
                'Accept': req.headers.get('Accept') || '*/*',
                'User-Agent': req.headers.get('User-Agent') || 'Mozilla/5.0',
            }
        });

        const responseHeaders = new Headers();
        // Forward essential headers
        ['content-type', 'cache-control', 'content-length'].forEach(h => {
            const val = response.headers.get(h);
            if (val) responseHeaders.set(h, val);
        });

        // Add CORS
        responseHeaders.set('Access-Control-Allow-Origin', '*');
        
        // CRITICAL FOR EMULATORS: Cross-Origin Isolation headers
        // These are often required for SharedArrayBuffer to work on mobile/modern browsers
        responseHeaders.set('Cross-Origin-Opener-Policy', 'same-origin');
        responseHeaders.set('Cross-Origin-Embedder-Policy', 'require-corp');

        return new Response(response.body, {
            status: response.status,
            headers: responseHeaders,
        });
    } catch (error) {
        console.error('[EMULATOR PROXY ERROR]', error);
        return new Response(JSON.stringify({ error: 'Emulator Proxy Failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
