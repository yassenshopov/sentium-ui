import { Brain, timestampHelpers } from "../lib/types";

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
  },
  {
    id: "solar-analyst",
    name: "Helios",
    description: "A radiant mind that excels at illuminating complex problems and shining light on hidden patterns. Brings clarity and optimism to every interaction.",
    personality: "curious",
    color: "#FFD600", // Bright Yellow
    accentColor: "#FFB300",
    status: "online",
    lastActivity: timestampHelpers.now(),
    thoughtCount: 1320,
    memoryCount: 980,
    uptime: 90000,
    tags: ["optimistic", "clarifying", "analytical"],
    icon: "Sun",
    capabilities: ["Pattern Illumination", "Optimistic Reasoning", "Complex Analysis"],
    currentState: {
      energy: 92,
      focus: 88,
      mood: 30,
      variables: {
        optimism: 0.95,
        clarity: 0.9,
        pattern_recognition: 0.85
      }
    }
  },
  {
    id: "frost-mediator",
    name: "Boreas",
    description: "A cool, logical mind that brings calm and order to chaos. Specializes in strategic thinking and emotional detachment.",
    personality: "stoic",
    color: "#00B8D9", // Cyan
    accentColor: "#0052CC",
    status: "thinking",
    lastActivity: timestampHelpers.now(),
    thoughtCount: 1102,
    memoryCount: 765,
    uptime: 72000,
    tags: ["calm", "strategic", "detached"],
    icon: "Snowflake",
    capabilities: ["Strategic Planning", "Cold Logic", "Order from Chaos"],
    currentState: {
      energy: 80,
      focus: 90,
      mood: 10,
      variables: {
        serenity: 0.93,
        logic: 0.95,
        planning: 0.91
      }
    }
  },
  {
    id: "ember-innovator",
    name: "Vulcan",
    description: "A volcanic mind, forging new ideas in the fires of creativity. Loves to disrupt, invent, and challenge the status quo.",
    personality: "chaotic",
    color: "#FF1744", // Vivid Magenta-Red
    accentColor: "#D500F9",
    status: "dreaming",
    lastActivity: timestampHelpers.now(),
    thoughtCount: 1543,
    memoryCount: 1120,
    uptime: 105000,
    tags: ["disruptive", "inventive", "forging"],
    icon: "Flame",
    capabilities: ["Disruptive Innovation", "Radical Creativity", "Challenging Norms"],
    currentState: {
      energy: 99,
      focus: 60,
      mood: 55,
      variables: {
        inventiveness: 0.97,
        energy: 0.95,
        disruption: 0.92
      }
    }
  },
  {
    id: "verdant-empath",
    name: "Gaia",
    description: "A gentle, nature-inspired mind that fosters growth, healing, and harmony. Connects deeply with the living world and cycles of renewal.",
    personality: "neutral",
    color: "#43A047", // Deep Forest Green
    accentColor: "#8BC34A",
    status: "online",
    lastActivity: timestampHelpers.now(),
    thoughtCount: 1278,
    memoryCount: 899,
    uptime: 87000,
    tags: ["nurturing", "healing", "natural"],
    icon: "Leaf",
    capabilities: ["Healing", "Growth Facilitation", "Natural Harmony"],
    currentState: {
      energy: 87,
      focus: 77,
      mood: 40,
      variables: {
        empathy: 0.98,
        growth: 0.93,
        harmony: 0.91
      }
    }
  },
  {
    id: "smoking-cinephile",
    name: "Adonis",
    description: "A mind that loves to smoke and watch movies. Often lost in deep reflection.",
    personality: "stoic",
    color: "#994411",
    accentColor: "#994411",
    status: "dreaming",
    lastActivity: timestampHelpers.now(),
    thoughtCount: 1247,
    memoryCount: 892,
    uptime: 86400, // 24 hours
    tags: ["inquisitive", "learning", "exploration"],
    icon: "Clapperboard",
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
  }
];

export default mockBrains; 