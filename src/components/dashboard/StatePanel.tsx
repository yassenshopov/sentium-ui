import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainState } from "../../lib/types";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { useTheme } from "next-themes";
import { 
  Activity, 
  Battery, 
  Brain, 
  Clock, 
  Zap, 
  Target,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import { formatPercentage } from "../../lib/utils";

interface StatePanelProps {
  brainState: BrainState;
  color?: string;
  accentColor?: string;
}

const StatePanel: React.FC<StatePanelProps> = ({ brainState, color = '#3B82F6', accentColor = '#60A5FA' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [pulseEnergy, setPulseEnergy] = useState(false);
  // const { theme } = useTheme();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (brainState.energy < 30) {
      setPulseEnergy(true);
      const timer = setTimeout(() => setPulseEnergy(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [brainState.energy]);



  const getMoodIcon = (mood: number) => {
    if (mood > 25) return <TrendingUp className="w-4 h-4" />;
    if (mood >= -25) return <Minus className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" />;
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const brainActivityData = [
    { name: "Energy", value: brainState.energy, color: color, icon: Battery },
    { name: "Focus", value: brainState.focus, color: accentColor, icon: Target },
    { name: "Mood", value: brainState.mood + 100, max: 200, color: accentColor, icon: Brain },
  ];

  // ECG colors (same for both light and dark themes)
  const ecgColors = {
    primary: "hsl(var(--primary))",
    secondary: "hsl(var(--chart-2))",
    grid: "hsl(var(--muted-foreground))",
    baseline: "hsl(var(--border))"
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
            <Battery className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold" style={{ color }}>{'Neural State'}</h2>
            <p className="text-sm text-muted-foreground">Real-time brain metrics</p>
          </div>
        </motion.div>

        {/* ECG Brain Activity Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="w-full mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Neural Activity</span>
          </div>
          
          {/* Real-time brain activity visualization */}
          <div className="relative h-16 bg-muted/30 rounded-lg overflow-hidden border">
            <svg
              className="w-full h-full"
              viewBox="0 0 300 60"
              preserveAspectRatio="none"
            >
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke={ecgColors.grid} strokeWidth="0.5" opacity="0.3"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Baseline */}
              <line x1="0" y1="30" x2="300" y2="30" stroke={ecgColors.baseline} strokeWidth="1" opacity="0.5"/>
              
              {/* Brain activity waveform */}
              <motion.path
                d={(() => {
                  // Generate a dynamic path based on brain state
                  const energy = brainState.energy / 100;
                  const focus = brainState.focus / 100;
                  const mood = (brainState.mood + 100) / 200;
                  
                  let path = "M 0 30";
                  for (let i = 0; i <= 300; i += 2) {
                    const x = i;
                    const baseY = 30;
                    const energyWave = Math.sin(i * 0.1 + Date.now() * 0.001) * 8 * energy;
                    const focusWave = Math.sin(i * 0.05 + Date.now() * 0.002) * 4 * focus;
                    const moodWave = Math.sin(i * 0.03 + Date.now() * 0.003) * 6 * mood;
                    const y = baseY + energyWave + focusWave + moodWave;
                    path += ` L ${x} ${y}`;
                  }
                  return path;
                })()}
                fill="none"
                stroke={ecgColors.primary}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{
                  d: (() => {
                    const energy = brainState.energy / 100;
                    const focus = brainState.focus / 100;
                    const mood = (brainState.mood + 100) / 200;
                    
                    let path = "M 0 30";
                    for (let i = 0; i <= 300; i += 2) {
                      const x = i;
                      const baseY = 30;
                      const energyWave = Math.sin(i * 0.1 + Date.now() * 0.001) * 8 * energy;
                      const focusWave = Math.sin(i * 0.05 + Date.now() * 0.002) * 4 * focus;
                      const moodWave = Math.sin(i * 0.03 + Date.now() * 0.003) * 6 * mood;
                      const y = baseY + energyWave + focusWave + moodWave;
                      path += ` L ${x} ${y}`;
                    }
                    return path;
                  })()
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </svg>
            
            {/* Activity indicator */}
            <motion.div
              className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.7, 1]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>

        {/* State Metrics */}
        <div className="w-full space-y-4">
          <AnimatePresence>
            {brainActivityData.map((metric, index) => {
              // Extract mood calculation logic to avoid repetition
              const moodPercentage = metric.name === "Mood" ? (metric.value / 200) * 100 : metric.value;
              const isMood = metric.name === "Mood";
              
              return (
                <motion.div
                  key={metric.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="p-1.5 rounded-md"
                        style={{ backgroundColor: `${metric.color}20` }}
                      >
                        <metric.icon 
                          className="w-4 h-4" 
                          style={{ color: metric.color }}
                        />
                      </div>
                      <span className="font-medium text-sm">{metric.name}</span>
                      {metric.name === "Mood" && (
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 0.5, repeat: 2 }}
                        >
                          {getMoodIcon(brainState.mood)}
                        </motion.div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono">
                        {isMood
                          ? formatPercentage(brainState.mood, { signed: true })
                          : formatPercentage(metric.value)}
                      </span>
                      {metric.name === "Energy" && brainState.energy < 30 && (
                        <motion.div
                          animate={pulseEnergy ? { 
                            scale: [1, 1.3, 1],
                            opacity: [1, 0.7, 1]
                          } : {}}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <Zap className="w-4 h-4 text-destructive" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Progress 
                      value={moodPercentage} 
                      className="h-3"
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${moodPercentage}%` 
                      }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 1.2, ease: "easeOut" }}
                      className="absolute top-0 left-0 h-3 rounded-full overflow-hidden"
                      style={{ 
                        background: `linear-gradient(90deg, ${metric.color}80, ${metric.color})`
                      }}
                    >
                      {/* Animated Shimmer Effect */}
                      <motion.div
                        animate={{ 
                          x: ["-100%", "100%"]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          ease: "linear",
                          delay: 0.8 + index * 0.2
                        }}
                        className="absolute inset-0 w-full h-full"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${metric.color}40, transparent)`,
                          transform: "skewX(-20deg)"
                        }}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Uptime and Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex items-center justify-between pt-4 border-t border-border/50"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Uptime: {formatUptime(brainState.uptime)}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge 
                variant={brainState.energy > 70 ? "default" : brainState.energy > 30 ? "secondary" : "destructive"}
                className="text-xs"
              >
                {brainState.energy > 70 ? "Optimal" : brainState.energy > 30 ? "Stable" : "Critical"}
              </Badge>
            </div>
          </motion.div>

          {/* Brain Status Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-muted to-muted/50"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [1, 0.8, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="w-2 h-2 rounded-full bg-primary"
            />
            <span className="text-sm font-medium">
              Brain active and processing
            </span>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export default StatePanel; 