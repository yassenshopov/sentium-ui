import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { 
  MessageCircle, 
  Brain, 
  Database,
  Activity,
  Settings,
  Wifi,
  Sparkles,
  Moon,
  GitBranch
} from "lucide-react";
import ChatInterface from "../input/ChatInterface";
import ThoughtProcessPanel from "../dashboard/ThoughtProcessPanel";
import MemoryDatabase from "../dashboard/MemoryDatabase";
import StatePanel from "../dashboard/StatePanel";
import DreamJournal from "../dashboard/DreamJournal";
import TimelineView from "../dashboard/TimelineView";
import PersonalitySelector from "./PersonalitySelector";
import { BrainActivity, BrainState, CanvasData, PatternData } from "../../lib/types";
import { PersonalityType } from "../../lib/brain-simulation";

interface ChatMessage {
  id: string;
  type: 'user' | 'brain';
  content: string;
  timestamp: Date;
  visual?: {
    type: 'emoji' | 'canvas' | 'pattern' | 'diagram';
    data: string | CanvasData | PatternData;
    description?: string;
  };
}

interface TabbedInterfaceProps {
  chatMessages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
  brainState: BrainState;
  onToggleChannel: () => void;
  isChannelOpen: boolean;
  brainActivity: BrainActivity[];
  currentPersonality: PersonalityType;
  onPersonalityChange: (personality: PersonalityType) => void;
  color?: string;
  accentColor?: string;
  brainIcon?: React.ElementType;
}

type TabType = 'conversation' | 'memories' | 'thoughts' | 'dreams' | 'timeline' | 'system';

interface PlaceholderCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  largeIcon: React.ReactNode;
  color?: string;
  accentColor?: string;
}

const PlaceholderCard: React.FC<PlaceholderCardProps> = ({ icon, title, subtitle, description, largeIcon, color = '#3B82F6', accentColor = '#60A5FA' }) => (
  <Card
    className="rounded-xl p-6 flex flex-col items-start w-full border h-full"
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
        {icon}
      </div>
      <div className="flex-1">
        <h2 className="text-xl font-bold" style={{ color }}>{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </motion.div>
    <div className="w-full space-y-4">
      <div className="flex flex-col items-center justify-center py-8 text-center">
        {largeIcon}
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
        <p className="text-xs text-muted-foreground mt-1">Coming soon...</p>
      </div>
    </div>
  </Card>
);

const TabbedInterface: React.FC<TabbedInterfaceProps> = ({
  chatMessages,
  onSendMessage,
  isProcessing,
  brainState,
  onToggleChannel,
  isChannelOpen,
  brainActivity,
  currentPersonality,
  onPersonalityChange,
  color = '#3B82F6',
  accentColor = '#60A5FA',
  brainIcon
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('conversation');
  const [hoveredTab, setHoveredTab] = useState<TabType | null>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts when not typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Tab switching shortcuts
      if ((event.ctrlKey || event.metaKey) && !event.shiftKey) {
        switch (event.key) {
          case '1':
            event.preventDefault();
            setActiveTab('conversation');
            break;
          case '2':
            event.preventDefault();
            setActiveTab('memories');
            break;
          case '3':
            event.preventDefault();
            setActiveTab('thoughts');
            break;
          case '4':
            event.preventDefault();
            setActiveTab('dreams');
            break;
          case '5':
            event.preventDefault();
            setActiveTab('timeline');
            break;
          case '6':
            event.preventDefault();
            setActiveTab('system');
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const tabs = [
    {
      id: 'conversation' as TabType,
      label: 'Conversation',
      icon: <MessageCircle className="w-4 h-4" />,
      badge: chatMessages.length,
      description: 'Chat with Sentium'
    },
    {
      id: 'memories' as TabType,
      label: 'Memories',
      icon: <Database className="w-4 h-4" />,
      badge: brainActivity.filter(activity => activity.type === 'memory').length,
      description: 'Stored knowledge & experiences'
    },
    {
      id: 'thoughts' as TabType,
      label: 'Thoughts',
      icon: <Brain className="w-4 h-4" />,
      badge: brainActivity.filter(activity => activity.type === 'thought').length,
      description: 'Live internal monologue'
    },
    {
      id: 'dreams' as TabType,
      label: 'Dreams',
      icon: <Moon className="w-4 h-4" />,
      badge: 0,
      description: 'Unconscious musings & visions'
    },
    {
      id: 'timeline' as TabType,
      label: 'Timeline',
      icon: <GitBranch className="w-4 h-4" />,
      badge: 0,
      description: 'Evolution & growth over time'
    },
    {
      id: 'system' as TabType,
      label: 'System',
      icon: <Activity className="w-4 h-4" />,
      badge: 0,
      description: 'Neural state & personality'
    }
  ];

  const getTabContent = () => {
    switch (activeTab) {
      case 'conversation':
        return (
          <motion.div
            key="conversation"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <ChatInterface
              messages={chatMessages}
              onSendMessage={onSendMessage}
              isProcessing={isProcessing}
              brainState={brainState}
              onToggleChannel={onToggleChannel}
              isChannelOpen={isChannelOpen}
              color={color}
              accentColor={accentColor}
              brainIcon={brainIcon}
            />
          </motion.div>
        );
      
      case 'memories':
        return (
          <motion.div
            key="memories"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <MemoryDatabase brainActivity={brainActivity} color={color} accentColor={accentColor} />
          </motion.div>
        );
      
      case 'thoughts':
        return (
          <motion.div
            key="thoughts"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <ThoughtProcessPanel 
              thoughts={brainActivity.filter(activity => activity.type === 'thought').map(activity => ({
                id: activity.id,
                content: activity.content,
                timestamp: activity.timestamp,
                type: activity.subtype as 'reflection' | 'analysis' | 'wonder' | 'realization' | 'question',
                metadata: activity.metadata,
                visual: activity.visual
              }))}
              color={color}
              accentColor={accentColor}
            />
          </motion.div>
        );
      
      case 'dreams':
        return (
          <motion.div
            key="dreams"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <DreamJournal 
              brainState={brainState}
              color={color}
              accentColor={accentColor}
            />
          </motion.div>
        );
      
      case 'timeline':
        return (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <TimelineView 
              brainState={brainState}
              brainActivity={brainActivity}
              color={color}
              accentColor={accentColor}
            />
          </motion.div>
        );
      
      case 'system':
        return (
          <motion.div
            key="system"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <StatePanel brainState={brainState} color={color} accentColor={accentColor} />
              <PersonalitySelector
                currentPersonality={currentPersonality}
                onPersonalityChange={onPersonalityChange}
                color={color}
                accentColor={accentColor}
              />
              {/* Performance Card */}
              <div className="lg:col-span-2 xl:col-span-1">
                <PlaceholderCard
                  icon={<Settings className="w-5 h-5 text-white" />}
                  title="Performance"
                  subtitle="System performance metrics"
                  description="Performance monitoring"
                  largeIcon={<Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />}
                  color={color}
                  accentColor={accentColor}
                />
              </div>
              {/* Network Card */}
              <div className="lg:col-span-2 xl:col-span-1">
                <PlaceholderCard
                  icon={<Wifi className="w-5 h-5 text-white" />}
                  title="Network"
                  subtitle="Connection status & logs"
                  description="Network diagnostics"
                  largeIcon={<Wifi className="w-12 h-12 mx-auto mb-3 opacity-50" />}
                  color={color}
                  accentColor={accentColor}
                />
              </div>
            </div>
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto md:px-6">
      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative flex items-center justify-center mb-8"
      >
        {/* Left fade for scroll hint */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-6 z-10 hidden sm:block" style={{background: 'linear-gradient(to right, var(--background), transparent)'}} />
        <Card className="p-2 bg-muted/30 border-border/50 mx-auto overflow-x-auto">
          <div className="flex items-center gap-1 md:gap-2 flex-nowrap overflow-x-auto scrollbar-thin scrollbar-thumb-muted/40 scrollbar-track-transparent w-max justify-center mx-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const isHovered = hoveredTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  onMouseEnter={() => setHoveredTab(tab.id)}
                  onMouseLeave={() => setHoveredTab(null)}
                  className={`flex items-center gap-2 px-3 md:px-5 py-2 rounded-xl font-semibold transition-all text-xs md:text-sm focus:outline-none relative overflow-hidden whitespace-nowrap ${
                    isActive
                      ? ''
                      : 'hover:shadow-md'
                  } cursor-pointer`}
                  style={isActive ? {
                    background: `linear-gradient(135deg, ${color}, ${accentColor})`,
                    color: '#fff',
                    boxShadow: `0 2px 16px 0 ${color}33, 0 0 0 2px ${accentColor}`,
                    borderBottom: `3px solid ${accentColor}`,
                    transition: 'all 0.25s cubic-bezier(.4,0,.2,1)'
                  } : isHovered ? {
                    background: `${color}22`,
                    color: color,
                    boxShadow: `0 2px 8px 0 ${color}11`,
                    borderBottom: `3px solid ${accentColor}55`,
                    transition: 'all 0.25s cubic-bezier(.4,0,.2,1)'
                  } : {
                    background: `${color}10`,
                    color: color,
                    borderBottom: `3px solid transparent`,
                    transition: 'all 0.25s cubic-bezier(.4,0,.2,1)'
                  }}
                >
                  {tab.icon}
                  <span className="hidden xs:inline md:inline">{tab.label}</span>
                  {tab.badge > 0 && (
                    <span
                      className="hidden md:inline ml-0.5 px-1 md:px-2 py-0.5 rounded-full text-[10px] md:text-xs font-semibold transition-all min-w-[1.25em] text-center"
                      style={isActive ? {
                        background: '#fff',
                        color: color
                      } : {
                        background: `${color}22`,
                        color: color
                      }}
                    >
                      {tab.badge > 9 ? '9+' : tab.badge}
                    </span>
                  )}
                  {isActive && (
                    <span
                      className="absolute left-0 bottom-0 w-full h-1 rounded-b-xl"
                      style={{ background: accentColor, opacity: 0.25 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </Card>
        {/* Right fade for scroll hint */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-6 z-10 hidden sm:block" style={{background: 'linear-gradient(to left, var(--background), transparent)'}} />
      </motion.div>

      {/* Tab Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        className="relative"
      >
        <AnimatePresence mode="wait">
          {getTabContent()}
        </AnimatePresence>
      </motion.div>

      {/* Status Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="mt-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Left side - Brain status */}
          <div className="flex items-center gap-4 md:gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-muted-foreground">
                {isChannelOpen ? 'Channel Open' : 'Channel Closed'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Energy: {brainState?.energy || 0}%
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {brainActivity.length} activities
              </span>
            </div>
          </div>

          {/* Right side - System status */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-end">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-muted-foreground">
                System Active
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TabbedInterface; 