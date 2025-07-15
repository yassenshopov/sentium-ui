import React from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";
import { PersonalityType } from "../../lib/brain-simulation";
import { Brain, Sparkles, Shield, Zap } from "lucide-react";

/**
 * Validates if a string is a valid 6-digit hex color code
 * @param color - The color string to validate
 * @returns True if the color is a valid 6-digit hex code
 */
const isValidHexColor = (color: string): boolean => {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
};

/**
 * Appends an alpha value to a hex color string
 * @param hexColor - The 6-digit hex color (e.g., '#3B82F6')
 * @param alpha - The alpha value as a 2-digit hex string (e.g., '10', '33', '55')
 * @returns The hex color with alpha appended
 * @throws Error if the hex color is invalid
 */
const appendAlphaToHex = (hexColor: string, alpha: string): string => {
  if (!isValidHexColor(hexColor)) {
    throw new Error(`Invalid hex color: ${hexColor}. Expected format: #RRGGBB`);
  }
  return hexColor + alpha;
};

/**
 * Props for the PersonalitySelector component
 */
interface PersonalitySelectorProps {
  /** The currently selected personality type */
  currentPersonality: PersonalityType;
  /** Callback function called when personality changes */
  onPersonalityChange: (personality: PersonalityType) => void;
  /** 
   * Primary color for the component styling
   * Must be a valid 6-digit hex color code (e.g., '#3B82F6')
   * Used for borders, active states, and primary elements
   */
  color?: string;
  /** 
   * Accent color for the component styling
   * Must be a valid 6-digit hex color code (e.g., '#60A5FA')
   * Used for backgrounds, inactive states, and secondary elements
   */
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
  // Default colors are 6-digit hex codes for proper alpha concatenation
  color = '#3B82F6',
  accentColor = '#60A5FA',
}) => {
  // Validate color props at runtime in development
  if (process.env.NODE_ENV === 'development') {
    if (color && !isValidHexColor(color)) {
      console.warn(`PersonalitySelector: Invalid color prop "${color}". Expected 6-digit hex format (e.g., '#3B82F6')`);
    }
    if (accentColor && !isValidHexColor(accentColor)) {
      console.warn(`PersonalitySelector: Invalid accentColor prop "${accentColor}". Expected 6-digit hex format (e.g., '#60A5FA')`);
    }
  }

  return (
    <Card
      className="p-4 space-y-3 border"
      style={{
        background: `linear-gradient(135deg, ${appendAlphaToHex(color, '10')}, ${appendAlphaToHex(accentColor, '10')})`,
        borderColor: appendAlphaToHex(color, '33'),
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
                background: appendAlphaToHex(color, '10'),
                color: color,
              } : {
                borderColor: appendAlphaToHex(accentColor, '55'),
                background: appendAlphaToHex(accentColor, '05'),
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