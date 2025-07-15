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
  Clapperboard,
  Target,
  Smile
} from "lucide-react";
import { timestampHelpers } from "../../lib/types";
import { formatPercentage } from "../../lib/utils";

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
  Clapperboard,
  Target,
  Smile
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
        className={`relative cursor-pointer transition-all duration-200 w-full h-full flex flex-col justify-between p-4 md:p-6 ${
          isSelected 
            ? 'ring-2 ring-primary' 
            : 'hover:ring-1 hover:ring-border'
        }`}
        onClick={() => onSelect(brain)}
      >
        {/* Top Row: Icon, Name, Status */}
        <div className="flex items-center gap-3 mb-2">
          <div 
            className="w-11 h-11 rounded-lg flex items-center justify-center text-2xl"
            style={{ backgroundColor: brain.color + '22', color: brain.color }}
          >
            <LucideIcon className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-lg truncate flex-1" style={{ color: brain.color }}>{brain.name}</h3>
          <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(brain.status)}`} title={getStatusText(brain.status)} />
        </div>

        {/* Key Parameters Row */}
        {brain.currentState && (
          <div className="flex gap-2 mb-2">
            {brain.currentState.energy !== undefined && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1" style={{ backgroundColor: brain.accentColor + '22', color: brain.accentColor }}>
                <Zap className="w-3 h-3" /> {formatPercentage(brain.currentState.energy)}
              </span>
            )}
            {brain.currentState.focus !== undefined && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1" style={{ backgroundColor: brain.accentColor + '22', color: brain.accentColor }}>
                <Target className="w-3 h-3" /> {formatPercentage(brain.currentState.focus)}
              </span>
            )}
            {brain.currentState.mood !== undefined && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1" style={{ backgroundColor: brain.accentColor + '22', color: brain.accentColor }}>
                <Smile className="w-3 h-3" /> {formatPercentage(brain.currentState.mood, { signed: true })}
              </span>
            )}
          </div>
        )}

        {/* Description */}
        <div className="text-sm text-muted-foreground mb-2 line-clamp-2">
          {brain.description}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-2">
          {brain.tags.slice(0, 2).map((tag, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="text-xs font-normal"
              style={{ borderColor: brain.accentColor + '55', color: brain.accentColor }}
            >
              {tag}
            </Badge>
          ))}
          {brain.tags.length > 2 && (
            <Badge variant="outline" className="text-xs font-normal" style={{ borderColor: brain.accentColor + '55', color: brain.accentColor }}>
              +{brain.tags.length - 2}
            </Badge>
          )}
        </div>

        {/* Capabilities */}
        <div className="flex gap-1 items-center mb-2">
          <span className="text-xs text-muted-foreground">{brain.capabilities[0]}</span>
          {brain.capabilities.length > 1 && (
            <span className="text-xs text-muted-foreground">+{brain.capabilities.length - 1} more</span>
          )}
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto pt-2 border-t border-border/40">
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            <span>{brain.thoughtCount.toLocaleString()} thoughts</span>
          </div>
          <div className="flex items-center gap-1">
            <HardDrive className="w-3 h-3" />
            <span>{brain.memoryCount.toLocaleString()} memories</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatUptime(brain.uptime)}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default BrainCard; 