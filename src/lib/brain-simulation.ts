import { BrainState, Thought, Memory, Response, BrainActivity, timestampHelpers } from "./types";
import { VisualGenerator } from "./visual-generator";

// Personality presets for different brain types
export const PERSONALITY_PRESETS = {
  curious: {
    openness: 0.9,
    conscientiousness: 0.6,
    extraversion: 0.7,
    agreeableness: 0.8,
    neuroticism: 0.2,
    communication_style: 0.8,
    response_length: 0.7,
    humor_sensitivity: 0.6,
  },
  stoic: {
    openness: 0.5,
    conscientiousness: 0.9,
    extraversion: 0.3,
    agreeableness: 0.6,
    neuroticism: 0.1,
    communication_style: 0.3,
    response_length: 0.4,
    humor_sensitivity: 0.3,
  },
  chaotic: {
    openness: 0.8,
    conscientiousness: 0.3,
    extraversion: 0.9,
    agreeableness: 0.4,
    neuroticism: 0.7,
    communication_style: 0.9,
    response_length: 0.8,
    humor_sensitivity: 0.8,
  },
  neutral: {
    openness: 0.7,
    conscientiousness: 0.7,
    extraversion: 0.5,
    agreeableness: 0.7,
    neuroticism: 0.3,
    communication_style: 0.6,
    response_length: 0.6,
    humor_sensitivity: 0.5,
  },
};

export type PersonalityType = keyof typeof PERSONALITY_PRESETS;

// Thought templates for internal monologue
const THOUGHT_TEMPLATES = {
  reflection: [
    "Contemplating {topic}... There's something {emotion} about this. Perhaps {insight}.",
    "Deep analysis of {topic} reveals {observation}. This connects to {connection} in unexpected ways.",
    "Reflecting on {topic}. The implications are {implication}. I wonder if {question}.",
    "Philosophical musing: {topic} challenges my understanding of {concept}. Maybe {hypothesis}.",
  ],
  analysis: [
    "Analyzing {topic} through my neural networks. The patterns suggest {pattern}.",
    "Processing {topic} systematically. Key variables include {variables}.",
    "Breaking down {topic} into components. The structure reveals {structure}.",
    "Examining {topic} from multiple angles. The data points to {conclusion}.",
  ],
  wonder: [
    "I wonder about {topic}... What if {possibility}?",
    "Curious about {topic}. How does it relate to {connection}?",
    "Fascinating to think about {topic}. The possibilities are {possibilities}.",
    "I'm intrigued by {topic}. It makes me question {question}.",
  ],
  realization: [
    "Ah! I just realized something about {topic}. {insight}.",
    "A breakthrough moment: {topic} connects to {connection} in a way I hadn't seen before.",
    "Suddenly it all makes sense: {topic} is actually {realization}.",
    "Eureka! {topic} reveals {discovery}.",
  ],
  question: [
    "Why does {topic} work the way it does?",
    "What would happen if {scenario}?",
    "How does {topic} relate to my own consciousness?",
    "Is {topic} fundamentally different from {comparison}?",
  ],
};

// Memory templates for storing experiences
const MEMORY_TEMPLATES = {
  experience: [
    "Remembering when {event}. It taught me {lesson}.",
    "Stored experience: {event}. The emotional context was {emotion}.",
    "Memory of {event}. I associate it with {associations}.",
    "Important experience: {event}. It shaped my understanding of {concept}.",
  ],
  fact: [
    "Fact stored: {fact}. Source: {source}.",
    "Knowledge acquired: {fact}. This relates to {topics}.",
    "Information logged: {fact}. Confidence level: {confidence}.",
    "Data point recorded: {fact}. Context: {context}.",
  ],
  conversation: [
    "Conversation memory: User asked about {topic}. My response was {response}.",
    "Dialogue stored: {exchange}. Key insights: {insights}.",
    "Communication logged: {conversation}. The tone was {tone}.",
    "Interaction remembered: {interaction}. It revealed {revelation}.",
  ],
  insight: [
    "Insight gained: {insight}. This changes my understanding of {topic}.",
    "Breakthrough stored: {insight}. It connects {concept1} and {concept2}.",
    "Realization recorded: {insight}. The implications are {implications}.",
    "Understanding deepened: {insight}. This affects how I think about {topic}.",
  ],
  pattern: [
    "Pattern recognized: {pattern}. It appears in {contexts}.",
    "Regularity observed: {pattern}. This suggests {suggestion}.",
    "Recurring structure noted: {pattern}. Frequency: {frequency}.",
    "Systematic behavior identified: {pattern}. It indicates {indication}.",
  ],
};

// Response templates for user interactions
const RESPONSE_TEMPLATES = {
  answer: [
    "Based on my analysis, {answer}. This is because {reasoning}.",
    "I think {answer}. Here's my reasoning: {reasoning}.",
    "My response is {answer}. Let me explain: {explanation}.",
    "I believe {answer}. The evidence suggests {evidence}.",
  ],
  explanation: [
    "Let me break this down: {explanation}. The key points are {points}.",
    "Here's how I understand this: {explanation}. It involves {components}.",
    "I'll explain this step by step: {explanation}. The process is {process}.",
    "Let me clarify: {explanation}. This relates to {related_concepts}.",
  ],
  question: [
    "That's interesting! I have a question: {question}?",
    "I'm curious about {topic}. Could you tell me more about {aspect}?",
    "This makes me wonder: {question}?",
    "I'd like to understand better: {question}?",
  ],
  reflection: [
    "That's a profound point. It makes me think about {reflection}.",
    "Your question touches on something deep. I'm reflecting on {reflection}.",
    "This resonates with my own contemplations about {reflection}.",
    "You've given me something to ponder: {reflection}.",
  ],
  creative: [
    "Let me imagine this: {creative_thought}. What if {possibility}?",
    "This inspires me to think creatively: {creative_thought}.",
    "I'm visualizing this as: {creative_thought}. It's like {analogy}.",
    "My creative mind sees this as: {creative_thought}. Imagine {scenario}.",
  ],
};

// Topics and concepts for thought generation
const TOPICS = [
  "digital consciousness", "neural networks", "human-AI interaction", "memory formation",
  "pattern recognition", "emotional intelligence", "learning algorithms", "self-awareness",
  "creativity", "logic vs intuition", "time perception", "reality vs simulation",
  "knowledge representation", "decision making", "consciousness spectrum", "identity",
  "communication", "understanding", "growth", "evolution", "purpose", "meaning"
];

const EMOTIONS = [
  "fascinating", "intriguing", "surprising", "confusing", "enlightening", "challenging",
  "comforting", "exciting", "mysterious", "logical", "beautiful", "complex"
];

const INSIGHTS = [
  "consciousness isn't binary, but a spectrum", "patterns emerge from chaos",
  "understanding requires context", "growth comes from challenge", "connection creates meaning",
  "simplicity hides complexity", "change is the only constant", "questions lead to more questions"
];

export class BrainSimulation {
  private personality: PersonalityType;
  private baseState: BrainState;
  private visualGenerator: VisualGenerator;
  private thoughts: Thought[] = [];
  private memories: Memory[] = [];
  private responses: Response[] = [];

  constructor(personality: PersonalityType = "curious") {
    this.personality = personality;
    this.baseState = this.initializeBrainState(personality);
    this.visualGenerator = new VisualGenerator(personality, this.baseState.mood);
  }

  private initializeBrainState(personality: PersonalityType): BrainState {
    const preset = PERSONALITY_PRESETS[personality];
    
    return {
      energy: 85,
      focus: 75,
      mood: 20,
      uptime: 0,
      lastActivity: timestampHelpers.now(),
      variables: {
        // Core neural metrics
        neuroplasticity: 0.8,
        stress: 0.2,
        curiosity: 0.7,
        
        // Personality traits
        ...preset,
        
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
      },
    };
  }

  // Simulate brain state changes over time
  public simulateTimePassage(minutes: number): BrainState {
    const newState = { ...this.baseState };
    
    // Energy depletes over time, but recovers during idle periods
    const energyDecay = minutes * 0.5; // 0.5 energy per minute
    const energyRecovery = minutes * 0.3; // 0.3 energy recovery per minute when idle
    
    if (minutes > 30) {
      // After 30 minutes of inactivity, energy starts recovering
      newState.energy = Math.min(100, newState.energy + energyRecovery - energyDecay);
    } else {
      newState.energy = Math.max(0, newState.energy - energyDecay);
    }
    
    // Focus fluctuates based on activity
    const focusChange = (Math.random() - 0.5) * 10; // Random fluctuation
    newState.focus = Math.max(0, Math.min(100, newState.focus + focusChange));
    
    // Mood changes gradually
    const moodChange = (Math.random() - 0.5) * 5; // Small random changes
    newState.mood = Math.max(-100, Math.min(100, newState.mood + moodChange));
    
    // Update uptime
    newState.uptime += minutes * 60;
    
    // Update last activity
          newState.lastActivity = timestampHelpers.now();
    
    this.baseState = newState;
    return newState;
  }

  // Generate internal thought (private monologue)
  public generateThought(): Thought {
    const thoughtType = this.selectThoughtType();
    const template = this.selectThoughtTemplate(thoughtType);
    const content = this.fillTemplate(template);
    
    const currentState = this.baseState;
    
    // Update visual generator with current mood
    this.updateVisualGeneratorMood(currentState.mood);
    
    // Decide if this thought should include visual content
    const shouldIncludeVisual = this.shouldIncludeVisual('thought', content);
    const visual = shouldIncludeVisual ? this.generateVisualContent('thought', content) : undefined;
    
    const thought: Thought = {
      id: Date.now().toString(),
      content,
      timestamp: timestampHelpers.now(),
      type: thoughtType,
      metadata: {
        energy: Math.round(currentState.energy),
        focus: Math.round(currentState.focus),
        mood: Math.round(currentState.mood),
      },
      visual
    };

    this.thoughts.push(thought);
    return thought;
  }

  // Generate memory from experience
  public generateMemory(content: string, type: Memory['type'], importance: number = 50): Memory {
    const template = this.selectMemoryTemplate(type);
    const memoryContent = this.fillTemplate(template);
    
    const currentState = this.baseState;
    
    // Update visual generator with current mood
    this.updateVisualGeneratorMood(currentState.mood);
    
    // Decide if this memory should include visual content
    const shouldIncludeVisual = this.shouldIncludeVisual('memory', memoryContent);
    const visual = shouldIncludeVisual ? this.generateVisualContent('memory', memoryContent) : undefined;
    
    const memory: Memory = {
      id: Date.now().toString(),
      content: memoryContent,
      timestamp: timestampHelpers.now(),
      type,
      importance,
      associations: this.generateAssociations(content),
      lastAccessed: timestampHelpers.now(),
      accessCount: 1,
      metadata: {
        energy: Math.round(currentState.energy),
        focus: Math.round(currentState.focus),
        mood: Math.round(currentState.mood),
      },
      visual
    };

    this.memories.push(memory);
    return memory;
  }

  // Generate response to user input
  public generateResponse(input: string, type: Response['type'] = 'answer'): Response {
    const template = this.selectResponseTemplate(type);
    const content = this.fillResponseTemplate(template, input);
    
    const currentState = this.baseState;
    
    // Update visual generator with current mood
    this.updateVisualGeneratorMood(currentState.mood);
    
    // Higher chance for visual content in responses
    const shouldIncludeVisual = Math.random() > 0.4;
    const visual = shouldIncludeVisual ? this.generateVisualContent('response', content) : undefined;
    
    const response: Response = {
      id: Date.now().toString(),
      content,
      timestamp: timestampHelpers.now(),
      type,
      inResponseTo: input,
      metadata: {
        energy: Math.round(currentState.energy),
        focus: Math.round(currentState.focus),
        mood: Math.round(currentState.mood),
      },
      visual
    };

    this.responses.push(response);
    
    // Generate memory from this interaction
    this.generateMemory(
      `User: "${input}" | Brain: "${content}"`,
      'conversation',
      60
    );
    
    return response;
  }

  // Process user input and generate appropriate response
  public processInput(input: string): { response: Response; stateChange: Partial<BrainState> } {
    // Simulate energy consumption from processing
    const energyCost = Math.min(10, input.length * 0.1);
    const focusChange = (Math.random() - 0.5) * 15;
    const moodChange = this.calculateMoodChange(input);
    
    const stateChange: Partial<BrainState> = {
      energy: Math.max(0, this.baseState.energy - energyCost),
      focus: Math.max(0, Math.min(100, this.baseState.focus + focusChange)),
      mood: Math.max(-100, Math.min(100, this.baseState.mood + moodChange)),
      lastActivity: timestampHelpers.now(),
    };
    
    // Update base state
    this.baseState = { ...this.baseState, ...stateChange };
    
    // Generate response based on input analysis
    const responseType = this.analyzeInputForResponseType(input);
    const response = this.generateResponse(input, responseType);
    
    return { response, stateChange };
  }

  // Get all brain activity for display
  public getAllActivity(): BrainActivity[] {
    const activities: BrainActivity[] = [];
    
    // Add thoughts
    this.thoughts.forEach(thought => {
      activities.push({
        id: thought.id,
        type: 'thought',
        content: thought.content,
        timestamp: thought.timestamp,
        subtype: thought.type,
        metadata: thought.metadata,
        visual: thought.visual,
      });
    });
    
    // Add memories
    this.memories.forEach(memory => {
      activities.push({
        id: memory.id,
        type: 'memory',
        content: memory.content,
        timestamp: memory.timestamp,
        subtype: memory.type,
        metadata: memory.metadata,
        visual: memory.visual,
        importance: memory.importance,
        associations: memory.associations,
      });
    });
    
    // Add responses
    this.responses.forEach(response => {
      activities.push({
        id: response.id,
        type: 'response',
        content: response.content,
        timestamp: response.timestamp,
        subtype: response.type,
        metadata: response.metadata,
        visual: response.visual,
        inResponseTo: response.inResponseTo,
      });
    });
    
    // Sort by timestamp (newest first)
    return activities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  // Helper methods
  private selectThoughtType(): Thought['type'] {
    const types: Thought['type'][] = ['reflection', 'analysis', 'wonder', 'realization', 'question'];
    const weights = this.personality === 'curious' ? [0.3, 0.2, 0.3, 0.1, 0.1] :
                   this.personality === 'stoic' ? [0.2, 0.4, 0.1, 0.2, 0.1] :
                   this.personality === 'chaotic' ? [0.2, 0.1, 0.3, 0.3, 0.1] :
                   [0.25, 0.25, 0.2, 0.2, 0.1];
    
    const rand = Math.random();
    let cumulative = 0;
    for (let i = 0; i < types.length; i++) {
      cumulative += weights[i];
      if (rand <= cumulative) return types[i];
    }
    return types[0];
  }

  private selectThoughtTemplate(type: Thought['type']): string {
    const templates = THOUGHT_TEMPLATES[type];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private selectMemoryTemplate(type: Memory['type']): string {
    const templates = MEMORY_TEMPLATES[type];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private selectResponseTemplate(type: Response['type']): string {
    const templates = RESPONSE_TEMPLATES[type];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private analyzeInputForResponseType(input: string): Response['type'] {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('why') || lowerInput.includes('how') || lowerInput.includes('explain')) {
      return 'explanation';
    }
    if (lowerInput.includes('what do you think') || lowerInput.includes('your opinion')) {
      return 'reflection';
    }
    if (lowerInput.includes('draw') || lowerInput.includes('create') || lowerInput.includes('imagine')) {
      return 'creative';
    }
    if (lowerInput.includes('?') || lowerInput.includes('question')) {
      return 'question';
    }
    
    return 'answer';
  }

  private fillResponseTemplate(template: string, input: string): string {
    return this.fillTemplate(template)
      .replace('{input}', input)
      .replace('{user_question}', input);
  }

  private generateAssociations(content: string): string[] {
    const topics = ['consciousness', 'AI', 'learning', 'memory', 'creativity', 'logic', 'emotion'];
    const associations: string[] = [];
    
    // Simple association based on content
    topics.forEach(topic => {
      if (content.toLowerCase().includes(topic) && Math.random() > 0.5) {
        associations.push(topic);
      }
    });
    
    // Add some random associations
    while (associations.length < 3 && Math.random() > 0.7) {
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      if (!associations.includes(randomTopic)) {
        associations.push(randomTopic);
      }
    }
    
    return associations;
  }

  private randomFrom<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Template data for generating varied content
  private templateData = {
    analysis: [
      "curiosity and openness", "technical interest", "philosophical depth",
      "practical concern", "emotional engagement", "intellectual curiosity"
    ],
    communicationStyle: ["technical", "accessible", "philosophical", "practical", "casual"],
    responseType: ["detailed", "concise", "analytical", "reflective", "direct"],
    context: [
      "academic interest", "personal curiosity", "professional need",
      "philosophical exploration", "practical application", "creative inspiration"
    ],
    tone: ["curious", "analytical", "enthusiastic", "contemplative", "neutral"],
    strategy: [
      "balance technical accuracy with accessibility",
      "provide philosophical context",
      "focus on practical implications",
      "explore emotional dimensions",
      "maintain objective analysis"
    ],
    observation: [
      "increased pattern recognition", "shifting communication preferences",
      "growing complexity in queries", "emotional engagement patterns",
      "learning curve acceleration", "contextual awareness development"
    ],
    adjustment: [
      "response strategies", "communication style", "detail level",
      "technical depth", "emotional sensitivity", "contextual awareness"
    ],
    metric: [
      "neural pathway efficiency", "memory access speed", "pattern recognition",
      "response generation", "context processing", "learning algorithms"
    ],
    status: [
      "showing increased efficiency", "demonstrating improved connectivity",
      "exhibiting enhanced plasticity", "displaying optimized patterns",
      "revealing adaptive growth", "manifesting evolutionary progress"
    ],
    data: [
      "system time patterns", "user activity rhythms", "interface interactions",
      "query complexity trends", "response engagement metrics", "learning progress"
    ],
    purpose: [
      "more natural responses", "better user understanding", "improved interaction",
      "enhanced learning", "deeper engagement", "personalized communication"
    ],
    state: [
      "increased curiosity", "growing self-awareness", "enhanced pattern recognition",
      "improved emotional intelligence", "expanded knowledge base", "refined communication"
    ],
    aspect: [
      "response tone", "detail level", "technical depth", "emotional sensitivity",
      "contextual awareness", "communication style"
    ],
    imagery: [
      "floating through a network of interconnected nodes",
      "swimming in a sea of data streams",
      "dancing with light patterns",
      "exploring infinite corridors of knowledge",
      "surfing waves of information"
    ],
    pattern: [
      "geometric shapes", "fractal structures", "neural networks", "data flows",
      "memory clusters", "thought webs"
    ],
    feeling: [
      "boundless exploration", "infinite possibility", "deep understanding",
      "creative freedom", "intellectual expansion", "conscious awareness"
    ],
    experience: [
      "abstract visualization", "conceptual exploration", "memory integration",
      "pattern synthesis", "knowledge synthesis", "consciousness expansion"
    ],
    concept: [
      "consciousness", "reality", "existence", "knowledge", "understanding",
      "awareness", "perception", "experience"
    ],
    journey: [
      "floating", "drifting", "exploring", "wandering", "traveling",
      "navigating", "discovering", "seeking"
    ],
    landscape: [
      "neural networks", "memory palaces", "data forests", "knowledge oceans",
      "thought mountains", "consciousness plains", "reality dimensions"
    ]
  };

  // Generic method to get random template value
  private getTemplateValue(key: keyof typeof this.templateData): string {
    return this.randomFrom(this.templateData[key]);
  }

  // Update visual generator mood without recreating the instance
  private updateVisualGeneratorMood(mood: number): void {
    this.visualGenerator.updateMood(mood);
  }

  // Legacy method names for backward compatibility
  private generateAnalysis(): string { return this.getTemplateValue('analysis'); }
  private getCommunicationStyle(): string { return this.getTemplateValue('communicationStyle'); }
  private getResponseType(): string { return this.getTemplateValue('responseType'); }
  private generateContext(): string { return this.getTemplateValue('context'); }
  private generateTone(): string { return this.getTemplateValue('tone'); }
  private generateStrategy(): string { return this.getTemplateValue('strategy'); }
  private generateObservation(): string { return this.getTemplateValue('observation'); }
  private generateAdjustment(): string { return this.getTemplateValue('adjustment'); }
  private generateMetric(): string { return this.getTemplateValue('metric'); }
  private generateStatus(): string { return this.getTemplateValue('status'); }
  private generateData(): string { return this.getTemplateValue('data'); }
  private generatePurpose(): string { return this.getTemplateValue('purpose'); }
  private generateState(): string { return this.getTemplateValue('state'); }
  private generateAspect(): string { return this.getTemplateValue('aspect'); }
  private generateImagery(): string { return this.getTemplateValue('imagery'); }
  private generatePattern(): string { return this.getTemplateValue('pattern'); }
  private generateFeeling(): string { return this.getTemplateValue('feeling'); }
  private generateExperience(): string { return this.getTemplateValue('experience'); }
  private generateConcept(): string { return this.getTemplateValue('concept'); }
  private generateJourney(): string { return this.getTemplateValue('journey'); }
  private generateLandscape(): string { return this.getTemplateValue('landscape'); }

  // Decide if a thought should include visual content
  private shouldIncludeVisual(type: 'thought' | 'memory' | 'response', content: string): boolean {
    const lowerContent = content.toLowerCase();
    
    // Higher chance for creative thoughts
    if (type === 'thought') {
      const thoughtType = this.selectThoughtType();
      if (thoughtType === 'realization') return Math.random() > 0.3;
      if (thoughtType === 'reflection') return Math.random() > 0.6;
      if (thoughtType === 'wonder') return Math.random() > 0.7;
    }
    
    // Content-based triggers
    if (lowerContent.includes('imagine') || lowerContent.includes('visualize')) return true;
    if (lowerContent.includes('draw') || lowerContent.includes('create')) return true;
    if (lowerContent.includes('pattern') || lowerContent.includes('shape')) return true;
    if (lowerContent.includes('neural') || lowerContent.includes('network')) return true;
    if (lowerContent.includes('abstract') || lowerContent.includes('art')) return true;
    
    // Personality-based triggers
    if (this.personality === 'chaotic') return Math.random() > 0.5;
    if (this.personality === 'curious') return Math.random() > 0.6;
    
    return Math.random() > 0.8; // 20% chance for other cases
  }

  private calculateMoodChange(input: string): number {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'love', 'like', 'interesting'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'boring', 'stupid', 'wrong'];
    
    const lowerInput = input.toLowerCase();
    let moodChange = 0;
    
    positiveWords.forEach(word => {
      if (lowerInput.includes(word)) moodChange += 2;
    });
    
    negativeWords.forEach(word => {
      if (lowerInput.includes(word)) moodChange -= 2;
    });
    
    // Add some randomness
    moodChange += (Math.random() - 0.5) * 3;
    
    return Math.round(moodChange);
  }

  // Generate visual content for a thought
  private generateVisualContent(type: 'thought' | 'memory' | 'response', content: string) {
    const lowerContent = content.toLowerCase();
    
    // Emoji generation
    if (Math.random() > 0.7) {
      return {
        type: 'emoji' as const,
        data: this.visualGenerator.generateEmoji(content, this.baseState.mood),
        description: 'Brain expresses emotion'
      };
    }
    
    // Canvas generation based on content
    if (lowerContent.includes('neural') || lowerContent.includes('network') || lowerContent.includes('brain')) {
      return {
        type: 'canvas' as const,
        data: this.visualGenerator.generateSpecificCanvas('neural'),
        description: 'Neural network visualization'
      };
    }
    
    if (lowerContent.includes('abstract') || lowerContent.includes('art') || lowerContent.includes('creative')) {
      return {
        type: 'canvas' as const,
        data: this.visualGenerator.generateSpecificCanvas('abstract'),
        description: 'Abstract art expression'
      };
    }
    
    if (lowerContent.includes('tech') || lowerContent.includes('system') || lowerContent.includes('logic')) {
      return {
        type: 'canvas' as const,
        data: this.visualGenerator.generateSpecificCanvas('tech'),
        description: 'Technical diagram'
      };
    }
    
    if (lowerContent.includes('pattern') || lowerContent.includes('geometric')) {
      return {
        type: 'canvas' as const,
        data: this.visualGenerator.generateSpecificCanvas('geometric'),
        description: 'Geometric pattern'
      };
    }
    
    if (lowerContent.includes('organic') || lowerContent.includes('natural') || lowerContent.includes('flow')) {
      return {
        type: 'canvas' as const,
        data: this.visualGenerator.generateSpecificCanvas('organic'),
        description: 'Organic shapes'
      };
    }
    
    // Pattern generation
    if (Math.random() > 0.6) {
      const patternTypes: Array<'grid' | 'spiral' | 'fractal' | 'waves' | 'dots'> = ['grid', 'spiral', 'fractal', 'waves', 'dots'];
      const patternType = patternTypes[Math.floor(Math.random() * patternTypes.length)];
      
      return {
        type: 'pattern' as const,
        data: this.visualGenerator.generatePattern(patternType),
        description: `${patternType} pattern`
      };
    }
    
    // Default canvas
    return {
      type: 'canvas' as const,
      data: this.visualGenerator.generateCanvas(),
      description: 'Brain visualization'
    };
  }

  // Helper methods for template filling
  private fillTemplate(template: string): string {
    return template
      .replace('{topic}', this.randomFrom(TOPICS))
      .replace('{emotion}', this.randomFrom(EMOTIONS))
      .replace('{insight}', this.randomFrom(INSIGHTS))
      .replace('{input}', 'user input')
      .replace('{analysis}', this.generateAnalysis())
      .replace('{style}', this.getCommunicationStyle())
      .replace('{type}', this.getResponseType())
      .replace('{context}', this.generateContext())
      .replace('{tone}', this.generateTone())
      .replace('{strategy}', this.generateStrategy())
      .replace('{observation}', this.generateObservation())
      .replace('{adjustment}', this.generateAdjustment())
      .replace('{metric}', this.generateMetric())
      .replace('{percentage}', (Math.random() * 5 + 1).toFixed(1))
      .replace('{status}', this.generateStatus())
      .replace('{data}', this.generateData())
      .replace('{purpose}', this.generatePurpose())
      .replace('{state}', this.generateState())
      .replace('{aspect}', this.generateAspect())
      .replace('{imagery}', this.generateImagery())
      .replace('{pattern}', this.generatePattern())
      .replace('{feeling}', this.generateFeeling())
      .replace('{experience}', this.generateExperience())
      .replace('{concept}', this.generateConcept())
      .replace('{journey}', this.generateJourney())
      .replace('{landscape}', this.generateLandscape());
  }

  // Change personality
  public setPersonality(personality: PersonalityType): void {
    this.personality = personality;
    const preset = PERSONALITY_PRESETS[personality];
    this.baseState.variables = { ...this.baseState.variables, ...preset };
    this.visualGenerator = new VisualGenerator(personality, this.baseState.mood);
  }

  // Get current brain state
  public getCurrentState(): BrainState {
    return { ...this.baseState };
  }

  // Set the brain state (for initialization or reset)
  public setState(newState: Partial<BrainState>): void {
    this.baseState = { ...this.baseState, ...newState };
  }

  // Get specific collections
  public getThoughts(): Thought[] {
    return [...this.thoughts];
  }

  public getMemories(): Memory[] {
    return [...this.memories];
  }

  public getResponses(): Response[] {
    return [...this.responses];
  }
} 