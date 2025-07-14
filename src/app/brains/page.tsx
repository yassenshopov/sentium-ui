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
import { Card } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { 
  Search, 
  Grid3X3, 
  List,
  Brain as BrainIcon,
  Sparkles,
  MessageSquare,
  HardDrive,
  Clock,
  Zap,
  Lightbulb,
  Palette,
  Eye,
  Moon,
  Building2,
  Heart,
  Sun,
  Snowflake,
  Flame,
  Leaf,
  Clapperboard
} from "lucide-react";
import { useRouter } from "next/navigation";
import LoadingOverlay from "../../components/ui/LoadingOverlay";

// Brain List Item Component for list view
const BrainListItem: React.FC<{
  brain: Brain;
  onSelect: (brain: Brain) => void;
  isSelected?: boolean;
}> = ({ brain, onSelect, isSelected = false }) => {
  const formatUptime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  const getStatusColor = (status: Brain['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'thinking':
        return 'bg-blue-500';
      case 'dreaming':
        return 'bg-purple-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Brain['status']) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'thinking':
        return 'Thinking';
      case 'dreaming':
        return 'Dreaming';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  // Get the icon component from the map, fallback to BrainIcon
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
  const LucideIcon = brain.icon && iconMap[brain.icon] ? iconMap[brain.icon] : BrainIcon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <Card 
        className={`relative cursor-pointer transition-all duration-200 w-full p-4 ${
          isSelected 
            ? 'ring-2 ring-primary shadow-lg bg-primary/5' 
            : 'hover:shadow-md hover:ring-1 hover:ring-border'
        }`}
        onClick={() => onSelect(brain)}
      >
        <div className="flex items-center gap-4">
          {/* Icon and Status */}
          <div className="flex-shrink-0 relative">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ 
                backgroundColor: brain.color + '20',
                color: brain.color 
              }}
            >
              <LucideIcon className="w-6 h-6" />
            </div>
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(brain.status)}`} />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-lg truncate">{brain.name}</h3>
              <Badge 
                variant="secondary" 
                className="text-xs"
                style={{ 
                  backgroundColor: brain.accentColor + '20',
                  color: brain.accentColor 
                }}
              >
                {brain.personality}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(brain.status)}`} />
                <span>{getStatusText(brain.status)}</span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {brain.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {brain.tags.slice(0, 4).map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs"
                >
                  {tag}
                </Badge>
              ))}
              {brain.tags.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{brain.tags.length - 4}
                </Badge>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex-shrink-0 flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="flex items-center gap-1 text-muted-foreground">
                <MessageSquare className="w-3 h-3" />
                <span className="font-medium">{brain.thoughtCount.toLocaleString()}</span>
              </div>
              <div className="text-xs text-muted-foreground">Thoughts</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center gap-1 text-muted-foreground">
                <HardDrive className="w-3 h-3" />
                <span className="font-medium">{brain.memoryCount.toLocaleString()}</span>
              </div>
              <div className="text-xs text-muted-foreground">Memories</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span className="font-medium">{formatUptime(brain.uptime)}</span>
              </div>
              <div className="text-xs text-muted-foreground">Uptime</div>
            </div>

            {/* Current State */}
            {brain.currentState && (
              <div className="text-center">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  <span className="font-medium">{brain.currentState.energy}%</span>
                </div>
                <div className="text-xs text-muted-foreground">Energy</div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

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
            className="flex flex-col sm:flex-row flex-wrap gap-x-4 gap-y-2 md:gap-x-6 md:gap-y-3"
            variants={staggerVariants}
          >
            {/* Search */}
            <motion.div variants={itemVariants} className="relative flex-1 min-w-[160px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Input
                  placeholder="Search brains by name, description, tags, or capabilities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full min-w-[160px] truncate"
                />
              </motion.div>
            </motion.div>

            {/* Status Filter */}
            <motion.div variants={itemVariants} className="min-w-[140px] w-full sm:w-auto">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="min-w-[140px] w-full truncate">
                    <SelectValue placeholder="Filter by status" className="truncate" />
                  </SelectTrigger>
                  <SelectContent className="min-w-[140px]">
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
            <motion.div variants={itemVariants} className="min-w-[140px] w-full sm:w-auto">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Select value={personalityFilter} onValueChange={setPersonalityFilter}>
                  <SelectTrigger className="min-w-[140px] w-full truncate">
                    <SelectValue placeholder="Filter by personality" className="truncate" />
                  </SelectTrigger>
                  <SelectContent className="min-w-[140px]">
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
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch"
                  : "space-y-4"
              }
            >
              {filteredBrains.map((brain, index) => (
                <motion.div
                  key={brain.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={viewMode === "grid" ? "min-w-0 w-full h-full flex" : "w-full"}
                >
                  {viewMode === "grid" ? (
                    <BrainCard
                      brain={brain}
                      onSelect={handleBrainSelect}
                      isSelected={selectedBrain?.id === brain.id}
                    />
                  ) : (
                    <BrainListItem
                      brain={brain}
                      onSelect={handleBrainSelect}
                      isSelected={selectedBrain?.id === brain.id}
                    />
                  )}
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