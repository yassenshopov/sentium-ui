import { useState, useEffect, useCallback } from "react";
import { Thought } from "../lib/types";
import mockThoughts from "../data/mock-thoughts";
import { BrainSimulation } from "../lib/brain-simulation";

// Create a singleton brain simulation instance for thoughts
let brainSimulation: BrainSimulation | null = null;

const getBrainSimulation = () => {
  if (!brainSimulation) {
    brainSimulation = new BrainSimulation("curious");
  }
  return brainSimulation;
};

export function useThoughts() {
  const [thoughts, setThoughts] = useState<Thought[]>(mockThoughts);
  const [input, setInput] = useState("");

  // Generate spontaneous thoughts periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const sim = getBrainSimulation();
      const newThought = sim.generateThought();
      
      setThoughts(prev => [newThought, ...prev.slice(0, 49)]); // Keep max 50 thoughts
    }, 30000); // Generate a thought every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const addThought = useCallback(() => {
    if (input.trim()) {
      const sim = getBrainSimulation();
      const { response, stateChange } = sim.processInput(input);
      
      // Convert response to thought for backward compatibility
      const thought: Thought = {
        id: response.id,
        content: response.content,
        timestamp: response.timestamp,
        type: 'reflection', // Default type for responses
        metadata: response.metadata,
        visual: response.visual
      };
      
      setThoughts(prev => [thought, ...prev.slice(0, 49)]); // Keep max 50 thoughts
      setInput("");
      
      return { thought, stateChange };
    }
    return null;
  }, [input]);

  const addSpontaneousThought = useCallback(() => {
    const sim = getBrainSimulation();
    const thought = sim.generateThought();
    
    setThoughts(prev => [thought, ...prev.slice(0, 49)]); // Keep max 50 thoughts
    return thought;
  }, []);

  const clearThoughts = useCallback(() => {
    setThoughts([]);
  }, []);

  return { 
    thoughts, 
    input, 
    setInput, 
    addThought, 
    addSpontaneousThought,
    clearThoughts 
  };
} 