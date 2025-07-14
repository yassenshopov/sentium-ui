import React from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";
import { PersonalityType } from "../../lib/brain-simulation";
import { Brain, Sparkles, Shield, Zap } from "lucide-react";

interface PersonalitySelectorProps {
  currentPersonality: PersonalityType;
  onPersonalityChange: (personality: PersonalityType) => void;
  color?: string;
  accentColor?: string;
}

const personalityConfig = {
  curious: {
    name: "Curious",
    description: "Explorative and open-minded",
    icon: Sparkles,
    color: "bg-blue-500",
    traits: ["High openness", "Enthusiastic", "Philosophical"]
  },
  stoic: {
    name: "Stoic",
    description: "Calm and analytical",
    icon: Shield,
    color: "bg-gray-500",
    traits: ["High conscientiousness", "Logical", "Reserved"]
  },
  chaotic: {
    name: "Chaotic",
    description: "Creative and unpredictable",
    icon: Zap,
    color: "bg-purple-500",
    traits: ["High extraversion", "Creative", "Dynamic"]
  },
  neutral: {
    name: "Neutral",
    description: "Balanced and adaptable",
    icon: Brain,
    color: "bg-green-500",
    traits: ["Balanced traits", "Adaptable", "Stable"]
  }
};

const PersonalitySelector: React.FC<PersonalitySelectorProps> = ({
  currentPersonality,
  onPersonalityChange,
  color = '#3B82F6',
  accentColor = '#60A5FA',
}) => {
  return (
    <Card
      className="p-4 space-y-3 border"
      style={{
        background: `linear-gradient(135deg, ${color}10, ${accentColor}10)`,
        borderColor: color + '33',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-4 h-4" style={{ color }} />
        <h3 className="text-sm font-medium" style={{ color }}>Personality</h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {(Object.keys(personalityConfig) as PersonalityType[]).map((personality) => {
          const config = personalityConfig[personality];
          const Icon = config.icon;
          const isActive = personality === currentPersonality;
          return (
            <motion.button
              key={personality}
              onClick={() => onPersonalityChange(personality)}
              className={`relative p-3 rounded-lg border transition-all`}
              style={isActive ? {
                borderColor: color,
                background: color + '10',
                color: color,
              } : {
                borderColor: accentColor + '55',
                background: accentColor + '05',
                color: accentColor,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 rounded" style={{ background: color }}>
                  <Icon className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-medium">{config.name}</span>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full"
                    style={{ background: accentColor }}
                  />
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                {config.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {config.traits.map((trait, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-1 py-0"
                  >
                    {trait}
                  </Badge>
                ))}
              </div>
            </motion.button>
          );
        })}
      </div>
      <div className="pt-2 border-t border-border/50">
        <p className="text-xs text-muted-foreground">
          Changing personality affects thought patterns and response style
        </p>
      </div>
    </Card>
  );
};

export default PersonalitySelector; 