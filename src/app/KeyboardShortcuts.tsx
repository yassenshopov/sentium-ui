"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { 
  Keyboard, 
  MessageCircle, 
  Brain, 
  Database, 
  Activity,
  Settings,
  Search,
  Filter,
  Eye,
  Layers,
  Network,
  Radio,
  Zap,
  Target,
  TrendingUp,
  TrendingDown,
  Clock,
  ChevronDown,
  ChevronUp,
  Palette,
  Moon,
  GitBranch,
  X
} from "lucide-react";

interface Shortcut {
  key: string;
  description: string;
  category: string;
  icon: React.ReactNode;
}

const shortcuts: Shortcut[] = [
  // Navigation
  { key: "Ctrl/Cmd + K", description: "Open search", category: "Navigation", icon: <Search className="w-4 h-4" /> },
  { key: "Ctrl/Cmd + 1", description: "Switch to Conversation", category: "Navigation", icon: <MessageCircle className="w-4 h-4" /> },
  { key: "Ctrl/Cmd + 2", description: "Switch to Memories", category: "Navigation", icon: <Database className="w-4 h-4" /> },
  { key: "Ctrl/Cmd + 3", description: "Switch to Thoughts", category: "Navigation", icon: <Brain className="w-4 h-4" /> },
  { key: "Ctrl/Cmd + 4", description: "Switch to Dreams", category: "Navigation", icon: <Moon className="w-4 h-4" /> },
  { key: "Ctrl/Cmd + 5", description: "Switch to Timeline", category: "Navigation", icon: <GitBranch className="w-4 h-4" /> },
  { key: "Ctrl/Cmd + 6", description: "Switch to System", category: "Navigation", icon: <Activity className="w-4 h-4" /> },
  
  // Interaction
  { key: "Enter", description: "Send message", category: "Interaction", icon: <MessageCircle className="w-4 h-4" /> },
  { key: "Shift + Enter", description: "New line in message", category: "Interaction", icon: <MessageCircle className="w-4 h-4" /> },
  { key: "Ctrl/Cmd + Enter", description: "Toggle channel", category: "Interaction", icon: <Zap className="w-4 h-4" /> },
  
  // View Controls
  { key: "Ctrl/Cmd + V", description: "Toggle view style", category: "View", icon: <Eye className="w-4 h-4" /> },
  { key: "Ctrl/Cmd + F", description: "Toggle filters", category: "View", icon: <Filter className="w-4 h-4" /> },
  { key: "Ctrl/Cmd + L", description: "Toggle layout", category: "View", icon: <Layers className="w-4 h-4" /> },
  
  // Brain Controls
  { key: "Ctrl/Cmd + P", description: "Change personality", category: "Brain", icon: <Brain className="w-4 h-4" /> },
  { key: "Ctrl/Cmd + T", description: "Generate thought", category: "Brain", icon: <Target className="w-4 h-4" /> },
  { key: "Ctrl/Cmd + M", description: "Show memories", category: "Brain", icon: <Database className="w-4 h-4" /> },
  
  // System
  { key: "Ctrl/Cmd + S", description: "System settings", category: "System", icon: <Settings className="w-4 h-4" /> },
  { key: "Ctrl/Cmd + H", description: "Show this help", category: "System", icon: <Keyboard className="w-4 h-4" /> },
  { key: "Escape", description: "Close dialogs", category: "System", icon: <X className="w-4 h-4" /> },
];

const categories = ["Navigation", "Interaction", "View", "Brain", "System"];

export default function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + H to open shortcuts
      if ((event.ctrlKey || event.metaKey) && event.key === 'h') {
        event.preventDefault();
        setIsOpen(true);
      }
      
      // Escape to close
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const filteredShortcuts = selectedCategory === "all" 
    ? shortcuts 
    : shortcuts.filter(s => s.category === selectedCategory);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="fixed bottom-4 right-4 z-50 opacity-60 hover:opacity-100 transition-opacity hidden md:flex"
          onClick={() => setIsOpen(true)}
        >
          <Keyboard className="w-4 h-4 mr-2" />
          Shortcuts
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-full">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              All
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          
          {/* Shortcuts List */}
          <div className="flex-1 overflow-y-auto space-y-2">
            <AnimatePresence mode="wait">
              {filteredShortcuts.map((shortcut, index) => (
                <motion.div
                  key={shortcut.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      {shortcut.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{shortcut.description}</p>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {shortcut.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {shortcut.key.split(' + ').map((key, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && <span className="text-muted-foreground">+</span>}
                        <kbd className="px-2 py-1 text-xs font-mono bg-background border rounded shadow-sm">
                          {key}
                        </kbd>
                      </React.Fragment>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Footer */}
          <div className="border-t pt-4 mt-4 text-xs text-muted-foreground">
            <p>💡 Tip: Press <kbd className="px-1 py-0.5 bg-muted border rounded text-xs">Ctrl/Cmd + H</kbd> anytime to open this help</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 