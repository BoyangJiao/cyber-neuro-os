/**
 * useProjectDetails — fetch (and cache) full CMS detail for referenced projects.
 *
 * The project STORE only holds the light project list; the rich content modules,
 * hero media and core metrics live in a separate per-project detail query. When a
 * generative-UI spec references a project's real content, we fetch its detail on
 * demand via the shared Sanity client (same path the detail page uses, so it rides
 * the China-access proxy). Results are cached module-wide and keyed by language.
 */

import { useEffect, useReducer } from 'react';
import { client } from '../../sanity/client';
import { PROJECT_DETAIL_QUERY } from '../../sanity/queries';
import type { ProjectDetailData } from '../../data/projectDetails';

// `null` = fetched, no detail exists (so we don't refetch on every render).
const cache = new Map<string, ProjectDetailData | null>();
const inflight = new Set<string>();

const keyOf = (language: string, id: string) => `${language}:${id}`;

export interface ProjectDetailsResult {
    detailById: Map<string, ProjectDetailData>;
    loading: boolean;
}

export function useProjectDetails(ids: string[], language: 'en' | 'zh'): ProjectDetailsResult {
    const [, bump] = useReducer((n: number) => n + 1, 0);
    const idsKey = ids.filter(Boolean).join('|');

    useEffect(() => {
        let alive = true;
        const idList = idsKey ? idsKey.split('|') : [];
        const todo = idList.filter((id) => !cache.has(keyOf(language, id)) && !inflight.has(keyOf(language, id)));
        if (!todo.length) return;

        todo.forEach((id) => inflight.add(keyOf(language, id)));
        Promise.all(
            todo.map(async (id) => {
                try {
                    const data = await client.fetch<ProjectDetailData | null>(
                        PROJECT_DETAIL_QUERY,
                        { slug: id, language },
                    );
                    cache.set(keyOf(language, id), data ?? null);
                } catch {
                    cache.set(keyOf(language, id), null);
                } finally {
                    inflight.delete(keyOf(language, id));
                }
            }),
        ).then(() => { if (alive) bump(); });

        return () => { alive = false; };
    }, [idsKey, language]);

    const detailById = new Map<string, ProjectDetailData>();
    for (const id of idsKey ? idsKey.split('|') : []) {
        const v = cache.get(keyOf(language, id));
        if (v) detailById.set(id, v);
    }
    const loading = (idsKey ? idsKey.split('|') : []).some((id) => !cache.has(keyOf(language, id)));

    return { detailById, loading };
}
