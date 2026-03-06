---
name: AI Chatbot & Agent UI Design Patterns
description: Comprehensive design patterns for embedded AI chatbot/agent interfaces, synthesized from LukeW's writings, competitive analysis, and modern UX research.
---

# AI Chatbot & Agent UI Design Patterns

## Sources
- **LukeW (lukew.com/ff)**: 12+ articles (2025–2026) on AI chat UI, agent orchestration, and embedded AI.
- **Competitive Analysis**: Portfolio chatbots, commercial website widgets, dark-theme assistants.
- **UX Research**: Nielsen/Norman Group, UXPlanet, various design systems.

---

## 1. The Receding Role of Chat

> *"Chat interfaces aren't going away, but their prominence should recede as agents get more capable."* — LukeW

### Key Insight
Traditional chat (you type → AI responds → you type again) is shifting toward:
- **Intent declaration** → Agent does the work → Results delivered
- Chat becomes a **background process monitor**, not the primary interface

### Application Rules
- Don't force users into lengthy back-and-forth conversations
- Focus UI emphasis on **results/outputs**, not the conversation thread
- Chat should be **available but not dominant** — use progressive disclosure

---

## 2. Progressive Disclosure of Agent Work

> *"Some users find agent work overwhelming; others say seeing it is essential."* — LukeW

### The Spectrum
| Show Nothing | Summary Only | Expandable Steps | Full Monologue |
|---|---|---|---|
| Spinner/indicator | One-line status | Collapsible steps list | Raw thinking + tool calls |

### Best Practice: **Summary by default, details on demand**
1. Show a single-line status while AI works (e.g., "Analyzing your question...")
2. Collapse to summary when done
3. Allow expansion to see full reasoning chain
4. Each step can link to its specific result

---

## 3. Scrolling Problem & Expand/Collapse Pattern

> *"People get lost when scrolling streams of replies."* — Nielsen/Norman Group, cited by LukeW

### Problem
Long AI responses push initial context off-screen. Users lose track of what they asked.

### Solutions
1. **Collapse previous exchanges**: Older Q&A pairs auto-collapse to equal-sized summaries
2. **Active message stays expanded**: Only the current exchange is fully visible
3. **Tap to expand**: Users can reopen any collapsed exchange
4. **Auto-scroll anchor**: Keep latest message visible without losing scroll position

---

## 4. Usable Chat Interface Patterns

### Input Design
- **Open-ended text field** is powerful for intent declaration
- Complement with **suggested prompts** / quick replies to overcome blank-slate anxiety
- **Auto-resize textarea** that grows with content (max 3-4 lines)
- Clear send affordance (button + Enter shortcut)

### Message Display
- **Differentiate roles clearly**: Distinct visual treatment for user vs. AI messages
- **Typing/streaming indicators**: Show real-time token arrival
- **Timestamp subtlety**: Small, secondary, not distracting
- **Markdown rendering**: Support for code blocks, lists, bold/italic

### Error States
- Non-intrusive inline errors
- Retry affordance alongside error message
- Graceful fallback messaging

---

## 5. Embedded AI in Portfolio/Website Context

### Design Considerations for Portfolio Chatbots
1. **It's a digital avatar, not a help desk** — Personality matters
2. **Lightweight footprint** — Must not obstruct portfolio content
3. **Conversational, not transactional** — Visitors are exploring, not completing tasks
4. **Trust signals** — Show it's AI without pretending to be the person
5. **Context-aware** — Can reference and guide visitors to specific portfolio content

### Entry Point Patterns
| Pattern | Pros | Cons |
|---|---|---|
| **Floating FAB** (bottom-right) | Familiar, unobtrusive | Generic, can feel like customer service |
| **Integrated footer button** | Feels native to the design system | Can be missed |
| **Expandable dock item** | Fits OS/dashboard metaphors | Requires education |
| **Ambient presence** (persistent small indicator) | Always visible, inviting | Takes screen space |

### Window Form Factors
| Pattern | Best For |
|---|---|
| **Side panel** (docked right) | Content-heavy conversations, dual-pane layouts |
| **Floating window** (draggable) | Power users, multi-tasking |
| **Bottom sheet** (grows up) | Mobile-first, quick interactions |
| **Modal overlay** | Focused conversations, immersive experiences |
| **Inline expansion** | Contextual assistance within content |

---

## 6. Cyberpunk-Themed Chat UI Specifics

### Visual Language Rules
- **Dark backgrounds**: Use `#0a0a0a`–`#121212`, never pure black
- **Neon accents**: Primary brand color for highlights, desaturated for large areas
- **Monospace typography**: For system labels, timestamps, status indicators
- **Sans-serif**: For actual message content (readability critical)
- **Glowing borders**: Subtle `box-shadow` with brand color, not heavy outlines
- **Scanline/noise textures**: Very subtle, in background only — never over text

### Animation Principles
- **Entry**: Scale up from origin point (button location) + fade in
- **Streaming text**: Character-by-character or chunk reveal
- **Status transitions**: Smooth color/opacity shifts
- **Exit**: Reverse of entry, slightly faster

### Spatial Hierarchy
- Chat window should feel like a **HUD overlay** — part of the system, not a popup
- Use existing design system components (HoloFrame, CyberButton) for consistency
- Status indicators should use cyberpunk diegetic UI language (pulsing dots, scan lines)

---

## 7. Agent Management Patterns (LukeW)

For more complex agent scenarios, familiar patterns help users adapt:

1. **Inbox** — Chronological stream of agent interactions, like email
2. **Task List** — Discrete items with completion states
3. **Kanban Board** — Visual workflow stages
4. **Dashboard** — Unified monitoring (mission control)
5. **Calendar** — Scheduled agent activities

> For a portfolio chatbot, the **Inbox** pattern is most appropriate — simple, familiar, focused on recent exchanges.

---

## 8. Context Management

> *"Context is king when making AI products effective."* — LukeW

### Principles
- Maintain conversation history across sessions (localStorage/persistence)
- Show conversation context without requiring scrolling
- Allow users to start fresh (clear history)
- Quick replies / suggested questions reduce cognitive load
- Bilingual support should mirror user's language choice

---

## 9. Anti-Patterns to Avoid

1. ❌ **Infinite scrolling of AI monologue** — Collapse/summarize instead
2. ❌ **Generic chatbot widget look** — Must match the host site's design system
3. ❌ **Pure black backgrounds** — Too harsh, use dark gray
4. ❌ **Heavy decorative elements over messages** — Readability first
5. ❌ **No personality** — An "assistant" ChatBot feels corporate on a portfolio
6. ❌ **Blocking the main content** — Chat should be dismissible and non-obstructive
7. ❌ **No error handling** — AI failures must be graceful and informative
8. ❌ **No streaming feedback** — Users need to see the AI is working

---

## 10. Implementation Checklist

### Entry Point
- [ ] Distinctive, on-brand trigger button
- [ ] Persistent but non-intrusive positioning
- [ ] Visual state change when chat is active
- [ ] Optional notification badge for new context

### Window
- [ ] Smooth open/close animations from trigger point
- [ ] Appropriate size for the content type
- [ ] Collapsible/minimizable without losing context
- [ ] Keyboard shortcuts (Escape to close)

### Conversation
- [ ] Clear role differentiation (user vs AI)  
- [ ] Streaming text with visual feedback
- [ ] Collapse old messages / expand on demand
- [ ] Quick reply suggestions for cold starts
- [ ] Markdown rendering for rich responses
- [ ] Scroll management (auto-scroll + manual override)

### System Integration
- [ ] Consistent with host site's design system
- [ ] Responsive to viewport changes
- [ ] Persist conversation across navigation
- [ ] Accessibility: keyboard navigation, screen reader support
