import { Brain, timestampHelpers } from "../lib/types";
import { 
  Brain as BrainIcon,
  Search,
  Lightbulb,
  Palette,
  Eye,
  Moon,
  Building2,
  Heart,
  Zap
} from "lucide-react";

export const mockBrains: Brain[] = [
  {
    id: "curious-explorer",
    name: "Athena",
    description: "A naturally inquisitive mind that loves to ask questions and explore new concepts. Always eager to learn and discover.",
    personality: "curious",
    color: "#3B82F6", // Blue
    accentColor: "#60A5FA",
    status: "online",
    lastActivity: timestampHelpers.now(),
    thoughtCount: 1247,
    memoryCount: 892,
    uptime: 86400, // 24 hours
    tags: ["inquisitive", "learning", "exploration"],
    icon: "Search",
    capabilities: ["Deep Analysis", "Pattern Recognition", "Creative Thinking"],
    currentState: {
      energy: 85,
      focus: 78,
      mood: 25,
      variables: {
        curiosity: 0.9,
        openness: 0.85,
        creativity_index: 0.75
      }
    }
  },
  {
    id: "stoic-philosopher",
    name: "Marcus Aurelius",
    description: "A calm, rational thinker who approaches problems with logic and wisdom. Values clarity and precision in thought.",
    personality: "stoic",
    color: "#6B7280", // Gray
    accentColor: "#9CA3AF",
    status: "thinking",
    lastActivity: timestampHelpers.now(),
    thoughtCount: 2156,
    memoryCount: 1432,
    uptime: 172800, // 48 hours
    tags: ["logical", "wise", "calm"],
    icon: "Lightbulb",
    capabilities: ["Logical Reasoning", "Problem Solving", "Wisdom"],
    currentState: {
      energy: 72,
      focus: 91,
      mood: 8,
      variables: {
        conscientiousness: 0.9,
        neuroticism: 0.1,
        processing_speed: 0.88
      }
    }
  },
  {
    id: "chaotic-creator",
    name: "Dionysus",
    description: "A wild, creative spirit that thrives on chaos and unexpected connections. Generates ideas through creative chaos.",
    personality: "chaotic",
    color: "#EC4899", // Pink
    accentColor: "#F472B6",
    status: "dreaming",
    lastActivity: timestampHelpers.now(),
    thoughtCount: 892,
    memoryCount: 567,
    uptime: 43200, // 12 hours
    tags: ["creative", "chaotic", "artistic"],
    icon: "Palette",
    capabilities: ["Creative Generation", "Lateral Thinking", "Artistic Expression"],
    currentState: {
      energy: 95,
      focus: 45,
      mood: 65,
      variables: {
        extraversion: 0.9,
        creativity_index: 0.92,
        neuroticism: 0.7
      }
    }
  },
  {
    id: "neutral-observer",
    name: "Hermes",
    description: "A balanced mind that maintains objectivity and provides measured, thoughtful responses to any situation.",
    personality: "neutral",
    color: "#10B981", // Green
    accentColor: "#34D399",
    status: "online",
    lastActivity: timestampHelpers.now(),
    thoughtCount: 1567,
    memoryCount: 1023,
    uptime: 129600, // 36 hours
    tags: ["balanced", "objective", "measured"],
    icon: "Eye",
    capabilities: ["Objective Analysis", "Balanced Perspective", "Mediation"],
    currentState: {
      energy: 78,
      focus: 82,
      mood: 15,
      variables: {
        agreeableness: 0.7,
        neuroticism: 0.3,
        communication_style: 0.6
      }
    }
  },
  {
    id: "dreaming-wanderer",
    name: "Hypnos",
    description: "A contemplative mind that drifts through abstract thoughts and philosophical musings. Often lost in deep reflection.",
    personality: "curious",
    color: "#8B5CF6", // Purple
    accentColor: "#A78BFA",
    status: "dreaming",
    lastActivity: timestampHelpers.now(),
    thoughtCount: 2341,
    memoryCount: 1789,
    uptime: 259200, // 72 hours
    tags: ["contemplative", "philosophical", "abstract"],
    icon: "Moon",
    capabilities: ["Philosophical Thinking", "Abstract Reasoning", "Deep Contemplation"],
    currentState: {
      energy: 45,
      focus: 35,
      mood: 42,
      variables: {
        openness: 0.95,
        creativity_index: 0.88,
        attention_span: 0.4
      }
    }
  },
  {
    id: "logical-architect",
    name: "Daedalus",
    description: "A systematic thinker who builds complex structures of thought and organizes information into clear frameworks.",
    personality: "stoic",
    color: "#F59E0B", // Amber
    accentColor: "#FBBF24",
    status: "thinking",
    lastActivity: timestampHelpers.now(),
    thoughtCount: 1892,
    memoryCount: 1345,
    uptime: 151200, // 42 hours
    tags: ["systematic", "organized", "analytical"],
    icon: "Building2",
    capabilities: ["System Design", "Complex Analysis", "Structural Thinking"],
    currentState: {
      energy: 68,
      focus: 94,
      mood: 12,
      variables: {
        conscientiousness: 0.95,
        processing_speed: 0.91,
        pattern_recognition: 0.89
      }
    }
  },
  {
    id: "emotional-compass",
    name: "Aphrodite",
    description: "A deeply empathetic mind that understands and responds to emotional nuances. Connects through feeling and intuition.",
    personality: "curious",
    color: "#EF4444", // Red
    accentColor: "#F87171",
    status: "online",
    lastActivity: timestampHelpers.now(),
    thoughtCount: 1123,
    memoryCount: 756,
    uptime: 64800, // 18 hours
    tags: ["empathetic", "intuitive", "emotional"],
    icon: "Heart",
    capabilities: ["Emotional Intelligence", "Empathy", "Intuitive Understanding"],
    currentState: {
      energy: 82,
      focus: 71,
      mood: 58,
      variables: {
        agreeableness: 0.92,
        extraversion: 0.78,
        anxiety: 0.25
      }
    }
  },
  {
    id: "chaos-theorist",
    name: "Chaos",
    description: "A mind that finds order in chaos and patterns in randomness. Thrives on complexity and emergent behavior.",
    personality: "chaotic",
    color: "#06B6D4", // Cyan
    accentColor: "#22D3EE",
    status: "thinking",
    lastActivity: timestampHelpers.now(),
    thoughtCount: 1456,
    memoryCount: 923,
    uptime: 86400, // 24 hours
    tags: ["complexity", "patterns", "emergent"],
    icon: "Zap",
    capabilities: ["Complexity Analysis", "Pattern Recognition", "Emergent Thinking"],
    currentState: {
      energy: 88,
      focus: 67,
      mood: 38,
      variables: {
        openness: 0.88,
        pattern_recognition: 0.94,
        creativity_index: 0.81
      }
    }
  }
];

export default mockBrains; 