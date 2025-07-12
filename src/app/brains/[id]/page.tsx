"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";
import TabbedInterface from "../../../components/layout/TabbedInterface";
import { useBrainState } from "../../../hooks/useBrainState";
import { PersonalityType } from "../../../lib/brain-simulation";
import {
  Brain as BrainIcon,
  Sparkles,
  ArrowLeft,
  Search,
  Lightbulb,
  Palette,
  Eye,
  Moon,
  Building2,
  Heart,
  Zap,
  Sun,
  Snowflake,
  Flame,
  Leaf,
  Clapperboard
} from "lucide-react";
import { CanvasData, PatternData } from "../../../lib/types";
import { mockBrains } from "../../../data/mock-brains";
import { Button } from "../../../components/ui/button";
import Link from "next/link";

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

export default function BrainDashboard() {
  const params = useParams();
  const router = useRouter();
  const brainId = params.id as string;
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isChannelOpen, setIsChannelOpen] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  
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

  // Find the selected brain
  const selectedBrain = useMemo(() => {
    return mockBrains.find(brain => brain.id === brainId);
  }, [brainId]);

  // Redirect if brain not found
  useEffect(() => {
    if (!selectedBrain) {
      router.push('/brains');
    }
  }, [selectedBrain, router]);

  // Set the brain's personality when component mounts
  useEffect(() => {
    if (selectedBrain) {
      setPersonality(selectedBrain.personality);
    }
  }, [selectedBrain, setPersonality]);

  const handleSendMessage = async (message: string) => {
    if (message.trim() && isChannelOpen) {
      // Clear any previous errors
      setProcessingError(null);
      
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
        try {
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
        } catch (error) {
          // Log the error for debugging
          console.error('Error processing brain input:', error);
          
          // Set error state for UI feedback
          setProcessingError(error instanceof Error ? error.message : 'An unexpected error occurred while processing your message');
          
          // Add error message to chat
          const errorMessage: ChatMessage = {
            id: `error-${crypto.randomUUID()}`,
            type: 'brain',
            content: "I'm sorry, but I encountered an error while processing your message. Please try again.",
            timestamp: new Date()
          };
          setChatMessages(prev => [...prev, errorMessage]);
        } finally {
          // Always reset processing state, regardless of success or failure
          setIsProcessing(false);
        }
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
            content: `Hello! I'm ${selectedBrain?.name}. The communication channel is now open. We can have a free-flowing conversation - feel free to ask me anything or just chat naturally.`,
            timestamp: new Date()
          };
          setChatMessages(prev => [...prev, brainMessage]);
        }
      }, 1500); // 1.5 second delay for initial greeting
    }
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

  // Parallax scroll state
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- BEGIN: Dynamic Floating Brains Config ---
  const NUM_BRAINS = 12;
  const heroPalette = [
    "text-primary/30",
    "text-primary/15",
    "text-secondary/25",
    "text-secondary/10",
    "text-accent/20",
    "text-accent/10",
    "text-muted/20",
    "text-foreground/10"
  ];

  const floatingBrains = useMemo(() => {
    return Array.from({ length: NUM_BRAINS }).map((_, i) => {
      // Random position (avoid edges)
      const top = Math.random() * 70 + 5; // vh, 5-75
      const left = Math.random() * 80 + 5; // vw, 5-85
      // Random size
      const size = Math.random() * 4 + 2; // rem, 2-6
      // Random color
      const color = heroPalette[Math.floor(Math.random() * heroPalette.length)];
      // Random opacity
      const opacity = Math.random() * 0.4 + 0.3; // 0.3-0.7
      // Random animation
      const yMove = Math.random() * 40 + 10; // px, 10-50
      const duration = Math.random() * 6 + 7; // 7-13s
      const delay = Math.random() * 5; // 0-5s
      const rotate = Math.random() * 20 - 10; // -10 to 10 deg
      const scaleFrom = Math.random() * 0.3 + 0.8; // 0.8-1.1
      const scaleTo = scaleFrom + Math.random() * 0.3; // up to 0.3 more
      const parallaxMultiplier = Math.random() * 0.9 + 0.3; // 0.3-1.2 (stronger parallax)
      return {
        key: `floating-brain-${i}`,
        style: {
          top: `${top}vh`,
          left: `${left}vw`,
          opacity,
        },
        size,
        color,
        yMove,
        duration,
        delay,
        rotate,
        scaleFrom,
        scaleTo,
        parallaxMultiplier,
      };
    });
  }, [heroPalette]);
  // --- END: Dynamic Floating Brains Config ---

  if (!selectedBrain) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading brain...</p>
        </div>
      </div>
    );
  }

  // Icon map for dynamic icon rendering (must be after selectedBrain null check)
  const iconMap: Record<string, React.ElementType> = {
    Brain: BrainIcon,
    Search,
    Lightbulb,
    Palette,
    Eye,
    Moon,
    Building2,
    Heart,
    Zap,
    Sun,
    Snowflake,
    Flame,
    Leaf,
    Clapperboard
  };
  const brainIcon = selectedBrain.icon && iconMap[selectedBrain.icon] ? iconMap[selectedBrain.icon] : BrainIcon;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"
          style={{
            background: `linear-gradient(to bottom right, ${selectedBrain.color}10, transparent, ${selectedBrain.accentColor}10)`
          }}
        />
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${selectedBrain.color}20, transparent 50%)`
          }}
        />
        
        {/* Floating Background Elements - Dynamic Brains */}
        {floatingBrains.map((brain) => (
          <motion.div
            key={brain.key}
            animate={{
              y: [0 + scrollY * brain.parallaxMultiplier, brain.yMove + scrollY * brain.parallaxMultiplier, 0 + scrollY * brain.parallaxMultiplier],
              rotate: [0, brain.rotate, 0],
              scale: [brain.scaleFrom, brain.scaleTo, brain.scaleFrom],
            }}
            transition={{
              duration: brain.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: brain.delay,
            }}
            className={`absolute blur-sm pointer-events-none`}
            style={brain.style}
          >
            {(() => {
              const LucideIcon = selectedBrain.icon && iconMap[selectedBrain.icon] ? iconMap[selectedBrain.icon] : BrainIcon;
              return <LucideIcon style={{ width: `${brain.size}rem`, height: `${brain.size}rem`, color: selectedBrain.color, opacity: 0.13 }} />;
            })()}
          </motion.div>
        ))}
        
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16">
          {/* Back Button */}
          <div className="mb-8">
            <Link href="/brains">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Brain Selection
              </Button>
            </Link>
          </div>

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
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
              style={{
                background: `linear-gradient(135deg, ${selectedBrain.color}, ${selectedBrain.accentColor})`
              }}
            >
              {(() => {
                const LucideIcon = selectedBrain.icon && iconMap[selectedBrain.icon] ? iconMap[selectedBrain.icon] : BrainIcon;
                return <LucideIcon className="w-10 h-10 text-white" />;
              })()}
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-4"
            >
              Meet {selectedBrain.name}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              {selectedBrain.description}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex items-center justify-center gap-6 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: selectedBrain.color }}
                />
                <span>Consciousness Active</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" style={{ color: selectedBrain.color }} />
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
              currentPersonality={selectedBrain.personality}
              onPersonalityChange={() => {}} // Disabled for individual brain pages
              color={selectedBrain.color}
              accentColor={selectedBrain.accentColor}
              brainIcon={brainIcon}
            />
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
} 