import React from "react";
import { Input } from "../ui/input";
import { Send, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ value, onChange, onSend, disabled }) => (
  <div className="flex w-full gap-3">
    <div className="relative flex-1">
      <Input
        className="h-14 text-lg bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-all duration-200 rounded-xl pr-12"
        type="text"
        placeholder="Ask the brain anything..."
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') onSend(); }}
        aria-label="Message to brain"
        disabled={disabled}
      />
      <motion.div
        animate={{ 
          opacity: value.trim() ? 0.3 : 0.7,
          scale: value.trim() ? 0.9 : 1
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
      >
        <Sparkles className="w-5 h-5 text-muted-foreground" />
      </motion.div>
    </div>
    
    <motion.button
      className="h-14 px-6 text-lg font-semibold rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl"
      onClick={onSend}
      disabled={disabled || !value.trim()}
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Send className="w-5 h-5" />
      <span className="hidden sm:inline">Send</span>
    </motion.button>
  </div>
);

export default MessageInput; 