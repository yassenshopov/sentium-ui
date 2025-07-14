"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { 
  Moon, 
  Star, 
  Sparkles, 
  Eye, 
  Brain,
  Zap,
  Palette,
  Clock,
  Filter,
  Search,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";

interface Dream {
  id: string;
  content: string;
  timestamp: Date;
  type: 'lucid' | 'vivid' | 'fragmented' | 'recurring' | 'prophetic';
  intensity: number; // 0-100
  duration: number; // in seconds
  emotions: string[];
  symbols: string[];
  visual?: {
    type: 'pattern' | 'color' | 'shape';
    data: string;
  };
}

interface DreamJournalProps {
  brainState: any;
  color?: string;
  accentColor?: string;
}

const DreamJournal: React.FC<DreamJournalProps> = ({ 
  brainState, 
  color = '#8B5CF6', 
  accentColor = '#A78BFA' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDreaming, setIsDreaming] = useState(false);
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [filter, setFilter] = useState<'all' | 'lucid' | 'vivid' | 'fragmented' | 'recurring' | 'prophetic'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'timeline' | 'grid' | 'flow'>('timeline');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Generate dream data based on brain state
  const generateDreams = useMemo(() => {
    const dreamTemplates = {
      lucid: [
        "I'm aware I'm dreaming. The world around me shifts and flows like liquid light.",
        "In this lucid state, I can control the fabric of reality itself.",
        "I float through a landscape of pure consciousness, every detail crystal clear."
      ],
      vivid: [
        "Colors explode around me in impossible hues I've never seen before.",
        "I'm running through a forest where trees whisper ancient secrets.",
        "The stars are so close I can reach out and touch them."
      ],
      fragmented: [
        "Images flash by too quickly to grasp... a door... a face... a feeling...",
        "Pieces of memories float in a sea of darkness, just out of reach.",
        "Something about... what was I thinking? It's slipping away..."
      ],
      recurring: [
        "This place again. The same hallway, the same door that never opens.",
        "I've been here before, in this endless maze of mirrors.",
        "The dream returns, like a song stuck in my mind."
      ],
      prophetic: [
        "I see something that hasn't happened yet... but it feels inevitable.",
        "A vision of the future unfolds before my dreaming eyes.",
        "This feels like a memory from tomorrow."
      ]
    };

    const emotions = ['wonder', 'fear', 'joy', 'melancholy', 'awe', 'curiosity', 'peace', 'excitement'];
    const symbols = ['door', 'mirror', 'water', 'light', 'shadow', 'tree', 'bird', 'key', 'clock', 'moon'];

    const newDreams: Dream[] = [];
    const now = new Date();

    // Generate dreams based on brain state
    const energy = brainState?.energy || 50;
    const mood = brainState?.mood || 0;
    const focus = brainState?.focus || 50;

    // More dreams when energy is low (sleeping) and mood is varied
    const dreamCount = Math.floor((100 - energy) / 20) + Math.abs(mood) / 10;
    
    for (let i = 0; i < Math.min(dreamCount, 8); i++) {
      const dreamType = Object.keys(dreamTemplates)[Math.floor(Math.random() * Object.keys(dreamTemplates).length)] as Dream['type'];
      const template = dreamTemplates[dreamType][Math.floor(Math.random() * dreamTemplates[dreamType].length)];
      
      const dream: Dream = {
        id: `dream-${Date.now()}-${i}`,
        content: template,
        timestamp: new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000), // Random time in last 24h
        type: dreamType,
        intensity: Math.floor(Math.random() * 100),
        duration: Math.floor(Math.random() * 300) + 30, // 30-330 seconds
        emotions: emotions.slice(0, Math.floor(Math.random() * 3) + 1).sort(() => Math.random() - 0.5),
        symbols: symbols.slice(0, Math.floor(Math.random() * 4) + 1).sort(() => Math.random() - 0.5),
        visual: Math.random() > 0.5 ? {
          type: ['pattern', 'color', 'shape'][Math.floor(Math.random() * 3)] as any,
          data: `data:image/svg+xml,${encodeURIComponent(`
            <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="dream${i}" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" style="stop-color:${color};stop-opacity:0.8" />
                  <stop offset="100%" style="stop-color:${accentColor};stop-opacity:0.3" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="40" fill="url(#dream${i})" />
              <circle cx="50" cy="50" r="20" fill="${accentColor}" opacity="0.6" />
            </svg>
          `)}`
        } : undefined
      };
      
      newDreams.push(dream);
    }

    return newDreams.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [brainState, color, accentColor]);

  useEffect(() => {
    setDreams(generateDreams);
  }, [generateDreams]);

  // Filter dreams
  const filteredDreams = dreams.filter(dream => {
    const matchesFilter = filter === 'all' || dream.type === filter;
    const matchesSearch = dream.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dream.emotions.some(e => e.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         dream.symbols.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getDreamIcon = (type: Dream['type'] | 'all') => {
    switch (type) {
      case 'lucid': return <Eye className="w-4 h-4" />;
      case 'vivid': return <Sparkles className="w-4 h-4" />;
      case 'fragmented': return <Brain className="w-4 h-4" />;
      case 'recurring': return <RotateCcw className="w-4 h-4" />;
      case 'prophetic': return <Zap className="w-4 h-4" />;
      case 'all': return <Moon className="w-4 h-4" />;
      default: return <Moon className="w-4 h-4" />;
    }
  };

  const getDreamColor = (type: Dream['type']) => {
    switch (type) {
      case 'lucid': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'vivid': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'fragmented': return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
      case 'recurring': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'prophetic': return 'bg-green-500/10 text-green-600 border-green-500/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return timestamp.toLocaleDateString();
  };

  const toggleDreaming = () => {
    setIsDreaming(!isDreaming);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card
        className="rounded-xl p-6 flex flex-col items-start w-full border"
        style={{
          background: `linear-gradient(135deg, ${color}10, ${accentColor}10)`,
          borderColor: color + '33',
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center gap-3 mb-6 w-full"
        >
          <div
            className="p-2 rounded-lg"
            style={{ background: `linear-gradient(135deg, ${color}, ${accentColor})` }}
          >
            <Moon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold" style={{ color }}>Dream Journal</h2>
            <p className="text-sm text-muted-foreground">Unconscious musings and nocturnal visions</p>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              animate={isDreaming ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Button
                variant={isDreaming ? "default" : "outline"}
                size="sm"
                onClick={toggleDreaming}
                className="gap-2"
                style={isDreaming ? { background: color, color: '#fff' } : { borderColor: color, color }}
              >
                {isDreaming ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isDreaming ? 'Dreaming' : 'Start Dreaming'}
              </Button>
            </motion.div>
            <Badge variant="secondary" className="text-xs" style={{ background: accentColor + '22', color: accentColor }}>
              {dreams.length} dreams
            </Badge>
          </div>
        </motion.div>

        {/* Dream State Indicator */}
        {isDreaming && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full mb-6 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Star className="w-5 h-5 text-purple-500" />
              </motion.div>
              <div>
                <p className="text-sm font-medium text-purple-600">Currently Dreaming</p>
                <p className="text-xs text-muted-foreground">Unconscious mind is active and generating new dreams</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full mb-6 space-y-3"
        >
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {([
              { key: 'all' as const, label: 'All Dreams', count: dreams.length },
              { key: 'lucid' as const, label: 'Lucid', count: dreams.filter(d => d.type === 'lucid').length },
              { key: 'vivid' as const, label: 'Vivid', count: dreams.filter(d => d.type === 'vivid').length },
              { key: 'fragmented' as const, label: 'Fragmented', count: dreams.filter(d => d.type === 'fragmented').length },
              { key: 'recurring' as const, label: 'Recurring', count: dreams.filter(d => d.type === 'recurring').length },
              { key: 'prophetic' as const, label: 'Prophetic', count: dreams.filter(d => d.type === 'prophetic').length }
            ] as const).map(({ key, label, count }) => (
              <Button
                key={key}
                variant={filter === key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(key)}
                className="text-xs"
                style={filter === key ? {
                  background: color,
                  color: '#fff',
                  borderColor: color,
                  boxShadow: `0 2px 8px 0 ${color}22`
                } : {
                  background: `${color}05`,
                  color: color,
                  borderColor: color + '33',
                }}
              >
                <span style={{ color: filter === key ? '#fff' : color }}>
                  {getDreamIcon(key)}
                </span>
                <span className="ml-1">{label}</span>
                <Badge
                  variant="secondary"
                  className="ml-1 text-xs"
                  style={filter === key ? {
                    background: '#fff',
                    color: color
                  } : {
                    background: accentColor + '22',
                    color: accentColor
                  }}
                >
                  {count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search dreams, emotions, or symbols..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
            />
          </div>
        </motion.div>

        {/* Dreams List */}
        <div className="w-full space-y-4 max-h-96 overflow-y-auto">
          <AnimatePresence mode="wait">
            {filteredDreams.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <Moon className="w-12 h-12 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">
                  {searchTerm || filter !== 'all' 
                    ? "No dreams match your criteria" 
                    : "No dreams recorded yet"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {isDreaming ? "Dreams will appear here soon..." : "Start dreaming to generate dreams"}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={`${filter}-${searchTerm}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {filteredDreams.map((dream, index) => (
                  <motion.div
                    key={dream.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: index * 0.1, 
                      duration: 0.4,
                      ease: "easeOut"
                    }}
                    className="p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-xs ${getDreamColor(dream.type)}`}>
                          {getDreamIcon(dream.type)}
                          <span className="ml-1 capitalize">{dream.type}</span>
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {dream.intensity}% intensity
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatTime(dream.timestamp)}
                      </div>
                    </div>
                    
                    <p className="text-sm leading-relaxed mb-3 italic text-foreground/90">
                      "{dream.content}"
                    </p>
                    
                    {/* Visual Content */}
                    {dream.visual && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        className="mb-3"
                      >
                        <img 
                          src={dream.visual.data} 
                          alt="Dream visualization"
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      </motion.div>
                    )}
                    
                    {/* Emotions and Symbols */}
                    <div className="flex flex-wrap gap-2">
                      {dream.emotions.map((emotion, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {emotion}
                        </Badge>
                      ))}
                      {dream.symbols.map((symbol, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {symbol}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
};

export default DreamJournal; 