"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain } from "../../lib/types";
import { mockBrains } from "../../data/mock-brains";
import BrainCard from "../../components/dashboard/BrainCard";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { 
  Search, 
  Grid3X3, 
  List,
  Brain as BrainIcon,
  Sparkles
} from "lucide-react";
import { useRouter } from "next/navigation";
import LoadingOverlay from "../../components/ui/LoadingOverlay";

export default function BrainsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [personalityFilter, setPersonalityFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedBrain, setSelectedBrain] = useState<Brain | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Ref to store timeout ID for cleanup
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Filter brains based on search and filters
  const filteredBrains = useMemo(() => {
    return mockBrains.filter(brain => {
      const matchesSearch = 
        brain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brain.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brain.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        brain.capabilities.some(cap => cap.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === "all" || brain.status === statusFilter;
      const matchesPersonality = personalityFilter === "all" || brain.personality === personalityFilter;

      return matchesSearch && matchesStatus && matchesPersonality;
    });
  }, [searchQuery, statusFilter, personalityFilter]);

  const handleBrainSelect = (brain: Brain) => {
    setSelectedBrain(brain);
  };

  const handleConnectToBrain = () => {
    if (selectedBrain) {
      setIsLoading(true);
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Store the new timeout ID
      timeoutRef.current = setTimeout(() => {
        router.push(`/brains/${selectedBrain.id}`);
        setIsLoading(false);
      }, 700); // Simulate loading delay
    }
  };

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getStatusCount = (status: string) => {
    if (status === "all") return mockBrains.length;
    return mockBrains.filter(brain => brain.status === status).length;
  };

  const getPersonalityCount = (personality: string) => {
    if (personality === "all") return mockBrains.length;
    return mockBrains.filter(brain => brain.personality === personality).length;
  };

  // Animation variants
  const staggerVariants = {
    visible: { transition: { staggerChildren: 0.12 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative w-full flex items-center justify-center min-h-[220px] md:min-h-[280px] bg-gradient-to-br from-primary/10 via-background to-secondary/10 overflow-hidden"
      >
        {/* Subtle background icon */}
        <BrainIcon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] text-primary/10 pointer-events-none select-none z-0" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl px-4 py-12 md:py-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: "backOut" }}
            className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 drop-shadow-sm"
          >
            Brain Selection
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: "backOut" }}
            className="text-lg md:text-2xl text-muted-foreground mb-2 md:mb-4"
          >
            Choose a brain to interact with
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            className="flex items-center gap-2 justify-center mt-2"
          >
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-base text-muted-foreground">
              {mockBrains.length} unique digital minds available
            </span>
          </motion.div>
        </div>
      </motion.section>

      {/* Filters */}
      <motion.div
        variants={itemVariants}
        className="border-b border-border/50 bg-muted/30 py-6 md:py-8"
      >
        <motion.div
          className="w-full max-w-4xl mx-auto px-4"
          variants={staggerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="flex flex-col sm:flex-row gap-4 md:gap-6"
            variants={staggerVariants}
          >
            {/* Search */}
            <motion.div variants={itemVariants} className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Input
                  placeholder="Search brains by name, description, tags, or capabilities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </motion.div>
            </motion.div>

            {/* Status Filter */}
            <motion.div variants={itemVariants}>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      All Status ({getStatusCount("all")})
                    </SelectItem>
                    <SelectItem value="online">
                      Online ({getStatusCount("online")})
                    </SelectItem>
                    <SelectItem value="thinking">
                      Thinking ({getStatusCount("thinking")})
                    </SelectItem>
                    <SelectItem value="dreaming">
                      Dreaming ({getStatusCount("dreaming")})
                    </SelectItem>
                    <SelectItem value="offline">
                      Offline ({getStatusCount("offline")})
                    </SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            </motion.div>

            {/* Personality Filter */}
            <motion.div variants={itemVariants}>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Select value={personalityFilter} onValueChange={setPersonalityFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by personality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      All Personalities ({getPersonalityCount("all")})
                    </SelectItem>
                    <SelectItem value="curious">
                      Curious ({getPersonalityCount("curious")})
                    </SelectItem>
                    <SelectItem value="stoic">
                      Stoic ({getPersonalityCount("stoic")})
                    </SelectItem>
                    <SelectItem value="chaotic">
                      Chaotic ({getPersonalityCount("chaotic")})
                    </SelectItem>
                    <SelectItem value="neutral">
                      Neutral ({getPersonalityCount("neutral")})
                    </SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            </motion.div>

            {/* View Mode Buttons */}
            <motion.div variants={itemVariants} className="flex items-center gap-2 md:gap-3">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div
        variants={itemVariants}
        className="w-full max-w-6xl mx-auto px-4 py-12 md:py-16"
      >
        {/* Results Summary */}
        <div className="flex items-center justify-between mb-8 md:mb-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              {filteredBrains.length} of {mockBrains.length} brains available
            </span>
          </div>
          
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              <Search className="w-3 h-3" />
              "{searchQuery}"
            </Badge>
          )}
        </div>

        {/* Brains Grid */}
        <AnimatePresence mode="wait">
          {filteredBrains.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <BrainIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No brains found
              </h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setPersonalityFilter("all");
                }}
              >
                Clear all filters
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10 items-stretch"
                  : "space-y-6"
              }
            >
              {filteredBrains.map((brain, index) => (
                <motion.div
                  key={brain.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="h-full min-w-[320px] max-w-xl w-full mx-auto flex"
                >
                  <BrainCard
                    brain={brain}
                    onSelect={handleBrainSelect}
                    isSelected={selectedBrain?.id === brain.id}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Selection Modal (placeholder for next part) */}
      <AnimatePresence>
        {selectedBrain && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-background rounded-lg p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-lg font-semibold mb-4">
                Connect to {selectedBrain.name}?
              </h3>
              <p className="text-muted-foreground mb-6">
                You're about to start a session with {selectedBrain.name}. This will open the brain's dashboard where you can interact and observe its thoughts.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => setSelectedBrain(null)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleConnectToBrain}
                  className="flex-1"
                >
                  Connect
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {isLoading && <LoadingOverlay message="Loading brain..." />}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mt-16 md:mt-24"
      >
        <Footer />
      </motion.div>
    </div>
  );
} 