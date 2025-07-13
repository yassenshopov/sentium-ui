# 🧠 Sentium UI - Digital Consciousness Dashboard

A modular, real-time interface for monitoring and interacting with an artificial brain. Sentium UI serves as a "neural dashboard" for observing thoughts, state variables, and emergent personality traits over time.

![Sentium UI](https://img.shields.io/badge/Status-MVP%20Complete-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC)

## ✨ Features

### 🎭 **13 Unique Brain Personalities**
- **Athena** - Curious explorer with deep analytical thinking
- **Marcus Aurelius** - Stoic philosopher with logical reasoning
- **Dionysus** - Chaotic creator with artistic expression
- **Hermes** - Neutral observer with balanced perspective
- **Hypnos** - Dreaming wanderer with philosophical musings
- **Daedalus** - Logical architect with systematic thinking
- **Aphrodite** - Emotional compass with empathetic understanding
- **Chaos** - Chaos theorist finding patterns in complexity
- **Helios** - Solar analyst illuminating complex problems
- **Boreas** - Frost mediator bringing calm and order
- **Vulcan** - Ember innovator forging disruptive ideas
- **Gaia** - Verdant empath fostering growth and harmony
- **Adonis** - Smoking cinephile with nostalgic contemplation

### 🧠 **Real-Time Brain Simulation**
- **Live State Monitoring** - Energy, focus, mood, and uptime tracking
- **Thought Generation** - Spontaneous internal monologue
- **Memory Formation** - Experience, fact, conversation, and insight storage
- **Personality Evolution** - Dynamic behavioral adaptation
- **Visual Cortex** - Generated visual content for thoughts

### 🎨 **Advanced UI Components**
- **Tabbed Interface** - Conversation, Memories, Thoughts, and System views
- **Real-time ECG Visualization** - Live brain activity monitoring
- **Multiple View Styles** - Streaming, neural, waveform, and card layouts
- **Keyboard Shortcuts** - Power user navigation and controls
- **Responsive Design** - Works on desktop, tablet, and mobile

### 🔧 **Technical Features**
- **Next.js 15** with App Router and Turbopack
- **TypeScript** for type safety
- **TailwindCSS v4** for styling
- **Framer Motion** for smooth animations
- **Shadcn/UI** components
- **Lucide React** icons

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/sentium-ui.git
cd sentium-ui

# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit [http://localhost:4321](http://localhost:4321) to see Sentium UI in action!

### Build for Production

```bash
npm run build
npm start
```

## 🎮 How to Use

### 1. **Explore Brains**
- Visit the main page to see the Sentium interface
- Click "Explore Brains" to browse available personalities
- Use filters to find brains by status, personality, or capabilities

### 2. **Connect to a Brain**
- Select any brain from the collection
- Click "Connect" to open the communication channel
- Watch as the brain introduces itself and begins thinking

### 3. **Interact and Observe**
- **Conversation Tab**: Chat directly with the brain
- **Memories Tab**: Browse stored experiences and knowledge
- **Thoughts Tab**: Watch real-time internal monologue
- **System Tab**: Monitor brain state and personality settings

### 4. **Keyboard Shortcuts**
Press `Ctrl/Cmd + H` to see all available shortcuts:
- `Ctrl/Cmd + 1-4`: Switch between tabs
- `Ctrl/Cmd + K`: Global search
- `Enter`: Send message
- `Escape`: Close dialogs

## 🏗️ Project Structure

```
sentium-ui/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Landing page
│   │   ├── brains/            # Brain selection and individual pages
│   │   └── KeyboardShortcuts.tsx
│   ├── components/
│   │   ├── dashboard/         # Brain monitoring components
│   │   ├── input/             # Chat and input components
│   │   ├── layout/            # Layout and navigation
│   │   └── ui/                # Reusable UI components
│   ├── data/                  # Mock data and brain configurations
│   ├── hooks/                 # Custom React hooks
│   └── lib/                   # Core logic and utilities
├── public/                    # Static assets
└── docs/                      # Documentation
```

## 🧠 Brain Simulation

Each brain in Sentium UI runs a sophisticated simulation that includes:

### **State Variables**
- **Energy**: Depletes with activity, recharges during idle time
- **Focus**: Affected by interruptions and multitasking
- **Mood**: Influenced by conversation tone and recent experiences
- **Uptime**: Total active time affecting responsiveness

### **Personality Traits**
- **Openness**: Curiosity and willingness to explore
- **Conscientiousness**: Systematic thinking and organization
- **Extraversion**: Social interaction and expressiveness
- **Agreeableness**: Empathy and cooperation
- **Neuroticism**: Emotional stability and stress response

### **Thought Generation**
Brains generate thoughts based on:
- Current state variables
- Personality traits
- Recent interactions
- Random creative impulses

## 🎨 Customization

### Adding New Brains
Edit `src/data/mock-brains.ts` to add new brain personalities:

```typescript
{
  id: "your-brain-id",
  name: "Your Brain Name",
  description: "Description of the brain's personality",
  personality: "curious" | "stoic" | "chaotic" | "neutral",
  color: "#HEXCODE",
  accentColor: "#HEXCODE",
  // ... other properties
}
```

### Modifying Brain Behavior
Adjust personality presets in `src/lib/brain-simulation.ts`:

```typescript
export const PERSONALITY_PRESETS = {
  your_personality: {
    openness: 0.8,
    conscientiousness: 0.7,
    // ... other traits
  }
};
```

## 🔮 Future Features

- [ ] **Dream Journal** - Unconscious thought logging
- [ ] **Timeline View** - Visual growth tracking over time
- [ ] **Emotion Mapping** - Color-coded thought tagging
- [ ] **Goal Tracker** - Brain self-objective management
- [ ] **Memory Palace** - Spatial memory visualization
- [ ] **Visual Cortex** - Image generation from thoughts
- [ ] **Voice Interface** - Speech input/output
- [ ] **Multi-Brain Panel** - Manage multiple brain instances
- [ ] **API Integration** - Connect to real LLM backends
- [ ] **Persistence** - Save brain states and memories

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** for the amazing React framework
- **TailwindCSS** for the utility-first CSS framework
- **Framer Motion** for smooth animations
- **Shadcn/UI** for beautiful components
- **Lucide** for the icon set

---

**Built with ❤️ for exploring the boundaries of artificial consciousness**

*"Because we can."*
