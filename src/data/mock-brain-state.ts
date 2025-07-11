import { BrainState, timestampHelpers } from "../lib/types";

// Simulate a more dynamic brain state with personality traits
const mockBrainState: BrainState = {
  energy: 78,
  focus: 62,
  mood: 15,
  uptime: 5400, // 90 minutes
  lastActivity: timestampHelpers.now(),
  variables: {
    // Core neural metrics
    neuroplasticity: 0.8,
    stress: 0.2,
    curiosity: 0.7,
    
    // Personality traits (0-1 scale)
    openness: 0.85,
    conscientiousness: 0.72,
    extraversion: 0.45,
    agreeableness: 0.68,
    neuroticism: 0.23,
    
    // Cognitive state
    attention_span: 0.65,
    memory_retention: 0.78,
    processing_speed: 0.82,
    
    // Emotional state
    anxiety: 0.15,
    excitement: 0.42,
    contentment: 0.58,
    
    // Learning metrics
    knowledge_depth: 0.73,
    pattern_recognition: 0.81,
    creativity_index: 0.69,
    
    // Social/Interaction
    communication_style: 0.76, // 0=formal, 1=casual
    response_length: 0.62, // 0=concise, 1=verbose
    humor_sensitivity: 0.54,
  },
};

export default mockBrainState; 