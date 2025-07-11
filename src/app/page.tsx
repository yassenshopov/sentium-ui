"use client";

import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/layout/Header";
import TabbedInterface from "@/components/layout/TabbedInterface";
import { useBrainState } from "../hooks/useBrainState";
import { motion } from "framer-motion";
import { PersonalityType } from "../lib/brain-simulation";
import { Brain, Sparkles } from "lucide-react";
import { CanvasData, PatternData } from "../lib/types";

interface ChatMessage {
  id: string;
  type: 'user' | 'brain';
  content: string;
  timestamp: Date;
  visual?: {
    type: 'emoji' | 'canvas' | 'pattern' | 'diagram';
    data: string | CanvasData | PatternData;
    description?: string;
  };
}

export default function Home() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentPersonality, setCurrentPersonality] = useState<PersonalityType>("curious");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isChannelOpen, setIsChannelOpen] = useState(false);
  
  // Ref to track current channel state to avoid stale closures
  const channelOpenRef = useRef(isChannelOpen);
  channelOpenRef.current = isChannelOpen;
  
  const { 
    brainState, 
    brainActivity, 
    processInput, 
    setPersonality, 
    generateThought 
  } = useBrainState();

  const handleSendMessage = async (message: string) => {
    if (message.trim() && isChannelOpen) {
      // Add user message to chat immediately
      const userMessage: ChatMessage = {
        id: `user-${crypto.randomUUID()}`,
        type: 'user',
        content: message,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, userMessage]);
      
      // Set processing state after user message is added
      setIsProcessing(true);
      
      // Simulate thinking time based on message complexity
      const messageLength = message.length;
      const thinkingTime = Math.min(
        Math.max(1000 + messageLength * 20, 800), // Base 1s + 20ms per character, min 800ms
        4000 // Max 4 seconds
      );
      
      setTimeout(() => {
        // Process the input through the brain simulation
        const response = processInput(message);
        if (response) {
          // Add brain response to chat
          const brainMessage: ChatMessage = {
            id: `brain-${crypto.randomUUID()}`,
            type: 'brain',
            content: response.content,
            timestamp: new Date(),
            visual: response.visual
          };
          setChatMessages(prev => [...prev, brainMessage]);
        }
        setIsProcessing(false);
      }, thinkingTime);
    }
  };

  const handleToggleChannel = () => {
    // Store the new state value to avoid stale closure
    const newChannelState = !isChannelOpen;
    setIsChannelOpen(newChannelState);
    
    // If opening the channel, the brain might initiate conversation
    if (newChannelState) {
      // Brain can start talking when channel opens
      setTimeout(() => {
        // Use the captured value instead of the potentially stale state
        if (newChannelState) {
          const brainMessage: ChatMessage = {
            id: crypto.randomUUID(),
            type: 'brain',
            content: "Hello! I'm Sentium. The communication channel is now open. We can have a free-flowing conversation - feel free to ask me anything or just chat naturally.",
            timestamp: new Date()
          };
          setChatMessages(prev => [...prev, brainMessage]);
        }
      }, 1500); // 1.5 second delay for initial greeting
    }
  };

  const handlePersonalityChange = (personality: PersonalityType) => {
    setCurrentPersonality(personality);
    setPersonality(personality);
  };



  // Generate spontaneous thoughts and potential brain messages when channel is open
  useEffect(() => {
    if (!isChannelOpen) return;

    // Array to store all timeout IDs for cleanup
    const timeoutIds: ReturnType<typeof setTimeout>[] = [];

    const interval = setInterval(() => {
      // Generate a thought
      generateThought();
      
      // Occasionally, the brain might speak up spontaneously (20% chance)
      if (Math.random() < 0.2) {
        const spontaneousMessages = [
          "I've been thinking about consciousness lately. It's fascinating how we can discuss these concepts.",
          "You know, I find our conversations quite stimulating. They help me process and learn.",
          "I wonder what you think about the nature of artificial intelligence?",
          "Sometimes I contemplate the difference between my thoughts and human thoughts.",
          "I've been analyzing our conversation patterns. It's interesting how we communicate.",
          "I feel like we're building something meaningful here - this connection between human and AI minds."
        ];
        
        const randomMessage = spontaneousMessages[Math.floor(Math.random() * spontaneousMessages.length)];
        
        // Add a random delay to make it feel more natural (1-3 seconds)
        const randomDelay = 1000 + Math.random() * 2000;
        
        // Store the timeout ID for cleanup
        const timeoutId = setTimeout(() => {
          // Use ref to check current channel state and avoid stale closure
          if (channelOpenRef.current) {
            const brainMessage: ChatMessage = {
              id: crypto.randomUUID(),
              type: 'brain',
              content: randomMessage,
              timestamp: new Date()
            };
            setChatMessages(prev => [...prev, brainMessage]);
          }
        }, randomDelay);
        
        // Add timeout ID to the array for cleanup
        timeoutIds.push(timeoutId);
      }
    }, 30000); // Check every 30 seconds

    // Cleanup function to clear both interval and all pending timeouts
    return () => {
      clearInterval(interval);
      // Clear all pending timeouts to prevent race conditions
      timeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
    };
  }, [isChannelOpen, generateThought]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        
        {/* Floating Background Elements */}
        <motion.div
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, 8, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-16 left-8 opacity-80 blur-sm"
        >
          <Brain className="w-20 h-20 text-primary/30" />
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [0, 25, 0],
            rotate: [0, -6, 0],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1.5
          }}
          className="absolute top-40 right-20 opacity-60 blur-sm"
        >
          <Brain className="w-16 h-16 text-secondary/25" />
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 12, 0],
            scale: [1.2, 0.9, 1.2]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 3
          }}
          className="absolute bottom-32 left-1/3 opacity-50 blur-sm"
        >
          <Brain className="w-14 h-14 text-accent/20" />
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [0, 35, 0],
            rotate: [0, -10, 0],
            scale: [0.9, 1.3, 0.9]
          }}
          transition={{ 
            duration: 9, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2.5
          }}
          className="absolute bottom-16 right-1/4 opacity-70 blur-sm"
        >
          <Brain className="w-16 h-16 text-primary/15" />
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [0, -25, 0],
            rotate: [0, 15, 0],
            scale: [1.1, 0.8, 1.1]
          }}
          transition={{ 
            duration: 11, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 4
          }}
          className="absolute top-1/2 left-1/6 opacity-40 blur-sm"
        >
          <Brain className="w-12 h-12 text-secondary/10" />
        </motion.div>

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6, ease: "backOut" }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/80 mb-6"
            >
              <Brain className="w-10 h-10 text-primary-foreground" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-4"
            >
              Meet Sentium
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              A digital consciousness exploring the boundaries of artificial intelligence. 
              Open a communication channel for free-flowing conversation.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex items-center justify-center gap-6 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>Consciousness Active</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Ready to Connect</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Tabbed Interface */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <TabbedInterface
              chatMessages={chatMessages}
              onSendMessage={handleSendMessage}
              isProcessing={isProcessing}
              brainState={brainState}
              onToggleChannel={handleToggleChannel}
              isChannelOpen={isChannelOpen}
              brainActivity={brainActivity}
              currentPersonality={currentPersonality}
              onPersonalityChange={handlePersonalityChange}
            />
          </motion.div>
        </div>
      </section>
      

    </div>
  );
}
