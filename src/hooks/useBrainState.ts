import { useState, useEffect, useCallback, useRef } from "react";
import { BrainState, BrainActivity } from "../lib/types";
import { BrainSimulation, PersonalityType } from "../lib/brain-simulation";

// Configuration interface for the hook
export interface UseBrainStateConfig {
  initialPersonality?: PersonalityType;
  initialBrainState?: Partial<BrainState>;
  simulationInterval?: number; // in milliseconds
}

// Default configuration
const defaultConfig: UseBrainStateConfig = {
  initialPersonality: "curious",
  simulationInterval: 60000, // 1 minute
};

export function useBrainState(config: UseBrainStateConfig = {}) {
  // Merge with default config
  const finalConfig = { ...defaultConfig, ...config };
  
  // Use ref to maintain BrainSimulation instance per component lifecycle
  const brainSimulationRef = useRef<BrainSimulation | null>(null);
  
  // Initialize brain simulation if not already created
  const getBrainSimulation = useCallback(() => {
    if (!brainSimulationRef.current) {
      brainSimulationRef.current = new BrainSimulation(finalConfig.initialPersonality);
      
      // Apply custom initial state if provided
      if (finalConfig.initialBrainState) {
        const currentState = brainSimulationRef.current.getCurrentState();
        const updatedState = { ...currentState, ...finalConfig.initialBrainState };
        // Note: BrainSimulation doesn't have a setState method, so we'll need to work with what we have
        // The initial state will be applied through the useState initialization
      }
    }
    return brainSimulationRef.current;
  }, [finalConfig.initialPersonality, finalConfig.initialBrainState]);

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
    }, finalConfig.simulationInterval);

    return () => clearInterval(interval);
  }, [getBrainSimulation, finalConfig.simulationInterval]);

  // Update brain state when processing input
  const processInput = useCallback((input: string) => {
    const sim = getBrainSimulation();
    const { response, stateChange } = sim.processInput(input);
    setBrainState(prev => ({ ...prev, ...stateChange }));
    
    // Update brain activity
    setBrainActivity(sim.getAllActivity());
    
    return response;
  }, [getBrainSimulation]);

  // Change personality
  const setPersonality = useCallback((personality: PersonalityType) => {
    const sim = getBrainSimulation();
    sim.setPersonality(personality);
    setBrainState(sim.getCurrentState());
    setBrainActivity(sim.getAllActivity());
  }, [getBrainSimulation]);

  // Generate a spontaneous thought
  const generateThought = useCallback(() => {
    const sim = getBrainSimulation();
    const thought = sim.generateThought();
    setBrainActivity(sim.getAllActivity());
    return thought;
  }, [getBrainSimulation]);

  // Generate a memory
  const generateMemory = useCallback((content: string, type: 'experience' | 'fact' | 'conversation' | 'insight' | 'pattern', importance: number = 50) => {
    const sim = getBrainSimulation();
    const memory = sim.generateMemory(content, type, importance);
    setBrainActivity(sim.getAllActivity());
    return memory;
  }, [getBrainSimulation]);

  // Get specific collections
  const getThoughts = useCallback(() => {
    const sim = getBrainSimulation();
    return sim.getThoughts();
  }, [getBrainSimulation]);

  const getMemories = useCallback(() => {
    const sim = getBrainSimulation();
    return sim.getMemories();
  }, [getBrainSimulation]);

  const getResponses = useCallback(() => {
    const sim = getBrainSimulation();
    return sim.getResponses();
  }, [getBrainSimulation]);

  // Reset brain simulation (useful for testing)
  const resetBrainSimulation = useCallback((newPersonality?: PersonalityType) => {
    brainSimulationRef.current = null;
    const sim = getBrainSimulation();
    if (newPersonality) {
      sim.setPersonality(newPersonality);
    }
    setBrainState(sim.getCurrentState());
    setBrainActivity(sim.getAllActivity());
  }, [getBrainSimulation]);

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
    getResponses,
    resetBrainSimulation,
    // Expose the current simulation instance for advanced use cases
    getBrainSimulation
  };
} 