/**
 * streamParse — make a partially-streamed JSON string parseable.
 *
 * The render_works tool arguments arrive as a stream of fragments. To render the
 * UI progressively (nodes appearing as Borvis speaks), we "close" the partial JSON
 * at each step — finish any open string, drop a dangling comma, fill a dangling
 * key, and append the missing closing brackets — so it parses into the tree so far.
 *
 * It is intentionally best-effort: callers run the result through `parseUISpec`
 * (which drops malformed nodes) and keep an authoritative full parse at end-of-
 * stream. Any state this can't repair simply fails to parse and is skipped that tick.
 */

export function closePartialJson(input: string): string {
    let inString = false;
    let escaped = false;
    const stack: string[] = []; // expected closers, in open order

    for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (inString) {
            if (escaped) escaped = false;
            else if (ch === '\\') escaped = true;
            else if (ch === '"') inString = false;
            continue;
        }
        if (ch === '"') inString = true;
        else if (ch === '{') stack.push('}');
        else if (ch === '[') stack.push(']');
        else if (ch === '}' || ch === ']') stack.pop();
    }

    let out = input;

    if (inString) {
        // Drop a dangling escape, then close the string.
        if (escaped) out = out.slice(0, -1);
        out += '"';
    }

    out = out.replace(/\s+$/, '');
    if (out.endsWith(',')) out = out.slice(0, -1);
    if (out.endsWith(':')) out += 'null';

    for (let i = stack.length - 1; i >= 0; i--) out += stack[i];
    return out;
}
