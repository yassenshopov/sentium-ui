import { useState, useEffect, useCallback } from "react";
import { BrainState, BrainActivity } from "../lib/types";
import { BrainSimulation, PersonalityType } from "../lib/brain-simulation";

// Create a singleton brain simulation instance
let brainSimulation: BrainSimulation | null = null;

const getBrainSimulation = () => {
  if (!brainSimulation) {
    brainSimulation = new BrainSimulation("curious");
  }
  return brainSimulation;
};

export function useBrainState() {
  const [brainState, setBrainState] = useState<BrainState>(() => {
    const sim = getBrainSimulation();
    return sim.getCurrentState();
  });

  const [brainActivity, setBrainActivity] = useState<BrainActivity[]>([]);

  // Simulate time passage and state changes
  useEffect(() => {
    const interval = setInterval(() => {
      const sim = getBrainSimulation();
      const newState = sim.simulateTimePassage(1); // Simulate 1 minute passing
      setBrainState(newState);
      
      // Update brain activity
      setBrainActivity(sim.getAllActivity());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Update brain state when processing input
  const processInput = useCallback((input: string) => {
    const sim = getBrainSimulation();
    const { response, stateChange } = sim.processInput(input);
    setBrainState(prev => ({ ...prev, ...stateChange }));
    
    // Update brain activity
    setBrainActivity(sim.getAllActivity());
    
    return response;
  }, []);

  // Change personality
  const setPersonality = useCallback((personality: PersonalityType) => {
    const sim = getBrainSimulation();
    sim.setPersonality(personality);
    setBrainState(sim.getCurrentState());
    setBrainActivity(sim.getAllActivity());
  }, []);

  // Generate a spontaneous thought
  const generateThought = useCallback(() => {
    const sim = getBrainSimulation();
    const thought = sim.generateThought();
    setBrainActivity(sim.getAllActivity());
    return thought;
  }, []);

  // Generate a memory
  const generateMemory = useCallback((content: string, type: 'experience' | 'fact' | 'conversation' | 'insight' | 'pattern', importance: number = 50) => {
    const sim = getBrainSimulation();
    const memory = sim.generateMemory(content, type, importance);
    setBrainActivity(sim.getAllActivity());
    return memory;
  }, []);

  // Get specific collections
  const getThoughts = useCallback(() => {
    const sim = getBrainSimulation();
    return sim.getThoughts();
  }, []);

  const getMemories = useCallback(() => {
    const sim = getBrainSimulation();
    return sim.getMemories();
  }, []);

  const getResponses = useCallback(() => {
    const sim = getBrainSimulation();
    return sim.getResponses();
  }, []);

  return { 
    brainState, 
    setBrainState, 
    brainActivity,
    processInput, 
    setPersonality, 
    generateThought,
    generateMemory,
    getThoughts,
    getMemories,
    getResponses
  };
} 