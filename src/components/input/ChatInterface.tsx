import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  Send, 
  User, 
  Brain, 
  Clock, 
  Sparkles,
  MessageCircle,
  Bot,
  Wifi,
  WifiOff
} from "lucide-react";
import { BrainActivity } from "../../lib/types";
import VisualRenderer from "../ui/visual-renderer";

interface ChatMessage {
  id: string;
  type: 'user' | 'brain';
  content: string;
  timestamp: Date;
  visual?: {
    type: 'emoji' | 'canvas' | 'pattern' | 'diagram';
    data: string | any;
    description?: string;
  };
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
  brainState: any;
  onToggleChannel: () => void;
  isChannelOpen: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isProcessing,
  brainState,
  onToggleChannel,
  isChannelOpen
}) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus textarea when channel opens
  useEffect(() => {
    if (isChannelOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isChannelOpen]);

  const handleSend = () => {
    if (input.trim() && isChannelOpen) {
      onSendMessage(input.trim());
      setInput("");
      // Scroll to bottom when user sends a message
      setTimeout(() => scrollToBottom(), 100);
      // Focus back to textarea after sending
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 50);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="rounded-xl flex flex-col h-[600px] bg-gradient-to-br from-background to-secondary/20 border">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80">
            <MessageCircle className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Communication Channel</h3>
            <p className="text-sm text-muted-foreground">
              {isChannelOpen ? 'Open - Free conversation' : 'Closed - Click to open'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Channel Status */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
              isChannelOpen 
                ? 'bg-green-500/10 text-green-600 border border-green-500/20' 
                : 'bg-red-500/10 text-red-600 border border-red-500/20'
            }`}>
              {isChannelOpen ? (
                <>
                  <Wifi className="w-3 h-3" />
                  <span>Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3" />
                  <span>Disconnected</span>
                </>
              )}
            </div>
          </div>
          
          {/* Toggle Channel Button */}
          <Button
            onClick={onToggleChannel}
            variant={isChannelOpen ? "outline" : "default"}
            size="sm"
            className="text-xs"
          >
            {isChannelOpen ? 'Close Channel' : 'Open Channel'}
          </Button>
          
          <Badge variant="secondary" className="text-xs">
            {messages.length} messages
          </Badge>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 text-muted-foreground"
            >
              <Bot className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h4 className="text-lg font-medium mb-2">
                {isChannelOpen ? 'Channel Open' : 'Channel Closed'}
              </h4>
              <p className="text-sm max-w-md mx-auto">
                {isChannelOpen 
                  ? 'The communication channel is open. You can chat freely with Sentium, and it can respond at any time.'
                  : 'Click "Open Channel" to start a free-flowing conversation with Sentium.'
                }
              </p>
            </motion.div>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'brain' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted border border-border/50'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    
                    {/* Visual content */}
                    {message.visual && (
                      <div className="mt-3">
                        <VisualRenderer 
                          type={message.visual.type}
                          data={message.visual.data}
                          description={message.visual.description}
                          width={150}
                          height={100}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className={`flex items-center gap-2 mt-2 text-xs text-muted-foreground ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(message.timestamp)}</span>
                    {message.type === 'brain' && (
                      <>
                        <span>•</span>
                        <span>Energy: {brainState?.energy || 0}%</span>
                        <span>•</span>
                        <span>Mood: {brainState?.mood || 0}</span>
                      </>
                    )}
                  </div>
                </div>
                
                {message.type === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
        
        {/* Processing indicator - only show when channel is open */}
        <AnimatePresence>
          {isProcessing && isChannelOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex gap-3 justify-start"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Brain className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="bg-muted border border-border/50 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
                  />
                  <span className="text-sm text-muted-foreground">Sentium is thinking...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border/50">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isChannelOpen ? "Type your message..." : "Open the channel to start chatting"}
              disabled={!isChannelOpen || isProcessing}
              className="w-full px-4 py-3 pr-12 text-sm bg-muted/50 border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 disabled:opacity-50"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || !isChannelOpen || isProcessing}
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Quick suggestions - only show when channel is open */}
        {!input.trim() && !isProcessing && isChannelOpen && (
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              "How are you feeling?",
              "What do you think about consciousness?",
              "Tell me about your memories",
              "Draw something for me",
              "What's your personality like?"
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setInput(suggestion);
                  // Focus textarea after setting suggestion
                  setTimeout(() => {
                    if (textareaRef.current) {
                      textareaRef.current.focus();
                    }
                  }, 10);
                }}
                className="px-3 py-1.5 text-xs bg-muted/50 hover:bg-muted rounded-full transition-colors border border-border/30 cursor-pointer"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ChatInterface; 