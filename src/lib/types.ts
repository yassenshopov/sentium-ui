// Core data types for Sentium UI

// Internal monologue - the brain's private thoughts
export interface Thought {
  id: string;
  content: string;
  timestamp: Date | string;
  type: 'reflection' | 'analysis' | 'wonder' | 'realization' | 'question';
  metadata?: {
    energy?: number;
    focus?: number;
    mood?: number;
  };
  visual?: {
    type: 'emoji' | 'canvas' | 'pattern' | 'diagram';
    data: string | CanvasData | PatternData;
    description?: string;
  };
}

// Memory - stored experiences and information
export interface Memory {
  id: string;
  content: string;
  timestamp: Date | string;
  type: 'experience' | 'fact' | 'conversation' | 'insight' | 'pattern';
  importance: number; // 0-100, how important this memory is
  associations: string[]; // related concepts/topics
  lastAccessed: Date | string;
  accessCount: number;
  metadata?: {
    energy?: number;
    focus?: number;
    mood?: number;
  };
  visual?: {
    type: 'emoji' | 'canvas' | 'pattern' | 'diagram';
    data: string | CanvasData | PatternData;
    description?: string;
  };
}

// Response - direct answers to user input
export interface Response {
  id: string;
  content: string;
  timestamp: Date | string;
  type: 'answer' | 'explanation' | 'question' | 'reflection' | 'creative';
  inResponseTo: string; // what the user said
  metadata?: {
    energy?: number;
    focus?: number;
    mood?: number;
  };
  visual?: {
    type: 'emoji' | 'canvas' | 'pattern' | 'diagram';
    data: string | CanvasData | PatternData;
    description?: string;
  };
}

// Unified interface for display purposes
export interface BrainActivity {
  id: string;
  type: 'thought' | 'memory' | 'response';
  content: string;
  timestamp: Date | string;
  subtype: string;
  metadata?: {
    energy?: number;
    focus?: number;
    mood?: number;
  };
  visual?: {
    type: 'emoji' | 'canvas' | 'pattern' | 'diagram';
    data: string | CanvasData | PatternData;
    description?: string;
  };
  // Additional fields for specific types
  importance?: number; // for memories
  associations?: string[]; // for memories
  inResponseTo?: string; // for responses
}

export interface CanvasData {
  width: number;
  height: number;
  elements: CanvasElement[];
  background?: string;
}

export interface CanvasElement {
  type: 'circle' | 'rectangle' | 'line' | 'text' | 'path';
  x: number;
  y: number;
  width?: number;
  height?: number;
  color: string;
  opacity?: number;
  text?: string;
  fontSize?: number;
  path?: string;
}

export interface PatternData {
  type: 'grid' | 'spiral' | 'fractal' | 'waves' | 'dots';
  colors: string[];
  size: number;
  complexity: number;
}

export interface BrainState {
  energy: number;        // 0-100
  focus: number;         // 0-100
  mood: number;          // -100 to 100
  uptime: number;        // seconds
  lastActivity: Date | string;
  variables: Record<string, number>;
}
