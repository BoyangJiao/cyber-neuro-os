/**
 * sanitizeEmbed — allowlist sanitizer for CMS-authored embed HTML.
 *
 * The `videoEmbed` field in Sanity is raw HTML rendered via dangerouslySetInnerHTML.
 * Even though CMS content is semi-trusted, a leaked editor token must not translate
 * into stored XSS on the public site. This strips <script>/<style>, all inline event
 * handlers (on*), and javascript:/data: URLs, while keeping the embed markup
 * (iframe/video/img/anchor + layout wrappers) that legitimate embeds need.
 *
 * Runs client-side only (uses DOMParser); callers render the result in the browser.
 */

const ALLOWED_TAGS = new Set([
    'iframe', 'video', 'source', 'img', 'a',
    'div', 'p', 'span', 'br', 'figure', 'figcaption',
]);

// Attributes safe to keep per element. `style` is intentionally excluded to avoid
// CSS-based exfiltration tricks; layout is handled by the wrapper's Tailwind classes.
const ALLOWED_ATTRS = new Set([
    'src', 'href', 'width', 'height', 'allow', 'allowfullscreen', 'frameborder',
    'title', 'loading', 'target', 'rel', 'controls', 'autoplay', 'muted', 'loop',
    'playsinline', 'poster', 'type', 'alt', 'referrerpolicy', 'class',
]);

const URL_ATTRS = new Set(['src', 'href', 'poster']);

function isSafeUrl(value: string): boolean {
    const v = value.trim().toLowerCase();
    // Allow protocol-relative, root-relative, fragment, and http(s) only.
    if (v.startsWith('//') || v.startsWith('/') || v.startsWith('#')) return true;
    return v.startsWith('https:') || v.startsWith('http:');
}

function sanitizeElement(el: Element) {
    const tag = el.tagName.toLowerCase();

    // Drop disallowed elements entirely (scripts, styles, objects, etc.).
    if (!ALLOWED_TAGS.has(tag)) {
        el.remove();
        return;
    }

    // Strip unsafe attributes. Iterate over a static copy since we mutate.
    for (const attr of Array.from(el.attributes)) {
        const name = attr.name.toLowerCase();
        if (name.startsWith('on') || !ALLOWED_ATTRS.has(name)) {
            el.removeAttribute(attr.name);
            continue;
        }
        if (URL_ATTRS.has(name) && !isSafeUrl(attr.value)) {
            el.removeAttribute(attr.name);
        }
    }

    // Anchors that open new tabs must not leak the opener.
    if (tag === 'a' && el.getAttribute('target') === '_blank') {
        el.setAttribute('rel', 'noopener noreferrer');
    }

    // Recurse (copy first — children list is live).
    for (const child of Array.from(el.children)) {
        sanitizeElement(child);
    }
}

export function sanitizeEmbed(html: string): string {
    if (!html || typeof html !== 'string') return '';
    if (typeof DOMParser === 'undefined') return ''; // SSR guard — never trust raw HTML server-side

    const doc = new DOMParser().parseFromString(html, 'text/html');
    for (const child of Array.from(doc.body.children)) {
        sanitizeElement(child);
    }
    return doc.body.innerHTML;
}
