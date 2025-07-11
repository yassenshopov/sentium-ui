import { useState, useEffect, useCallback, useRef } from "react";
import { Thought, timestampHelpers } from "../lib/types";
import mockThoughts from "../data/mock-thoughts";
import { BrainSimulation, PersonalityType } from "../lib/brain-simulation";

// Configuration interface for the hook
export interface UseThoughtsConfig {
  initialPersonality?: PersonalityType;
  spontaneousThoughtInterval?: number; // in milliseconds
  maxThoughts?: number;
  enablePeriodicThoughts?: boolean;
}

// Default configuration
const defaultConfig: Required<UseThoughtsConfig> = {
  initialPersonality: "curious",
  spontaneousThoughtInterval: 30000, // 30 seconds
  maxThoughts: 50,
  enablePeriodicThoughts: true,
};

export function useThoughts(config: UseThoughtsConfig = {}) {
  // Merge with default config to ensure all properties are defined
  const finalConfig: Required<UseThoughtsConfig> = { ...defaultConfig, ...config };
  
  const [thoughts, setThoughts] = useState<Thought[]>(mockThoughts);
  const [input, setInput] = useState("");
  
  // Use ref to maintain brain simulation instance per component lifecycle
  const brainSimulationRef = useRef<BrainSimulation | null>(null);
  
  // Initialize brain simulation if not already created
  const getBrainSimulation = useCallback(() => {
    if (!brainSimulationRef.current) {
      brainSimulationRef.current = new BrainSimulation(finalConfig.initialPersonality);
    }
    return brainSimulationRef.current;
  }, [finalConfig.initialPersonality]);

  // Generate spontaneous thoughts periodically
  useEffect(() => {
    if (!finalConfig.enablePeriodicThoughts) {
      return;
    }

    const interval = setInterval(() => {
      try {
        const sim = getBrainSimulation();
        const newThought = sim.generateThought();
        
        setThoughts(prev => [newThought, ...prev.slice(0, finalConfig.maxThoughts - 1)]); // Keep max thoughts
      } catch (error) {
        console.error('Error generating periodic thought:', error);
        
        // Create a fallback thought to maintain UI consistency
        const fallbackThought: Thought = {
          id: Date.now().toString(),
          content: 'Periodic thought generation failed...',
          timestamp: timestampHelpers.now(),
          type: 'reflection',
          metadata: {
            energy: 0,
            focus: 0,
            mood: -20
          }
        };
        
        setThoughts(prev => [fallbackThought, ...prev.slice(0, finalConfig.maxThoughts - 1)]);
      }
    }, finalConfig.spontaneousThoughtInterval);

    return () => clearInterval(interval);
  }, [getBrainSimulation, finalConfig.spontaneousThoughtInterval, finalConfig.maxThoughts, finalConfig.enablePeriodicThoughts]);

  // Helper function to convert Response to Thought safely
  const convertResponseToThought = useCallback((response: any): Thought => {
    return {
      id: response.id || Date.now().toString(),
      content: response.content || '',
      timestamp: response.timestamp || new Date(),
      type: 'reflection', // Default type for responses
      metadata: response.metadata || {},
      visual: response.visual
    };
  }, []);

  const addThought = useCallback(() => {
    if (!input.trim()) {
      return null;
    }

    try {
      const sim = getBrainSimulation();
      const { response, stateChange } = sim.processInput(input);
      
      // Convert response to thought with proper error handling
      const thought = convertResponseToThought(response);
      
      setThoughts(prev => [thought, ...prev.slice(0, finalConfig.maxThoughts - 1)]); // Keep max thoughts
      setInput("");
      
      return { thought, stateChange };
    } catch (error) {
      console.error('Error processing input:', error);
      
      // Create a fallback thought to maintain UI consistency
      const fallbackThought: Thought = {
        id: Date.now().toString(),
        content: `Error processing: "${input}"`,
        timestamp: timestampHelpers.now(),
        type: 'reflection',
        metadata: {
          energy: 0,
          focus: 0,
          mood: -50 // Indicate error state
        }
      };
      
      setThoughts(prev => [fallbackThought, ...prev.slice(0, finalConfig.maxThoughts - 1)]);
      setInput("");
      
      return { thought: fallbackThought, stateChange: {} };
    }
  }, [input, getBrainSimulation, convertResponseToThought, finalConfig.maxThoughts]);

  const addSpontaneousThought = useCallback(() => {
    try {
      const sim = getBrainSimulation();
      const thought = sim.generateThought();
      
      setThoughts(prev => [thought, ...prev.slice(0, finalConfig.maxThoughts - 1)]); // Keep max thoughts
      return thought;
    } catch (error) {
      console.error('Error generating spontaneous thought:', error);
      
      // Create a fallback thought to maintain UI consistency
      const fallbackThought: Thought = {
        id: Date.now().toString(),
        content: 'Error generating thought...',
        timestamp: timestampHelpers.now(),
        type: 'reflection',
        metadata: {
          energy: 0,
          focus: 0,
          mood: -30
        }
      };
      
      setThoughts(prev => [fallbackThought, ...prev.slice(0, finalConfig.maxThoughts - 1)]);
      return fallbackThought;
    }
  }, [getBrainSimulation, finalConfig.maxThoughts]);

  const clearThoughts = useCallback(() => {
    setThoughts([]);
  }, []);

  return { 
    thoughts, 
    input, 
    setInput, 
    addThought, 
    addSpontaneousThought,
    clearThoughts,
    config: finalConfig
  };
} 