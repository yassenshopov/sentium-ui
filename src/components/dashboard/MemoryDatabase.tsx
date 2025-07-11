import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { 
  Database, 
  Search,
  Star,
  Eye,
  TrendingUp,
  Brain,
  Network,
  Layers,
  Zap
} from "lucide-react";
import { BrainActivity, CanvasData, PatternData } from "../../lib/types";
import VisualRenderer from "../ui/visual-renderer";

interface MemoryDatabaseProps {
  brainActivity: BrainActivity[];
}

interface MemoryNode {
  id: string;
  content: string;
  type: string;
  importance: number;
  associations: string[];
  timestamp: Date;
  accessCount: number;
  lastAccessed: Date;
  visual?: {
    type: 'emoji' | 'canvas' | 'pattern' | 'diagram';
    data: string | CanvasData | PatternData;
    description?: string;
  };
  metadata?: {
    energy?: number;
    focus?: number;
    mood?: number;
  };
}

const MemoryDatabase: React.FC<MemoryDatabaseProps> = ({ brainActivity }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [view, setView] = useState<'table' | 'network' | 'cards'>('table');
  const [filter, setFilter] = useState<'all' | 'experience' | 'fact' | 'conversation' | 'insight' | 'pattern'>('all');
  const [sortBy, setSortBy] = useState<'importance' | 'recent' | 'access'>('importance');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Deterministic function to generate consistent mock data based on activity ID
  const generateMockData = (activityId: string) => {
    // Create a simple hash from the activity ID to generate consistent values
    let hash = 0;
    for (let i = 0; i < activityId.length; i++) {
      const char = activityId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Generate consistent access count (1-20) based on hash
    const accessCount = Math.abs(hash % 20) + 1;
    
    // Generate consistent last accessed time (within last 24 hours) based on hash
    const hoursAgo = Math.abs(hash % 24);
    const minutesAgo = Math.abs((hash * 7) % 60); // Additional variation
    const lastAccessed = new Date(Date.now() - (hoursAgo * 60 * 60 * 1000) - (minutesAgo * 60 * 1000));
    
    return { accessCount, lastAccessed };
  };

  // Convert brain activity to memory nodes with memoization
  const memories = useMemo(() => brainActivity
    .filter(activity => activity.type === 'memory')
    .map(activity => {
      const mockData = generateMockData(activity.id);
      return {
        id: activity.id,
        content: activity.content,
        type: activity.subtype,
        importance: activity.importance || 50,
        associations: activity.associations || [],
        timestamp: new Date(activity.timestamp),
        accessCount: mockData.accessCount,
        lastAccessed: mockData.lastAccessed,
        visual: activity.visual,
        metadata: activity.metadata
      };
    }), [brainActivity]);

  // Filter and sort memories with memoization
  const { filteredMemories, sortedMemories } = useMemo(() => {
    const filtered = memories.filter(memory => {
      const matchesFilter = filter === 'all' || memory.type === filter;
      const matchesSearch = memory.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           memory.associations.some(assoc => assoc.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesFilter && matchesSearch;
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'importance':
          return b.importance - a.importance;
        case 'recent':
          return b.timestamp.getTime() - a.timestamp.getTime();
        case 'access':
          return b.accessCount - a.accessCount;
        default:
          return 0;
      }
    });

    return { filteredMemories: filtered, sortedMemories: sorted };
  }, [memories, filter, searchTerm, sortBy]);

  // Memoize filter counts and connections count
  const { filterCounts, totalConnections } = useMemo(() => {
    const counts = {
      all: memories.length,
      experience: memories.filter(m => m.type === 'experience').length,
      fact: memories.filter(m => m.type === 'fact').length,
      conversation: memories.filter(m => m.type === 'conversation').length,
      insight: memories.filter(m => m.type === 'insight').length,
      pattern: memories.filter(m => m.type === 'pattern').length
    };

    const connections = memories.reduce((sum, m) => sum + m.associations.length, 0);

    return { filterCounts: counts, totalConnections: connections };
  }, [memories]);

  const getMemoryIcon = (type: string) => {
    switch (type) {
      case 'experience':
        return <Eye className="w-4 h-4" />;
      case 'fact':
        return <Database className="w-4 h-4" />;
      case 'conversation':
        return <Network className="w-4 h-4" />;
      case 'insight':
        return <Zap className="w-4 h-4" />;
      case 'pattern':
        return <Layers className="w-4 h-4" />;
      default:
        return <Brain className="w-4 h-4" />;
    }
  };

  const getMemoryColor = (type: string) => {
    switch (type) {
      case 'experience':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'fact':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'conversation':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'insight':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'pattern':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return timestamp.toLocaleDateString();
  };

  const getImportanceColor = (importance: number) => {
    if (importance >= 80) return 'text-red-500';
    if (importance >= 60) return 'text-orange-500';
    if (importance >= 40) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card className="rounded-xl p-6 flex flex-col items-start w-full bg-gradient-to-br from-background to-secondary/20 border">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center gap-3 mb-6 w-full"
        >
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80">
            <Database className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">
              Memory Database
            </h2>
            <p className="text-sm text-muted-foreground">
              Knowledge structure & associations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {memories.length} memories
            </Badge>
            <Badge variant="outline" className="text-xs">
              {totalConnections} connections
            </Badge>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full mb-6 space-y-3"
        >
          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">View:</span>
            <div className="flex bg-muted rounded-lg p-1">
              {[
                { key: 'table', label: 'Table', icon: Database },
                { key: 'network', label: 'Network', icon: Network },
                { key: 'cards', label: 'Cards', icon: Layers }
              ].map(({ key, label, icon: Icon }) => (
                <Button
                  key={key}
                  variant={view === key ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView(key as 'table' | 'network' | 'cards')}
                  className="text-xs h-8"
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-wrap gap-3">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All', count: filterCounts.all },
                { key: 'experience', label: 'Experiences', count: filterCounts.experience },
                { key: 'fact', label: 'Facts', count: filterCounts.fact },
                { key: 'conversation', label: 'Conversations', count: filterCounts.conversation },
                { key: 'insight', label: 'Insights', count: filterCounts.insight },
                { key: 'pattern', label: 'Patterns', count: filterCounts.pattern }
              ].map(({ key, label, count }) => (
                <Button
                  key={key}
                  variant={filter === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(key as 'all' | 'experience' | 'fact' | 'conversation' | 'insight' | 'pattern')}
                  className="text-xs"
                >
                  {getMemoryIcon(key)}
                  <span className="ml-1">{label}</span>
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {count}
                  </Badge>
                </Button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'importance' | 'recent' | 'access')}
                className="text-xs bg-muted border border-border rounded px-2 py-1 cursor-pointer"
              >
                <option value="importance">Importance</option>
                <option value="recent">Recent</option>
                <option value="access">Most Accessed</option>
              </select>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search memories and associations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 cursor-text"
            />
          </div>
        </motion.div>

        {/* Content Area */}
        <div className="w-full">
          {view === 'table' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left p-2 font-medium">Memory</th>
                    <th className="text-left p-2 font-medium">Type</th>
                    <th className="text-left p-2 font-medium">Importance</th>
                    <th className="text-left p-2 font-medium">Associations</th>
                    <th className="text-left p-2 font-medium">Access</th>
                    <th className="text-left p-2 font-medium">Last Accessed</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {sortedMemories.map((memory, index) => (
                      <motion.tr
                        key={memory.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                        className="border-b border-border/20 hover:bg-muted/30 transition-colors cursor-pointer"
                      >
                        <td className="p-2">
                          <div className="max-w-xs">
                            <p className="font-medium truncate">{memory.content.substring(0, 60)}...</p>
                            <p className="text-xs text-muted-foreground">{formatTime(memory.timestamp)}</p>
                          </div>
                        </td>
                        <td className="p-2">
                          <Badge variant="outline" className={`text-xs ${getMemoryColor(memory.type)}`}>
                            {getMemoryIcon(memory.type)}
                            <span className="ml-1 capitalize">{memory.type}</span>
                          </Badge>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <Star className={`w-4 h-4 ${getImportanceColor(memory.importance)}`} />
                            <span className={getImportanceColor(memory.importance)}>{memory.importance}</span>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex flex-wrap gap-1 max-w-32">
                            {memory.associations.slice(0, 3).map((assoc, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {assoc}
                              </Badge>
                            ))}
                            {memory.associations.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{memory.associations.length - 3}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-muted-foreground" />
                            <span>{memory.accessCount}</span>
                          </div>
                        </td>
                        <td className="p-2 text-xs text-muted-foreground">
                          {formatTime(memory.lastAccessed)}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}

          {view === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {sortedMemories.map((memory, index) => (
                  <motion.div
                    key={memory.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="bg-muted/30 border border-border/30 rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="outline" className={`text-xs ${getMemoryColor(memory.type)}`}>
                        {getMemoryIcon(memory.type)}
                        <span className="ml-1 capitalize">{memory.type}</span>
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className={`w-3 h-3 ${getImportanceColor(memory.importance)}`} />
                        <span className={`text-xs ${getImportanceColor(memory.importance)}`}>{memory.importance}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm leading-relaxed mb-3 line-clamp-3">{memory.content}</p>
                    
                    {memory.visual && (
                      <div className="mb-3">
                        <VisualRenderer 
                          type={memory.visual.type}
                          data={memory.visual.data}
                          description={memory.visual.description}
                          width={120}
                          height={80}
                        />
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {memory.associations.slice(0, 3).map((assoc, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {assoc}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatTime(memory.timestamp)}</span>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>{memory.accessCount}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {view === 'network' && (
            <div className="h-96 bg-muted/20 rounded-lg border border-border/30 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Network className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h4 className="text-lg font-medium mb-2">Neural Network View</h4>
                <p className="text-sm">Interactive network visualization coming soon...</p>
                <p className="text-xs mt-1">Shows memory connections and associations</p>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="w-full mt-6 pt-4 border-t border-border/50"
        >
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Showing {sortedMemories.length} of {memories.length} memories</span>
              <span>• Total connections: {memories.reduce((sum, m) => sum + m.associations.length, 0)}</span>
              <span>• Avg importance: {Math.round(memories.reduce((sum, m) => sum + m.importance, 0) / memories.length)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>Database active</span>
            </div>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default MemoryDatabase; 