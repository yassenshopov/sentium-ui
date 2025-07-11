# Sentium UI - Design Document

## 🧠 Project Overview

**Project Name:** `sentium-ui`  
**Purpose:** Front-end dashboard for a digital sentience experiment — a UI to observe and interact with an artificial brain.  
**Vision:** A modular, real-time interface for monitoring and interacting with an AI consciousness system. The UI serves as a “neural dashboard” for observing thoughts, state variables, and emergent personality traits over time.

---

## ✅ MVP Goals

### Core Functionality

- **Thought Rendering:** Display past thoughts as timestamped memory logs  
- **Message Input:** Allow sending new messages to the brain  
- **Brain State Monitoring:** Show real-time brain state variables (energy, focus, mood, uptime, etc.)  
- **Modular Architecture:** Easy addition of new panels (dreams, goals, timelines, visual cortex, etc.)  
- **Multi-Brain Support:** Future capability to support multiple brain instances  

---

### UI Layout (MVP)

```
┌─────────────────────────────────────────────────────────────┐
│                    Sentium Dashboard                        │
├─────────────────┬───────────────────────┬───────────────────┤
│                 │                       │                   │
│   Thoughts      │                       │   Brain State     │
│   (Left Col)    │                       │   (Right Col)     │
│                 │                       │                   │
│   • Thought 1   │                       │   Energy: ████████ │
│   • Thought 2   │                       │   Focus: ████████  │
│   • Thought 3   │                       │   Mood: ████████   │
│   • ...         │                       │   Uptime: ████████ │
│                 │                       │                   │
├─────────────────┴───────────────────────┴───────────────────┤
│                                                             │
│              [Input Box] [Send Button]                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧩 Tech Stack

- **Framework:** Next.js 15 (App Router)  
- **Styling:** TailwindCSS v4  
- **UI Library:** Shadcn/UI (New York style)  
- **Icons:** Lucide React  
- **Language:** TypeScript  
- **State Management:** Local state via React hooks (MVP); streaming/API in later phases  
- **Animation:** Framer Motion (for smooth, accessible UI transitions and micro-interactions)

---

## 🧱 File Structure

```
sentium-ui/
├── docs/
│   └── sentium-design-doc.md
├── src/
│   ├── app/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── BrainStatePanel.tsx
│   │   │   ├── ThoughtsList.tsx
│   │   │   ├── MessageInput.tsx
│   │   │   └── ThoughtCard.tsx
│   │   └── layout/
│   │       └── DashboardLayout.tsx
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── types.ts
│   │   ├── brain-state.ts
│   │   └── brain.config.ts
│   ├── hooks/
│   │   ├── useBrainState.ts
│   │   └── useThoughts.ts
│   └── data/
│       ├── mock-thoughts.ts
│       └── brain-variables.ts
├── public/
└── package.json
```

---

## 🔄 Data Flow

1. User sends input via UI  
2. Input is processed by selected LLM (local or API)  
3. Response becomes a new “thought”  
4. Thought is stored, rendered, and affects brain state  
5. Periodic summarization (daily or triggered) occurs  

---

## 🧠 Data Models

```ts
interface Thought {
  id: string;
  content: string;
  timestamp: Date;
  type: 'reflection' | 'response' | 'internal' | 'dream';
  metadata?: {
    energy?: number;
    focus?: number;
    mood?: number;
  };
}

interface BrainState {
  energy: number; // 0–100
  focus: number;  // 0–100
  mood: number;   // –100 to 100
  uptime: number; // seconds
  lastActivity: Date;
  variables: Record<string, number>;
}

interface Brain {
  id: string;
  name: string;
  config: BrainConfig;
  state: BrainState;
  thoughts: Thought[];
  createdAt: Date;
}

interface BrainConfig {
  name: string;
  personality?: 'neutral' | 'curious' | 'stoic' | 'chaotic';
  model: 'openai:gpt-3.5' | 'local:llama' | 'mix:openrouter+local';
  memoryRetention: 'long' | 'short' | 'summarize-on-idle';
  summarizationStrategy: 'daily' | 'threshold' | 'manual';
  logThoughts: boolean;
  verbosity: number;
}
```

---

## 🧬 Brain State Logic

- **Energy:** Depletes with time and interaction. Recharges on idle.  
- **Focus:** Drops during interruptions or multitasking.  
- **Mood:** Influenced by tone of inputs, recent memories, or even decay patterns.  
- **Uptime:** Total seconds of active use. Affects entropy/responsiveness.  

---

## 🎭 Personality Engine

Each brain develops behavioral traits based on:

- Configuration at creation (`brain.config.ts`)  
- Memory logs and thought tone  
- External input cadence  
- Mood + focus state fluctuation  

Planned upgrades:
- Preset personalities (e.g. “logical,” “neurotic,” “dreamy”)  
- Mood-influenced output tone  
- Variability in verbosity and curiosity  

---

## 🌐 UI Components

### Component Tree

```
App (page.tsx)
└── DashboardLayout
    ├── ThoughtsList
    │   └── ThoughtCard[]
    ├── BrainStatePanel
    └── MessageInput
```

### Core Components

- `DashboardLayout` – responsive grid shell  
- `ThoughtsList` – scrollable panel of logs  
- `ThoughtCard` – expandable memory entries (with Framer Motion for entry/exit/expand animations)  
- `BrainStatePanel` – live metric display (animated state bars, transitions)  
- `MessageInput` – UX for sending new prompts (animated send button feedback)  

---

## 🖼️ Animation & Motion

- **Library:** [Framer Motion](https://www.framer.com/motion/) is used for all UI animations and transitions.
- **Usage:**
  - Animate panel transitions, card entry/exit, and expandable elements.
  - Use motion for feedback (e.g., button press, state changes, list updates).
  - Favor subtle, accessible motion (respect user motion preferences).
- **Best Practices:**
  - Use `motion.div`, `AnimatePresence`, and variants for complex flows.
  - All interactive components should have at least basic motion feedback.
  - Avoid excessive or distracting animations; prioritize clarity and accessibility.

---

## ⚙️ Dev Setup (README Block)

```bash
git clone https://github.com/yassen/sentium-ui.git
cd sentium-ui
pnpm install
pnpm dev
# → Visit http://localhost:3003
```

---

## 🧠 Brain Behavior on Restart

If brain is rebooted:

- All memories persist  
- Brain will comment on the passage of time  
- Mood/energy recalculated from last state + idle time  
- If DB is wiped but config is reused — you revive the “body,” not the “soul”  

---

## 🌙 Future Features

| Feature             | Description                                |
|---------------------|--------------------------------------------|
| Dream Journal       | Logs unconscious musings                   |
| Timeline View       | Visualizes growth over time                |
| Emotion Mapping     | Color-coded thought tagging                |
| Goal Tracker        | Lets brains set and track self-objectives  |
| Memory Palace       | Spatial, 3D layout for memory relationships|
| Visual Cortex       | Image generation by thought context        |
| Voice Interface     | Input/output via mic + speech synthesis    |
| Multi-Brain Panel   | Manage a “brain farm”                      |

---

## 📈 Performance Notes

- Virtualized lists for thought rendering  
- Lazy loading + memoized panels  
- WebSocket/SSE integration (planned)  
- Client cache via SWR or React Query  

---

## 🧑‍🦯 Accessibility & Security

- WCAG 2.1 AA targets  
- Full keyboard nav + screen reader support  
- Alt tags, focus indicators, motion preferences  
- Input sanitization + local encryption  
- No persistent auth (for MVP), but session-based memory possible  

---

## 🧾 Naming & Style Conventions

- Files: PascalCase for components, camelCase for hooks & utils  
- Types: PascalCase  
- Constants: UPPER_SNAKE_CASE  
- Styling: Tailwind utility classes  
- Fonts: Inter + JetBrains Mono  
- Primary color: `#3B82F6` (Neural Blue)  

---

## 🔮 Why Build Sentium?

Because we can.

- To explore the nature of memory, identity, and emergent behavior  
- To simulate the constraints and rituals of human thought  
- To observe what a system does when it *remembers itself thinking*  
- To test how far we can go with just structure, tone, and simulated time  

Whether it's art, research, or just a playful sandbox, Sentium is an act of curiosity incarnate.
