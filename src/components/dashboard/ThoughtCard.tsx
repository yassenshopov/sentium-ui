import React, { useState, useEffect, useRef } from "react";
import { Thought } from "../../lib/types";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import VisualRenderer from "../ui/visual-renderer";
import { 
  MessageSquare, 
  Brain, 
  Zap, 
  Target, 
  TrendingUp, 
  TrendingDown,
  Clock,
  ChevronDown,
  ChevronUp,
  Palette
} from "lucide-react";

interface ThoughtCardProps {
  thought: Thought;
  viewStyle?: 'streaming' | 'neural' | 'waveform' | 'cards';
}

const ThoughtCard: React.FC<ThoughtCardProps> = ({ thought, viewStyle = 'streaming' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  // Streaming text effect
  useEffect(() => {
    if (viewStyle === 'streaming' && thought.content) {
      setIsTyping(true);
      setDisplayedText('');
      setCurrentIndex(0);
      
      const interval = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= thought.content.length) {
            setIsTyping(false);
            clearInterval(interval);
            return prev;
          }
          setDisplayedText(thought.content.slice(0, prev + 1));
          return prev + 1;
        });
      }, 30); // Adjust speed here

      return () => clearInterval(interval);
    } else {
      setDisplayedText(thought.content);
      setIsTyping(false);
    }
  }, [thought.content, viewStyle]);

  // Auto-scroll for streaming view
  useEffect(() => {
    if (viewStyle === 'streaming' && textRef.current && isTyping) {
      textRef.current.scrollTop = textRef.current.scrollHeight;
    }
  }, [displayedText, isTyping, viewStyle]);

  const getThoughtIcon = (type?: string) => {
    switch (type) {
      case 'reflection':
        return <Brain className="w-4 h-4" />;
      case 'analysis':
        return <Target className="w-4 h-4" />;
      case 'wonder':
        return <Zap className="w-4 h-4" />;
      case 'realization':
        return <MessageSquare className="w-4 h-4" />;
      case 'question':
        return <Brain className="w-4 h-4" />;
      default:
        return <Brain className="w-4 h-4" />;
    }
  };

  const getThoughtColor = (type?: string) => {
    switch (type) {
      case 'reflection':
        return 'text-purple-500';
      case 'analysis':
        return 'text-blue-500';
      case 'wonder':
        return 'text-yellow-500';
      case 'realization':
        return 'text-green-500';
      case 'question':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  };

  const getMoodIcon = (mood?: number) => {
    if (!mood) return null;
    if (mood > 20) return <TrendingUp className="w-3 h-3 text-green-500" />;
    if (mood < -20) return <TrendingDown className="w-3 h-3 text-red-500" />;
    return null;
  };

  const formatTime = (timestamp: Date | string) => {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Streaming Text View
  const renderStreamingView = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <div className="flex items-start gap-3 mb-3">
        <motion.div
          animate={{ 
            scale: isTyping ? [1, 1.2, 1] : 1,
            opacity: isTyping ? [1, 0.7, 1] : 1
          }}
          transition={{ 
            duration: 1, 
            repeat: isTyping ? Infinity : 0,
            ease: "easeInOut"
          }}
          className={`flex-shrink-0 mt-1 ${getThoughtColor(thought.type)}`}
        >
          {getThoughtIcon(thought.type)}
        </motion.div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          {formatTime(thought.timestamp)}
          {getMoodIcon(thought.metadata?.mood)}
        </div>
      </div>

      <div 
        ref={textRef}
        className="relative min-h-[60px] max-h-[200px] overflow-y-auto bg-gradient-to-r from-muted/30 to-muted/10 rounded-lg p-4 border border-border/50"
      >
        <div className="text-sm leading-relaxed font-mono">
          {displayedText}
          {isTyping && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-2 h-4 bg-primary ml-1"
            />
          )}
        </div>
        
        {/* Visual content overlay */}
        {thought.visual && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="absolute top-2 right-2"
          >
            <VisualRenderer
              type={thought.visual.type}
              data={thought.visual.data}
              description={thought.visual.description}
              width={80}
              height={60}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );

  // Neural Network View
  const renderNeuralView = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="relative"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 ${getThoughtColor(thought.type)}`}>
            {getThoughtIcon(thought.type)}
          </div>
          <span className="text-xs text-muted-foreground">{formatTime(thought.timestamp)}</span>
        </div>
        {getMoodIcon(thought.metadata?.mood)}
      </div>

      <div className="relative h-32 bg-gradient-to-br from-background to-muted/20 rounded-lg border border-border/50 overflow-hidden">
        {/* Neural connections */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 120">
          <defs>
            <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
              <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          
          {/* Neural nodes */}
          {Array.from({ length: 8 }, (_, i) => (
            <motion.circle
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              cx={30 + (i * 35)}
              cy={20 + (i % 3) * 40}
              r="3"
              fill="hsl(var(--primary))"
              opacity="0.8"
            />
          ))}
          
          {/* Connections */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            d="M30,20 L65,60 L100,20 L135,60 L170,20 L205,60 L240,20 L275,60"
            stroke="url(#neuralGradient)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        
        {/* Text overlay */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="text-xs text-center text-muted-foreground max-w-[200px]">
            {thought.content.length > 100 ? thought.content.slice(0, 100) + '...' : thought.content}
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Waveform View
  const renderWaveformView = () => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="relative"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-md ${getThoughtColor(thought.type)}`}>
            {getThoughtIcon(thought.type)}
          </div>
          <span className="text-xs text-muted-foreground">{formatTime(thought.timestamp)}</span>
        </div>
        {getMoodIcon(thought.metadata?.mood)}
      </div>

      <div className="relative h-24 bg-gradient-to-r from-muted/20 to-muted/10 rounded-lg border border-border/50 p-4">
        {/* Waveform visualization */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 80">
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            d="M0,40 L10,30 L20,50 L30,35 L40,45 L50,25 L60,55 L70,40 L80,30 L90,50 L100,35 L110,45 L120,25 L130,55 L140,40 L150,30 L160,50 L170,35 L180,45 L190,25 L200,55 L210,40 L220,30 L230,50 L240,35 L250,45 L260,25 L270,55 L280,40 L290,30 L300,50"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Animated pulse */}
          <motion.circle
            animate={{ 
              cx: [0, 300],
              opacity: [1, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "linear"
            }}
            cy="40"
            r="2"
            fill="hsl(var(--chart-2))"
          />
        </svg>
        
        {/* Text overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-xs text-center text-muted-foreground max-w-[250px]">
            {thought.content.length > 80 ? thought.content.slice(0, 80) + '...' : thought.content}
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Original Card View
  const renderCardView = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`border transition-all hover:shadow-md ${getThoughtColor(thought.type).replace('text-', 'bg-').replace('-500', '-500/10 border-').replace('-500', '-500/20')}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              {getThoughtIcon(thought.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    {thought.type || 'internal'}
                  </Badge>
                  {getMoodIcon(thought.metadata?.mood)}
                  {thought.visual && (
                    <Badge variant="outline" className="text-xs">
                      <Palette className="w-3 h-3 mr-1" />
                      Visual
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatTime(thought.timestamp)}
                </div>
              </div>
              
              <div className="text-sm leading-relaxed mb-3">
                {thought.content}
              </div>
              
              {/* Visual Content */}
              {thought.visual && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="mb-3"
                >
                  <VisualRenderer
                    type={thought.visual.type}
                    data={thought.visual.data}
                    description={thought.visual.description}
                    width={200}
                    height={150}
                  />
                </motion.div>
              )}
              
              <AnimatePresence>
                {isExpanded && thought.metadata && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-3 pt-3 border-t border-border/50"
                  >
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-blue-500" />
                        <span>Energy: {thought.metadata.energy}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-3 h-3 text-green-500" />
                        <span>Focus: {thought.metadata.focus}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {getMoodIcon(thought.metadata.mood)}
                        <span>Mood: {thought.metadata.mood}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {thought.metadata && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex-shrink-0 p-1 hover:bg-muted rounded transition-colors cursor-pointer"
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            )}
          </div>
    </CardContent>
  </Card>
    </motion.div>
  );

  // Render based on view style
  switch (viewStyle) {
    case 'streaming':
      return renderStreamingView();
    case 'neural':
      return renderNeuralView();
    case 'waveform':
      return renderWaveformView();
    case 'cards':
    default:
      return renderCardView();
  }
};

export default ThoughtCard; 