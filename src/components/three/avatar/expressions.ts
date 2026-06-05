/**
 * expressions — maps an Emotion to a set of ARKit blendshape target weights, and
 * a lightweight heuristic that picks an emotion from reply text.
 *
 * The heuristic is the "model judges emotion from its words" first cut (derived
 * client-side from the content). It can later be replaced by an emotion the LLM
 * itself returns — the rest of the pipeline (store.emotion → these targets) is
 * unchanged.
 */
import type { Emotion } from '../../../store/useAvatarStore';

/** All blendshapes the avatar actively drives (so they're reset each frame). */
export const MANAGED_MORPHS = [
    'jawOpen', 'jawForward', 'mouthFunnel', 'mouthPucker',
    'mouthSmile_L', 'mouthSmile_R', 'mouthFrown_L', 'mouthFrown_R',
    'mouthPress_L', 'mouthPress_R',
    'browInnerUp', 'browDown_L', 'browDown_R', 'browOuterUp_L', 'browOuterUp_R',
    'eyeWide_L', 'eyeWide_R', 'eyeSquint_L', 'eyeSquint_R',
    'eyeBlink_L', 'eyeBlink_R',
    'cheekSquint_L', 'cheekSquint_R', 'noseSneer_L', 'noseSneer_R',
] as const;

/** Resting expression per emotion (steady-state target weights). */
export const EMOTION_TARGETS: Record<Emotion, Record<string, number>> = {
    neutral: {},
    happy: { mouthSmile_L: 0.7, mouthSmile_R: 0.7, cheekSquint_L: 0.4, cheekSquint_R: 0.4, browInnerUp: 0.12 },
    sad: { mouthFrown_L: 0.6, mouthFrown_R: 0.6, browInnerUp: 0.7, eyeSquint_L: 0.3, eyeSquint_R: 0.3 },
    surprised: { eyeWide_L: 0.75, eyeWide_R: 0.75, browInnerUp: 0.5, browOuterUp_L: 0.6, browOuterUp_R: 0.6 },
    // Angry needs strong, unmistakable cues: heavy brow-down + sneer + pressed/frown.
    angry: { browDown_L: 1.0, browDown_R: 1.0, noseSneer_L: 0.55, noseSneer_R: 0.55, mouthPress_L: 0.45, mouthPress_R: 0.45, mouthFrown_L: 0.35, mouthFrown_R: 0.35, eyeSquint_L: 0.3, eyeSquint_R: 0.3 },
    curious: { browInnerUp: 0.45, browOuterUp_L: 0.4, browOuterUp_R: 0.2, eyeWide_L: 0.22, eyeWide_R: 0.22 },
};

/** Pick an emotion from the reply text (zh + en cues). */
export function classifyEmotion(text: string): Emotion {
    const t = text.toLowerCase();
    if (/(抱歉|对不起|遗憾|失败|无法|不能|sorry|unfortunately|cannot|can't|failed|unable)/.test(t)) return 'sad';
    if (/(警告|危险|警报|拒绝|错误|warning|danger|denied|forbidden|error)/.test(t)) return 'angry';
    if (/(哈哈|太好了|很棒|完美|成功|欢迎|excellent|great|awesome|perfect|love|welcome|🎉|😄|✨)/.test(t) || /[!！]{1,}/.test(text)) return 'happy';
    if (/[?？]|竟然|没想到|惊|真的吗|wow|really|whoa|amazing/.test(t)) return 'surprised';
    if (/(也许|可能|让我想想|或者|hmm|maybe|perhaps|consider|think)/.test(t)) return 'curious';
    return 'neutral';
}
