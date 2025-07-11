import React, { useState } from "react";
import { Thought } from "../../lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import ThoughtCard from "./ThoughtCard";
import { 
  Brain, 
  Filter, 
  Search, 
  Eye,
  Network,
  Radio,
  Layers
} from "lucide-react";

interface ThoughtProcessPanelProps {
  thoughts: Thought[];
}

type ViewStyle = 'streaming' | 'neural' | 'waveform' | 'cards';

const ThoughtProcessPanel: React.FC<ThoughtProcessPanelProps> = ({
  thoughts
}) => {
  const [viewStyle, setViewStyle] = useState<ViewStyle>('streaming');
  const [showSearch, setShowSearch] = useState(false);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [currentSearch, setCurrentSearch] = useState("");

  const viewStyles = [
    { id: 'streaming', label: 'Streaming', icon: Eye, description: 'Real-time text flow' },
    { id: 'neural', label: 'Neural', icon: Network, description: 'Network visualization' },
    { id: 'waveform', label: 'Waveform', icon: Radio, description: 'Audio-like patterns' },
    { id: 'cards', label: 'Cards', icon: Layers, description: 'Traditional cards' }
  ] as const;

  const filters = [
    { id: "all", label: "All Thoughts", count: thoughts.length },
    { id: "reflection", label: "Reflections", count: thoughts.filter(t => t.type === 'reflection').length },
    { id: "analysis", label: "Analysis", count: thoughts.filter(t => t.type === 'analysis').length },
    { id: "wonder", label: "Wonder", count: thoughts.filter(t => t.type === 'wonder').length },
    { id: "realization", label: "Realizations", count: thoughts.filter(t => t.type === 'realization').length },
    { id: "question", label: "Questions", count: thoughts.filter(t => t.type === 'question').length }
  ];

  const filteredThoughts = thoughts.filter(thought => {
    const matchesFilter = currentFilter === "all" || thought.type === currentFilter;
    const matchesSearch = !currentSearch || 
      thought.content.toLowerCase().includes(currentSearch.toLowerCase()) ||
      (thought.type && thought.type.toLowerCase().includes(currentSearch.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Thought Process</CardTitle>
              <p className="text-sm text-muted-foreground">
                Internal monologue and cognitive patterns
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
            className="cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>

        {/* View Style Selector */}
        <div className="flex items-center gap-2 mt-4">
          <span className="text-xs font-medium text-muted-foreground">View:</span>
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            {viewStyles.map((style) => {
              const Icon = style.icon;
              return (
                <Button
                  key={style.id}
                  variant={viewStyle === style.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewStyle(style.id)}
                  className="h-8 px-3 text-xs cursor-pointer"
                  title={style.description}
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {style.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                  <input
                    type="text"
                    placeholder="Search thoughts..."
                    value={currentSearch}
                    onChange={(e) => setCurrentSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={currentFilter === filter.id ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentFilter(filter.id)}
              className="flex-shrink-0 cursor-pointer"
            >
              <Filter className="w-3 h-3 mr-1" />
              {filter.label}
              <Badge variant="secondary" className="ml-1 text-xs">
                {filter.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Thoughts Container */}
        <div className="space-y-4 overflow-y-auto h-full pr-2">
          <AnimatePresence mode="wait">
            {filteredThoughts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <Brain className="w-12 h-12 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">
                  {currentSearch || currentFilter !== "all" 
                    ? "No thoughts match your criteria" 
                    : "No thoughts yet"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  The brain will start thinking soon...
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={`${viewStyle}-${currentFilter}-${currentSearch}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {filteredThoughts.map((thought, index) => (
                  <motion.div
                    key={thought.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: index * 0.1, 
                      duration: 0.4,
                      ease: "easeOut"
                    }}
                  >
                    <ThoughtCard 
                      thought={thought} 
                      viewStyle={viewStyle}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThoughtProcessPanel; 