import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainActivity } from "../../lib/types";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { 
  Brain, 
  MessageCircle, 
  Database, 
  Sparkles, 
  Clock,
  Search
} from "lucide-react";
import ThoughtCard from "./ThoughtCard";

interface MemoryPanelProps {
  brainActivity: BrainActivity[];
  color?: string;
  accentColor?: string;
}

const MemoryPanel: React.FC<MemoryPanelProps> = ({ brainActivity, color = '#3B82F6', accentColor = '#60A5FA' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [filter, setFilter] = useState<'all' | 'thought' | 'memory' | 'response'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const filteredActivity = brainActivity.filter(activity => {
    const matchesFilter = filter === 'all' || activity.type === filter;
    const matchesSearch = activity.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getActivityIcon = (type: BrainActivity['type']) => {
    switch (type) {
      case 'thought':
        return <Brain className="w-4 h-4" />;
      case 'memory':
        return <Database className="w-4 h-4" />;
      case 'response':
        return <MessageCircle className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: BrainActivity['type']) => {
    switch (type) {
      case 'thought':
        return `background-color: ${color}10; color: ${color}; border-color: ${color}20;`;
      case 'memory':
        return `background-color: ${accentColor}10; color: ${accentColor}; border-color: ${accentColor}20;`;
      case 'response':
        return `background-color: ${color}10; color: ${color}; border-color: ${color}20;`;
      default:
        return `background-color: ${accentColor}10; color: ${accentColor}; border-color: ${accentColor}20;`;
    }
  };

  const formatTime = (timestamp: Date | string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card className="rounded-xl p-6 flex flex-col items-start w-full bg-gradient-to-br from-background to-secondary dark:from-background dark:to-secondary border">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center gap-3 mb-6 w-full"
        >
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">
              Brain Activity
            </h2>
            <p className="text-sm text-muted-foreground">
              Thoughts, memories, and responses
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {brainActivity.length} total
          </Badge>
        </motion.div>

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
              { key: 'all' as const, label: 'All', count: brainActivity.length },
              { key: 'thought' as const, label: 'Thoughts', count: brainActivity.filter(a => a.type === 'thought').length },
              { key: 'memory' as const, label: 'Memories', count: brainActivity.filter(a => a.type === 'memory').length },
              { key: 'response' as const, label: 'Responses', count: brainActivity.filter(a => a.type === 'response').length }
            ] as const).map(({ key, label, count }) => (
              <Button
                key={key}
                variant={filter === key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(key)}
                className="text-xs"
              >
                {key === 'all' ? <Sparkles className="w-4 h-4" /> : getActivityIcon(key as BrainActivity['type'])}
                <span className="ml-1">{label}</span>
                <Badge variant="secondary" className="ml-1 text-xs">
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
              placeholder="Search brain activity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
            />
          </div>
        </motion.div>

        {/* Activity List */}
        <div className="w-full space-y-4 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {filteredActivity.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-muted-foreground"
              >
                <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">
                  {searchTerm ? 'No activity matches your search' : 'No brain activity yet'}
                </p>
                <p className="text-xs mt-1">
                  {searchTerm ? 'Try adjusting your search terms' : 'The brain will start thinking soon...'}
                </p>
              </motion.div>
            ) : (
              filteredActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05, duration: 0.5 }}
                  className="relative"
                >
                  {/* Activity Type Badge */}
                  <div className="absolute -top-2 -left-2 z-10">
                    <Badge 
                      variant="outline" 
                      className={`text-xs border ${getActivityColor(activity.type)}`}
                    >
                      {getActivityIcon(activity.type)}
                      <span className="ml-1 capitalize">{activity.type}</span>
                    </Badge>
                  </div>

                  {/* Activity Card */}
                  <div className="relative">
                    <ThoughtCard
                      thought={{
                        id: activity.id,
                        content: activity.content,
                        timestamp: activity.timestamp,
                        type: activity.subtype as 'reflection' | 'analysis' | 'wonder' | 'realization' | 'question',
                        metadata: activity.metadata,
                        visual: activity.visual
                      }}
                      color={color}
                      accentColor={accentColor}
                    />
                    
                    {/* Additional Info for Different Types */}
                    <div className="mt-2 ml-4 space-y-1">
                      {activity.type === 'memory' && activity.importance && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Importance: {activity.importance}/100</span>
                          {activity.associations && activity.associations.length > 0 && (
                            <span>• Related: {activity.associations.slice(0, 2).join(', ')}</span>
                          )}
                        </div>
                      )}
                      
                      {activity.type === 'response' && activity.inResponseTo && (
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">In response to:</span> &quot;{activity.inResponseTo}&quot;
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(activity.timestamp)}</span>
                        {activity.metadata && (
                          <>
                            <span>• Energy: {activity.metadata.energy}%</span>
                            <span>• Focus: {activity.metadata.focus}%</span>
                            <span>• Mood: {activity.metadata.mood}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Activity Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="w-full mt-6 pt-4 border-t border-border/50"
        >
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Showing {filteredActivity.length} of {brainActivity.length} activities</span>
              {filter !== 'all' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilter('all')}
                  className="text-xs h-6"
                >
                  Clear filter
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>Real-time updates</span>
            </div>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default MemoryPanel; 