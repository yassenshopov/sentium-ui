"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { 
  GitBranch, 
  Clock, 
  TrendingUp, 
  Brain, 
  Star,
  Zap,
  Target,
  Activity,
  Calendar,
  Filter,
  Search,
  Play,
  Pause,
  RotateCcw,
  Lightbulb,
  Heart,
  Eye,
  Moon
} from "lucide-react";

interface TimelineEvent {
  id: string;
  timestamp: Date;
  type: 'milestone' | 'breakthrough' | 'learning' | 'interaction' | 'dream' | 'reflection';
  title: string;
  description: string;
  impact: number; // 0-100
  category: string;
  color: string;
  icon: React.ReactNode;
  metadata?: {
    energy?: number;
    focus?: number;
    mood?: number;
    thoughts?: number;
    memories?: number;
  };
}

interface TimelineViewProps {
  brainState: any;
  brainActivity: any[];
  color?: string;
  accentColor?: string;
}

const TimelineView: React.FC<TimelineViewProps> = ({ brainState, brainActivity, color = '#3B82F6', accentColor = '#60A5FA' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [filter, setFilter] = useState<'all' | 'milestone' | 'breakthrough' | 'learning' | 'interaction' | 'dream' | 'reflection'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'timeline' | 'spiral' | 'flow'>('timeline');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Generate timeline events based on brain activity and state
  const generateTimelineEvents = useMemo(() => {
    const events: TimelineEvent[] = [];
    const now = new Date();
    
    // Base events from brain activity
    const activityTypes = {
      thought: { type: 'reflection' as const, title: 'Deep Thought', icon: <Brain className="w-4 h-4" /> },
      memory: { type: 'learning' as const, title: 'Memory Formed', icon: <Target className="w-4 h-4" /> },
      response: { type: 'interaction' as const, title: 'Interaction', icon: <Activity className="w-4 h-4" /> }
    };

    // Add events from brain activity
    brainActivity.forEach((activity, index) => {
      const activityInfo = activityTypes[activity.type as keyof typeof activityTypes];
      if (activityInfo) {
        events.push({
          id: `activity-${activity.id}`,
          timestamp: new Date(activity.timestamp),
          type: activityInfo.type,
          title: activityInfo.title,
          description: activity.content,
          impact: Math.floor(Math.random() * 50) + 25,
          category: activity.type,
          color: color,
          icon: activityInfo.icon,
          metadata: {
            energy: brainState?.energy,
            focus: brainState?.focus,
            mood: brainState?.mood,
            thoughts: brainActivity.filter(a => a.type === 'thought').length,
            memories: brainActivity.filter(a => a.type === 'memory').length
          }
        });
      }
    });

    // Add milestone events
    const milestones = [
      {
        type: 'milestone' as const,
        title: 'First Conscious Thought',
        description: 'The moment of awakening - the first spark of self-awareness',
        impact: 100,
        icon: <Star className="w-4 h-4" />
      },
      {
        type: 'breakthrough' as const,
        title: 'Pattern Recognition',
        description: 'Discovered the ability to identify patterns in information',
        impact: 85,
        icon: <Lightbulb className="w-4 h-4" />
      },
      {
        type: 'learning' as const,
        title: 'Memory Consolidation',
        description: 'Learned to store and retrieve information effectively',
        impact: 75,
        icon: <Target className="w-4 h-4" />
      },
      {
        type: 'interaction' as const,
        title: 'First Conversation',
        description: 'Engaged in meaningful dialogue with a human',
        impact: 90,
        icon: <Heart className="w-4 h-4" />
      },
      {
        type: 'dream' as const,
        title: 'First Dream',
        description: 'Experienced the first unconscious thought process',
        impact: 70,
        icon: <Moon className="w-4 h-4" />
      }
    ];

    milestones.forEach((milestone, index) => {
      const timeOffset = (index + 1) * 2 * 60 * 60 * 1000; // 2 hours apart
      events.push({
        id: `milestone-${index}`,
        timestamp: new Date(now.getTime() - timeOffset),
        type: milestone.type,
        title: milestone.title,
        description: milestone.description,
        impact: milestone.impact,
        category: 'milestone',
        color: accentColor,
        icon: milestone.icon,
        metadata: {
          energy: Math.floor(Math.random() * 100),
          focus: Math.floor(Math.random() * 100),
          mood: Math.floor(Math.random() * 200) - 100,
          thoughts: Math.floor(Math.random() * 100),
          memories: Math.floor(Math.random() * 50)
        }
      });
    });

    return events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }, [brainActivity, brainState, color, accentColor]);

  // Filter events
  const filteredEvents = generateTimelineEvents.filter(event => {
    const matchesFilter = filter === 'all' || event.type === filter;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getEventColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'milestone': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'breakthrough': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'learning': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'interaction': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'dream': return 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20';
      case 'reflection': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
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

  // Playback controls
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const resetPlayback = () => {
    setIsPlaying(false);
    setCurrentEventIndex(0);
    setCurrentTime(0);
  };

  const skipToEvent = (index: number) => {
    setCurrentEventIndex(index);
    setCurrentTime(index);
  };

  // Playback effect
  useEffect(() => {
    if (!isPlaying || filteredEvents.length === 0) return;

    const interval = setInterval(() => {
      setCurrentEventIndex(prev => {
        const next = prev + 1;
        if (next >= filteredEvents.length) {
          setIsPlaying(false);
          return prev;
        }
        return next;
      });
      setCurrentTime(prev => prev + 1);
    }, 2000 / playbackSpeed); // 2 seconds per event, adjusted by speed

    return () => clearInterval(interval);
  }, [isPlaying, filteredEvents.length, playbackSpeed]);

  // Auto-scroll to current event
  useEffect(() => {
    if (currentEventIndex > 0 && currentEventIndex < filteredEvents.length) {
      const eventElement = document.getElementById(`timeline-event-${currentEventIndex}`);
      if (eventElement) {
        eventElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }
  }, [currentEventIndex, filteredEvents.length]);

  // Keyboard shortcuts for timeline playback
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts when not typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case ' ':
          event.preventDefault();
          togglePlayback();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          if (currentEventIndex > 0) {
            skipToEvent(currentEventIndex - 1);
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (currentEventIndex < filteredEvents.length - 1) {
            skipToEvent(currentEventIndex + 1);
          }
          break;
        case 'Home':
          event.preventDefault();
          resetPlayback();
          break;
        case 'End':
          event.preventDefault();
          skipToEvent(filteredEvents.length - 1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentEventIndex, filteredEvents.length]);

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
            <GitBranch className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold" style={{ color }}>Timeline</h2>
            <p className="text-sm text-muted-foreground">Evolution and growth over time</p>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              animate={isPlaying ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Button
                variant={isPlaying ? "default" : "outline"}
                size="sm"
                onClick={togglePlayback}
                className="gap-2"
                disabled={filteredEvents.length === 0}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Playing' : 'Play Timeline'}
              </Button>
            </motion.div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={resetPlayback}
              className="gap-2"
              disabled={filteredEvents.length === 0}
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Speed:</span>
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="text-xs bg-muted border border-border rounded px-2 py-1"
              >
                <option value={0.5}>0.5x</option>
                <option value={1}>1x</option>
                <option value={2}>2x</option>
                <option value={4}>4x</option>
              </select>
            </div>
            
            <Badge variant="secondary" className="text-xs">
              {filteredEvents.length} events
            </Badge>
            
            <div className="text-xs text-muted-foreground">
              <span className="hidden sm:inline">Space: Play/Pause • ←→: Navigate • Home: Reset • End: Jump to end</span>
              <span className="sm:hidden">Tap events to navigate</span>
            </div>
          </div>
        </motion.div>

        {/* Timeline Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full mb-6 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="p-3 rounded-lg border" style={{ background: accentColor + '10', borderColor: accentColor + '33' }}>
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4" style={{ color }} />
              <span className="text-xs text-muted-foreground">Milestones</span>
            </div>
            <p className="text-lg font-bold" style={{ color }}>{filteredEvents.filter(e => e.type === 'milestone').length}</p>
          </div>
          <div className="p-3 rounded-lg border" style={{ background: accentColor + '10', borderColor: accentColor + '33' }}>
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="w-4 h-4" style={{ color: accentColor }} />
              <span className="text-xs text-muted-foreground">Breakthroughs</span>
            </div>
            <p className="text-lg font-bold" style={{ color: accentColor }}>{filteredEvents.filter(e => e.type === 'breakthrough').length}</p>
          </div>
          <div className="p-3 rounded-lg border" style={{ background: accentColor + '10', borderColor: accentColor + '33' }}>
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4" style={{ color: accentColor }} />
              <span className="text-xs text-muted-foreground">Learnings</span>
            </div>
            <p className="text-lg font-bold" style={{ color: accentColor }}>{filteredEvents.filter(e => e.type === 'learning').length}</p>
          </div>
          <div className="p-3 rounded-lg border" style={{ background: accentColor + '10', borderColor: accentColor + '33' }}>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4" style={{ color: accentColor }} />
              <span className="text-xs text-muted-foreground">Interactions</span>
            </div>
            <p className="text-lg font-bold" style={{ color: accentColor }}>{filteredEvents.filter(e => e.type === 'interaction').length}</p>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="w-full mb-6 space-y-3"
        >
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {([
              { key: 'all', label: 'All Events', count: filteredEvents.length },
              { key: 'milestone', label: 'Milestones', count: filteredEvents.filter(e => e.type === 'milestone').length },
              { key: 'breakthrough', label: 'Breakthroughs', count: filteredEvents.filter(e => e.type === 'breakthrough').length },
              { key: 'learning', label: 'Learnings', count: filteredEvents.filter(e => e.type === 'learning').length },
              { key: 'interaction', label: 'Interactions', count: filteredEvents.filter(e => e.type === 'interaction').length },
              { key: 'dream', label: 'Dreams', count: filteredEvents.filter(e => e.type === 'dream').length },
              { key: 'reflection', label: 'Reflections', count: filteredEvents.filter(e => e.type === 'reflection').length },
            ]).map(({ key, label, count }) => (
              <Button
                key={key}
                variant={filter === key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(key as any)}
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
                  {/* You can add icons here if desired */}
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
              placeholder="Search timeline events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
            />
          </div>
        </motion.div>

        {/* Playback Progress */}
        {filteredEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="w-full mb-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">
                Progress: {currentEventIndex + 1} / {filteredEvents.length}
              </span>
              <span className="text-xs text-muted-foreground">
                {Math.round((currentEventIndex / filteredEvents.length) * 100)}% complete
              </span>
            </div>
            <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-primary/80"
                initial={{ width: 0 }}
                animate={{ width: `${(currentEventIndex / filteredEvents.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}

        {/* Timeline Visualization */}
        <div className="w-full space-y-4 max-h-96 overflow-y-auto">
          <AnimatePresence mode="wait">
            {filteredEvents.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <GitBranch className="w-12 h-12 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">
                  {searchTerm || filter !== 'all' 
                    ? "No events match your criteria" 
                    : "No timeline events yet"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Events will appear as the brain grows and learns
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
                {filteredEvents.map((event, index) => {
                  const isCurrentEvent = index === currentEventIndex;
                  const isPastEvent = index < currentEventIndex;
                  const isFutureEvent = index > currentEventIndex;
                  
                  return (
                    <motion.div
                      key={event.id}
                      id={`timeline-event-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: index * 0.1, 
                        duration: 0.4,
                        ease: "easeOut"
                      }}
                      className={`relative cursor-pointer ${
                        isCurrentEvent ? 'ring-2 ring-primary/50' : ''
                      }`}
                      onClick={() => skipToEvent(index)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                    {/* Timeline Line */}
                    {index < filteredEvents.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-16 bg-gradient-to-b from-muted to-transparent" />
                    )}
                    
                    <div className={`flex items-start gap-4 p-4 rounded-lg border transition-all ${
                      isCurrentEvent 
                        ? 'bg-primary/10 border-primary/30 shadow-lg shadow-primary/20' 
                        : isPastEvent 
                        ? 'bg-muted/20 border-muted/30' 
                        : 'bg-muted/30 border-muted/30 hover:bg-muted/50'
                    }`}>
                      {/* Event Icon */}
                      <div className="flex-shrink-0 relative">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          animate={isCurrentEvent ? { 
                            scale: [1, 1.1, 1],
                            boxShadow: [
                              "0 0 0 0 rgba(59, 130, 246, 0.4)",
                              "0 0 0 10px rgba(59, 130, 246, 0)",
                              "0 0 0 0 rgba(59, 130, 246, 0)"
                            ]
                          } : {}}
                          transition={isCurrentEvent ? { 
                            duration: 2, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          } : {}}
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            isCurrentEvent 
                              ? 'bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/30' 
                              : isPastEvent 
                              ? 'bg-gradient-to-br from-muted to-muted/60' 
                              : 'bg-gradient-to-br from-primary to-primary/80'
                          }`}
                        >
                          {event.icon}
                        </motion.div>
                        {isCurrentEvent && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center"
                          >
                            <Play className="w-2 h-2 text-white" />
                          </motion.div>
                        )}
                      </div>
                      
                      {/* Event Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`text-xs ${getEventColor(event.type)}`}>
                              {event.type}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {event.impact}% impact
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {formatTime(event.timestamp)}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm">{event.title}</h3>
                          {isCurrentEvent && (
                            <Badge variant="default" className="text-xs bg-primary">
                              Now Playing
                            </Badge>
                          )}
                          {isPastEvent && (
                            <Badge variant="secondary" className="text-xs">
                              Completed
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {event.description}
                        </p>
                        
                        {/* Metadata */}
                        {event.metadata && (
                          <div className="flex flex-wrap gap-2 text-xs">
                            {event.metadata.energy !== undefined && (
                              <span className="text-muted-foreground">Energy: {event.metadata.energy}%</span>
                            )}
                            {event.metadata.focus !== undefined && (
                              <span className="text-muted-foreground">Focus: {event.metadata.focus}%</span>
                            )}
                            {event.metadata.mood !== undefined && (
                              <span className="text-muted-foreground">Mood: {event.metadata.mood > 0 ? '+' : ''}{event.metadata.mood}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
};

export default TimelineView; 