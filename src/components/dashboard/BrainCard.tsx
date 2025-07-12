import React from "react";
import { motion } from "framer-motion";
import { Brain } from "../../lib/types";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Brain as BrainIcon,
  Clock,
  MessageSquare,
  HardDrive,
  Activity,
  Zap,
  Search,
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
import { timestampHelpers } from "../../lib/types";

// Map icon string to Lucide icon component
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

interface BrainCardProps {
  brain: Brain;
  onSelect: (brain: Brain) => void;
  isSelected?: boolean;
}

const BrainCard: React.FC<BrainCardProps> = ({ brain, onSelect, isSelected = false }) => {
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
  const LucideIcon = brain.icon && iconMap[brain.icon] ? iconMap[brain.icon] : BrainIcon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className={`relative cursor-pointer transition-all duration-200 w-full p-4 md:p-6 flex flex-col h-full ${
          isSelected 
            ? 'ring-2 ring-primary shadow-lg' 
            : 'hover:shadow-md hover:ring-1 hover:ring-border'
        }`}
        onClick={() => onSelect(brain)}
      >
        {/* Status indicator */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor(brain.status)}`} />
          <span className="text-xs text-muted-foreground">
            {getStatusText(brain.status)}
          </span>
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
              style={{ 
                backgroundColor: brain.color + '20',
                color: brain.color 
              }}
            >
              <LucideIcon className="w-7 h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{brain.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {brain.description}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 flex-1 flex flex-col">
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {brain.tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs"
                style={{ 
                  backgroundColor: brain.accentColor + '20',
                  color: brain.accentColor 
                }}
              >
                {tag}
              </Badge>
            ))}
            {brain.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{brain.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <MessageSquare className="w-3 h-3" />
              <span>{brain.thoughtCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <HardDrive className="w-3 h-3" />
              <span>{brain.memoryCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{formatUptime(brain.uptime)}</span>
            </div>
          </div>

          {/* Current State */}
          {brain.currentState && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Activity className="w-3 h-3" />
                <span>Current State</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {brain.currentState.energy !== undefined && (
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Energy</div>
                    <div className="flex items-center gap-1 justify-center">
                      <Zap className="w-3 h-3 text-yellow-500" />
                      <span className="text-sm font-medium">{brain.currentState.energy}%</span>
                    </div>
                  </div>
                )}
                {brain.currentState.focus !== undefined && (
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Focus</div>
                    <div className="flex items-center gap-1 justify-center">
                      <BrainIcon className="w-3 h-3 text-blue-500" />
                      <span className="text-sm font-medium">{brain.currentState.focus}%</span>
                    </div>
                  </div>
                )}
                {brain.currentState.mood !== undefined && (
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Mood</div>
                    <div className="text-sm font-medium">
                      {brain.currentState.mood > 0 ? '+' : ''}{brain.currentState.mood}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Capabilities */}
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Capabilities</div>
            <div className="flex flex-wrap gap-1">
              {brain.capabilities.slice(0, 2).map((capability, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {capability}
                </Badge>
              ))}
              {brain.capabilities.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{brain.capabilities.length - 2} more
                </Badge>
              )}
            </div>
          </div>

          {/* Last Activity */}
          <div className="text-xs text-muted-foreground">
            Last active: {timestampHelpers.formatForDisplay(brain.lastActivity)}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BrainCard; 