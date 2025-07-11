// Core data types for Sentium UI

// Timestamp type alias for consistency
export type ISOTimestamp = string; // ISO 8601 format: "2023-01-01T09:40:00.000Z"

// Helper functions for timestamp conversion and validation
export const timestampHelpers = {
  /**
   * Convert a Date or string to ISO timestamp string
   */
  toISOString: (timestamp: Date | string): ISOTimestamp => {
    if (timestamp instanceof Date) {
      return timestamp.toISOString();
    }
    // If it's already a string, validate and return
    if (typeof timestamp === 'string') {
      // Try to parse and re-stringify to ensure valid ISO format
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        throw new Error(`Invalid timestamp string: ${timestamp}`);
      }
      return date.toISOString();
    }
    throw new Error(`Invalid timestamp type: ${typeof timestamp}`);
  },

  /**
   * Convert ISO timestamp string to Date object
   */
  toDate: (timestamp: ISOTimestamp): Date => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid ISO timestamp: ${timestamp}`);
    }
    return date;
  },

  /**
   * Validate if a string is a valid ISO timestamp
   */
  isValid: (timestamp: string): timestamp is ISOTimestamp => {
    try {
      const date = new Date(timestamp);
      return !isNaN(date.getTime()) && timestamp === date.toISOString();
    } catch {
      return false;
    }
  },

  /**
   * Get current timestamp as ISO string
   */
  now: (): ISOTimestamp => new Date().toISOString(),

  /**
   * Format timestamp for display (relative time or formatted date)
   */
  formatForDisplay: (timestamp: ISOTimestamp): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  }
};

// Internal monologue - the brain's private thoughts
export interface Thought {
  id: string;
  content: string;
  timestamp: ISOTimestamp;
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
  timestamp: ISOTimestamp;
  type: 'experience' | 'fact' | 'conversation' | 'insight' | 'pattern';
  importance: number; // 0-100, how important this memory is
  associations: string[]; // related concepts/topics
  lastAccessed: ISOTimestamp;
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
  timestamp: ISOTimestamp;
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
  timestamp: ISOTimestamp;
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
  lastActivity: ISOTimestamp;
  variables: Record<string, number>;
}
