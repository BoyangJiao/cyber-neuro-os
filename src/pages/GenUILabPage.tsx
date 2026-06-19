/**
 * GenUILabPage — DEV-ONLY proving ground for the generative-UI contract.
 *
 * Lets you hand-author a UISpec and watch it validate + render through the real
 * components/store, exactly as Borvis will drive it in Phase 1+. Mirrors the
 * `/avatar-lab` pattern: gated behind `import.meta.env.DEV` in App.tsx so the
 * production build dead-strips it. Not shipped.
 */

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore';
import { GenerativeUI, parseUISpec, describeCatalog } from '../agent/generativeUI';

const sampleSpec = (ids: string[]): string => {
    const [a, b, c] = ids;
    const spec = {
        version: 1,
        blocks: [
            { type: 'prose', text: "Here's a slice of the author's work you might like:" },
            a && { type: 'workCard', projectId: a, emphasis: ['techStack', 'liveUrl'] },
            (b || c) && {
                type: 'workGrid',
                projectIds: [b, c].filter(Boolean),
                columns: 2,
            },
        ].filter(Boolean),
    };
    return JSON.stringify(spec, null, 2);
};

export function GenUILabPage() {
    const navigate = useNavigate();
    const projects = useProjectStore((s) => s.projects);
    // `draft === null` means "still showing the auto-seeded sample"; once the user
    // edits, draft holds their text. Deriving the value (instead of seeding via an
    // effect) keeps the sample in sync with late-arriving projects without a
    // setState-in-effect cascade.
    const [draft, setDraft] = useState<string | null>(null);

    // The lab renders before App's data effects, so fetch projects ourselves.
    useEffect(() => {
        if (!projects.length) useProjectStore.getState().fetchProjects();
    }, [projects.length]);

    const seeded = useMemo(
        () => (projects.length ? sampleSpec(projects.map((p) => p.id)) : ''),
        [projects],
    );
    const text = draft ?? seeded;
    const result = useMemo(() => (text.trim() ? parseUISpec(text) : null), [text]);

    return (
        <div className="min-h-dvh w-full bg-bg-deep text-text-primary">
            <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-6 py-8">
                <header className="flex items-center justify-between border-b border-brand-primary/20 pb-4">
                    <h1 className="font-display text-2xl font-bold text-text-accent">
                        GEN<span className="text-brand-primary">UI</span>_LAB
                    </h1>
                    <span className="font-mono text-xs text-text-secondary">
                        {projects.length} projects loaded · DEV ONLY
                    </span>
                </header>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Left: editor + reference */}
                    <div className="flex flex-col gap-4">
                        <div>
                            <div className="mb-2 font-mono text-xs uppercase tracking-widest text-text-secondary">
                                UISpec (editable)
                            </div>
                            <textarea
                                value={text}
                                onChange={(e) => setDraft(e.target.value)}
                                spellCheck={false}
                                className="h-80 w-full resize-y rounded-md border border-brand-primary/30 bg-black/40 p-3 font-mono text-xs text-text-primary outline-none focus:border-brand-primary/70"
                            />
                            {result && !result.ok && (
                                <div className="mt-2 font-mono text-xs text-status-danger">
                                    ✗ {result.error}
                                </div>
                            )}
                            {result && result.ok && (
                                <div className="mt-2 font-mono text-xs text-status-success">
                                    ✓ valid · {result.spec.blocks.length} block(s)
                                </div>
                            )}
                        </div>

                        <details className="rounded-md border border-white/10 bg-black/20 p-3">
                            <summary className="cursor-pointer font-mono text-xs uppercase tracking-widest text-text-secondary">
                                Available project ids
                            </summary>
                            <ul className="mt-2 space-y-1 font-mono text-xs text-text-secondary">
                                {projects.map((p) => (
                                    <li key={p.id}>
                                        <span className="text-brand-primary">{p.id}</span> — {p.title}
                                    </li>
                                ))}
                            </ul>
                        </details>

                        <details className="rounded-md border border-white/10 bg-black/20 p-3">
                            <summary className="cursor-pointer font-mono text-xs uppercase tracking-widest text-text-secondary">
                                Catalog (LLM prompt)
                            </summary>
                            <pre className="mt-2 whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-text-secondary">
                                {describeCatalog()}
                            </pre>
                        </details>
                    </div>

                    {/* Right: live render */}
                    <div className="rounded-md border border-brand-primary/20 bg-black/20 p-4">
                        <div className="mb-3 font-mono text-xs uppercase tracking-widest text-text-secondary">
                            Live render
                        </div>
                        {result && result.ok ? (
                            <GenerativeUI
                                spec={result.spec}
                                onOpenProject={(p) => navigate(`/projects/${p.id}`)}
                            />
                        ) : (
                            <div className="font-mono text-xs text-text-secondary">
                                {result ? 'Fix the spec to render.' : 'Waiting for a spec…'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
