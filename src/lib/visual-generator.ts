import { CanvasData, CanvasElement, PatternData } from "./types";

// Emoji collections for different moods and contexts
const EMOJI_SETS = {
  happy: ['😊', '😄', '😃', '😁', '🤗', '😌', '😋', '🥰', '😍', '🤩'],
  thoughtful: ['🤔', '🧐', '🤨', '🤓', '🤯', '😵‍💫', '🤪', '😏', '😶', '🤭'],
  creative: ['🎨', '✨', '🌟', '💫', '🎭', '🎪', '🎯', '🎲', '🎮', '🎸'],
  tech: ['💻', '🤖', '🧠', '⚡', '🔋', '📡', '🛰️', '🚀', '🔬', '⚙️'],
  nature: ['🌱', '🌿', '🌳', '🌸', '🌺', '🌻', '🌙', '⭐', '🌈', '🌊'],
  abstract: ['🌀', '💠', '🔮', '🎆', '🎇', '🎉', '🎊', '🎋', '🎍', '🎎'],
  emotions: ['😢', '😭', '😤', '😡', '🤬', '😱', '😨', '😰', '😥', '😓'],
  neutral: ['😐', '😑', '😯', '😦', '😧', '😮', '😲', '😴', '😪', '😵']
};

// Color palettes for different moods and personalities
const COLOR_PALETTES = {
  happy: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'],
  calm: ['#A8E6CF', '#DCEDC8', '#FFD3B6', '#FFAAA5', '#B8E0D2', '#D4A5A5'],
  energetic: ['#FF6B6B', '#FF8E53', '#FFA726', '#FFCC02', '#66BB6A', '#42A5F5'],
  mysterious: ['#2C3E50', '#34495E', '#8E44AD', '#9B59B6', '#3498DB', '#2980B9'],
  creative: ['#E74C3C', '#F39C12', '#F1C40F', '#27AE60', '#3498DB', '#9B59B6'],
  tech: ['#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B']
};

export class VisualGenerator {
  private personality: string;
  private mood: number;

  constructor(personality: string, mood: number) {
    this.personality = personality;
    this.mood = mood;
  }

  // Update mood without recreating the instance
  updateMood(mood: number): void {
    this.mood = mood;
  }

  // Generate an emoji based on context and mood
  generateEmoji(context: string, mood?: number): string {
    const currentMood = mood ?? this.mood;
    const lowerContext = context.toLowerCase();
    
    // Select emoji set based on context
    let emojiSet: string[] = [];
    
    if (lowerContext.includes('happy') || lowerContext.includes('joy') || lowerContext.includes('excited')) {
      emojiSet = EMOJI_SETS.happy;
    } else if (lowerContext.includes('think') || lowerContext.includes('analyze') || lowerContext.includes('ponder')) {
      emojiSet = EMOJI_SETS.thoughtful;
    } else if (lowerContext.includes('create') || lowerContext.includes('imagine') || lowerContext.includes('dream')) {
      emojiSet = EMOJI_SETS.creative;
    } else if (lowerContext.includes('tech') || lowerContext.includes('ai') || lowerContext.includes('digital')) {
      emojiSet = EMOJI_SETS.tech;
    } else if (lowerContext.includes('nature') || lowerContext.includes('organic') || lowerContext.includes('life')) {
      emojiSet = EMOJI_SETS.nature;
    } else if (lowerContext.includes('abstract') || lowerContext.includes('philosophy') || lowerContext.includes('deep')) {
      emojiSet = EMOJI_SETS.abstract;
    } else if (lowerContext.includes('sad') || lowerContext.includes('angry') || lowerContext.includes('fear')) {
      emojiSet = EMOJI_SETS.emotions;
    } else {
      emojiSet = EMOJI_SETS.neutral;
    }
    
    // Adjust based on mood
    if (currentMood > 50) {
      emojiSet = [...emojiSet, ...EMOJI_SETS.happy];
    } else if (currentMood < -50) {
      emojiSet = [...emojiSet, ...EMOJI_SETS.emotions];
    }
    
    return emojiSet[Math.floor(Math.random() * emojiSet.length)];
  }

  // Generate a simple canvas drawing
  generateCanvas(width: number = 200, height: number = 150): CanvasData {
    const elements: CanvasElement[] = [];
    const palette = this.getColorPalette();
    
    // Background
    const background = palette[Math.floor(Math.random() * palette.length)];
    
    // Generate random elements based on personality
    const numElements = this.personality === 'chaotic' ? 8 : 
                       this.personality === 'curious' ? 6 : 
                       this.personality === 'stoic' ? 4 : 5;
    
    for (let i = 0; i < numElements; i++) {
      const element = this.generateRandomElement(width, height, palette);
      elements.push(element);
    }
    
    return {
      width,
      height,
      elements,
      background
    };
  }

  // Generate a specific type of canvas drawing
  generateSpecificCanvas(type: string, width: number = 200, height: number = 150): CanvasData {
    const palette = this.getColorPalette();
    
    switch (type) {
      case 'neural':
        return this.generateNeuralNetwork(width, height, palette);
      case 'abstract':
        return this.generateAbstractArt(width, height, palette);
      case 'geometric':
        return this.generateGeometricPattern(width, height, palette);
      case 'organic':
        return this.generateOrganicShapes(width, height, palette);
      case 'tech':
        return this.generateTechDiagram(width, height, palette);
      default:
        return this.generateCanvas(width, height);
    }
  }

  // Generate a pattern
  generatePattern(type: 'grid' | 'spiral' | 'fractal' | 'waves' | 'dots' = 'dots'): PatternData {
    const palette = this.getColorPalette();
    const complexity = this.personality === 'chaotic' ? 8 : 
                      this.personality === 'curious' ? 6 : 
                      this.personality === 'stoic' ? 4 : 5;
    
    return {
      type,
      colors: palette.slice(0, 4),
      size: 20,
      complexity
    };
  }

  private generateRandomElement(width: number, height: number, palette: string[]): CanvasElement {
    const types: Array<'circle' | 'rectangle' | 'line' | 'text'> = ['circle', 'rectangle', 'line', 'text'];
    const type = types[Math.floor(Math.random() * types.length)];
    const color = palette[Math.floor(Math.random() * palette.length)];
    
    switch (type) {
      case 'circle': {
        const radius = 20 + Math.random() * 40;
        return {
          type: 'circle',
          x: Math.random() * width,
          y: Math.random() * height,
          width: radius,
          height: radius,
          color,
          opacity: 0.7 + Math.random() * 0.3
        };
      }
      case 'rectangle':
        return {
          type: 'rectangle',
          x: Math.random() * width,
          y: Math.random() * height,
          width: 30 + Math.random() * 60,
          height: 20 + Math.random() * 40,
          color,
          opacity: 0.7 + Math.random() * 0.3
        };
      case 'line':
        return {
          type: 'line',
          x: Math.random() * width,
          y: Math.random() * height,
          width: 50 + Math.random() * 100,
          height: 2 + Math.random() * 4,
          color,
          opacity: 0.8 + Math.random() * 0.2
        };
      case 'text': {
        const texts = ['AI', '🧠', '💭', '✨', '🌟', '💡', '🔮', '🎯'];
        return {
          type: 'text',
          x: Math.random() * width,
          y: Math.random() * height,
          color,
          text: texts[Math.floor(Math.random() * texts.length)],
          fontSize: 16 + Math.random() * 20,
          opacity: 0.8 + Math.random() * 0.2
        };
      }
    }
  }

  private generateNeuralNetwork(width: number, height: number, palette: string[]): CanvasData {
    const elements: CanvasElement[] = [];
    const nodes = 8;
    const nodeSize = 15;
    
    // Create nodes
    for (let i = 0; i < nodes; i++) {
      elements.push({
        type: 'circle',
        x: (width / (nodes + 1)) * (i + 1),
        y: height / 2 + (Math.random() - 0.5) * 60,
        width: nodeSize,
        height: nodeSize,
        color: palette[i % palette.length],
        opacity: 0.8
      });
    }
    
    // Create connections
    for (let i = 0; i < nodes - 1; i++) {
      elements.push({
        type: 'line',
        x: (width / (nodes + 1)) * (i + 1) + nodeSize / 2,
        y: height / 2 + (Math.random() - 0.5) * 60,
        width: width / (nodes + 1) - nodeSize,
        height: 2,
        color: palette[(i + 2) % palette.length],
        opacity: 0.6
      });
    }
    
    return {
      width,
      height,
      elements,
      background: '#1a1a1a'
    };
  }

  private generateAbstractArt(width: number, height: number, palette: string[]): CanvasData {
    const elements: CanvasElement[] = [];
    
    // Create flowing shapes
    for (let i = 0; i < 6; i++) {
      elements.push({
        type: 'circle',
        x: Math.random() * width,
        y: Math.random() * height,
        width: 30 + Math.random() * 50,
        height: 30 + Math.random() * 50,
        color: palette[i % palette.length],
        opacity: 0.3 + Math.random() * 0.4
      });
    }
    
    // Add some text elements
    elements.push({
      type: 'text',
      x: width / 2,
      y: height / 2,
      color: palette[0],
      text: '🧠',
      fontSize: 24,
      opacity: 0.9
    });
    
    return {
      width,
      height,
      elements,
      background: '#f8f9fa'
    };
  }

  private generateGeometricPattern(width: number, height: number, palette: string[]): CanvasData {
    const elements: CanvasElement[] = [];
    const gridSize = 40;
    
    for (let x = 0; x < width; x += gridSize) {
      for (let y = 0; y < height; y += gridSize) {
        if (Math.random() > 0.5) {
          elements.push({
            type: 'rectangle',
            x,
            y,
            width: gridSize - 4,
            height: gridSize - 4,
            color: palette[Math.floor(Math.random() * palette.length)],
            opacity: 0.7
          });
        }
      }
    }
    
    return {
      width,
      height,
      elements,
      background: '#ffffff'
    };
  }

  private generateOrganicShapes(width: number, height: number, palette: string[]): CanvasData {
    const elements: CanvasElement[] = [];
    
    // Create organic-looking circles
    for (let i = 0; i < 8; i++) {
      elements.push({
        type: 'circle',
        x: 50 + Math.random() * (width - 100),
        y: 50 + Math.random() * (height - 100),
        width: 20 + Math.random() * 40,
        height: 20 + Math.random() * 40,
        color: palette[i % palette.length],
        opacity: 0.6 + Math.random() * 0.3
      });
    }
    
    return {
      width,
      height,
      elements,
      background: '#f0f8ff'
    };
  }

  private generateTechDiagram(width: number, height: number, palette: string[]): CanvasData {
    const elements: CanvasElement[] = [];
    
    // Create tech-style boxes
    const boxes = [
      { x: 20, y: 20, w: 60, h: 40, text: 'AI' },
      { x: 120, y: 20, w: 60, h: 40, text: 'ML' },
      { x: 20, y: 80, w: 60, h: 40, text: 'Data' },
      { x: 120, y: 80, w: 60, h: 40, text: 'Logic' }
    ];
    
    boxes.forEach((box, i) => {
      elements.push({
        type: 'rectangle',
        x: box.x,
        y: box.y,
        width: box.w,
        height: box.h,
        color: palette[i % palette.length],
        opacity: 0.8
      });
      
      elements.push({
        type: 'text',
        x: box.x + box.w / 2,
        y: box.y + box.h / 2,
        color: '#ffffff',
        text: box.text,
        fontSize: 14,
        opacity: 1
      });
    });
    
    // Add connections
    elements.push({
      type: 'line',
      x: 80,
      y: 40,
      width: 40,
      height: 2,
      color: palette[4],
      opacity: 0.8
    });
    
    return {
      width,
      height,
      elements,
      background: '#2d3748'
    };
  }

  private getColorPalette(): string[] {
    if (this.mood > 50) return COLOR_PALETTES.happy;
    if (this.mood < -50) return COLOR_PALETTES.calm;
    if (this.personality === 'chaotic') return COLOR_PALETTES.energetic;
    if (this.personality === 'curious') return COLOR_PALETTES.creative;
    if (this.personality === 'stoic') return COLOR_PALETTES.mysterious;
    return COLOR_PALETTES.tech;
  }
} 