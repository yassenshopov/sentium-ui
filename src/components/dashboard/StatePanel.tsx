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

  // Use color and accentColor for all highlights and progress bars
  const mainColor = "hsl(var(--chart-1))";
  const accent = "hsl(var(--chart-2))";
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
      <Card className="rounded-xl p-6 flex flex-col items-start w-full bg-gradient-to-br from-background to-secondary dark:from-background dark:to-secondary border">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Neural State
            </h2>
            <p className="text-sm text-muted-foreground">Real-time brain metrics</p>
          </div>
        </motion.div>

        {/* ECG Brain Activity Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full h-32 mb-6 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-muted to-muted/50 dark:from-muted dark:to-muted/50 rounded-lg" />
          <svg width="100%" height="100%" viewBox="0 0 300 120" className="absolute inset-0">
            <defs>
              <linearGradient id="ecgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={ecgColors.primary} stopOpacity="0.9" />
                <stop offset="50%" stopColor={ecgColors.secondary} stopOpacity="0.7" />
                <stop offset="100%" stopColor={ecgColors.primary} stopOpacity="0.9" />
              </linearGradient>
            </defs>
            
            {/* ECG Base Line */}
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              d="M0,60 L300,60"
              stroke={ecgColors.baseline}
              strokeWidth="1"
              strokeDasharray="2,2"
              fill="none"
              opacity="0.6"
            />
            
            {/* Continuous ECG Waveform */}
            <motion.path
              initial={{ x: 0 }}
              animate={{ x: -300 }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              d="M0,60 L20,60 L25,40 L30,80 L35,60 L50,60 L55,45 L60,75 L65,60 L80,60 L85,35 L90,85 L95,60 L110,60 L115,50 L120,70 L125,60 L140,60 L145,30 L150,90 L155,60 L170,60 L175,55 L180,65 L185,60 L200,60 L205,25 L210,95 L215,60 L230,60 L235,60 L240,60 L245,40 L250,80 L255,60 L270,60 L275,45 L280,75 L285,60 L300,60 M300,60 L320,60 L325,40 L330,80 L335,60 L350,60 L355,45 L360,75 L365,60 L380,60 L385,35 L390,85 L395,60 L410,60 L415,50 L420,70 L425,60 L440,60 L445,30 L450,90 L455,60 L470,60 L475,55 L480,65 L485,60 L500,60 L505,25 L510,95 L515,60 L530,60 L535,60 L540,60 L545,40 L550,80 L555,60 L570,60 L575,45 L580,75 L585,60 L600,60"
              stroke="url(#ecgGradient)"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Moving Data Point */}
            <motion.circle
              animate={{ 
                cx: [300, 320, 325, 330, 335, 350, 355, 360, 365, 380, 385, 390, 395, 410, 415, 420, 425, 440, 445, 450, 455, 470, 475, 480, 485, 500, 505, 510, 515, 530, 535, 540, 545, 550, 555, 570, 575, 580, 585, 600],
                cy: [60, 60, 40, 80, 60, 60, 45, 75, 60, 60, 35, 85, 60, 60, 50, 70, 60, 60, 30, 90, 60, 60, 55, 65, 60, 60, 25, 95, 60, 60, 60, 60, 40, 80, 60, 60, 45, 75, 60, 60]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "linear",
                times: [0, 0.05, 0.08, 0.1, 0.12, 0.17, 0.19, 0.22, 0.24, 0.27, 0.29, 0.32, 0.34, 0.37, 0.39, 0.42, 0.44, 0.47, 0.49, 0.52, 0.54, 0.57, 0.59, 0.62, 0.64, 0.67, 0.69, 0.72, 0.74, 0.77, 0.79, 0.82, 0.84, 0.87, 0.89, 0.92, 0.94, 0.97, 0.99, 1]
              }}
              r="2"
              fill={ecgColors.primary}
              opacity="0.8"
            />
            

            
            {/* ECG Grid Lines */}
            <motion.path
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              transition={{ delay: 1, duration: 1 }}
              d="M0,30 L300,30 M0,45 L300,45 M0,75 L300,75 M0,90 L300,90"
              stroke={ecgColors.grid}
              strokeWidth="0.5"
              fill="none"
            />
          </svg>
        </motion.div>

        {/* State Metrics */}
        <div className="w-full space-y-4">
          <AnimatePresence>
            {brainActivityData.map((metric, index) => {
              // Extract mood calculation logic to avoid repetition
              const moodPercentage = metric.name === "Mood" ? (metric.value / 200) * 100 : metric.value;
              
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
                        {metric.name === "Mood" ? brainState.mood : Math.round(metric.value)}
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