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
  MessageCircle,
  Bot,
  Wifi,
  WifiOff
} from "lucide-react";
import { BrainState, CanvasData, PatternData } from "../../lib/types";
import VisualRenderer from "../ui/visual-renderer";
import { formatPercentage } from "../../lib/utils";

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

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
  brainState: BrainState;
  onToggleChannel: () => void;
  isChannelOpen: boolean;
  color?: string;
  accentColor?: string;
  brainIcon?: React.ElementType;
}

const GROUP_TIME_WINDOW_MS = 3 * 60 * 1000; // 3 minutes

function groupMessages(messages: ChatMessage[]) {
  if (!messages.length) return [];
  const groups = [];
  let currentGroup: ChatMessage[] = [messages[0]];
  for (let i = 1; i < messages.length; i++) {
    const prev = messages[i - 1];
    const curr = messages[i];
    const sameSender = prev.type === curr.type;
    const closeInTime = Math.abs(new Date(curr.timestamp).getTime() - new Date(prev.timestamp).getTime()) <= GROUP_TIME_WINDOW_MS;
    if (sameSender && closeInTime) {
      currentGroup.push(curr);
    } else {
      groups.push(currentGroup);
      currentGroup = [curr];
    }
  }
  groups.push(currentGroup);
  return groups;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isProcessing,
  brainState,
  onToggleChannel,
  isChannelOpen,
  color = '#3B82F6',
  accentColor = '#60A5FA',
  brainIcon: BrainIconComponent = Brain
}) => {
  // Helper function to convert hex color to rgba with opacity
  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [openMetaGroupIdx, setOpenMetaGroupIdx] = useState<number | null>(null);
  const groupedMessages = groupMessages(messages);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
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
    <div className="flex flex-col h-[100dvh] md:bg-background md:rounded-xl md:bg-gradient-to-br md:from-background md:to-secondary/20 md:border md:my-8 md:mx-auto md:max-w-2xl">
      {/* Chat Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border-b border-border/50 gap-2 sm:gap-0"
        style={{ background: `linear-gradient(135deg, ${color}10, ${accentColor}10)` }}>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 rounded-lg" style={{ background: `linear-gradient(135deg, ${color}, ${accentColor})` }}>
            <MessageCircle className="w-5 h-5" style={{ color: '#fff' }} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-base sm:text-lg">Communication Channel</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {isChannelOpen ? 'Open - Free conversation' : 'Closed - Click to open'}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Channel Status */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border transition-colors duration-200 w-max`}
              style={isChannelOpen ? {
                background: hexToRgba(accentColor, 0.08),
                color: accentColor,
                borderColor: hexToRgba(accentColor, 0.33)
              } : {
                background: hexToRgba(color, 0.08),
                color: color,
                borderColor: hexToRgba(color, 0.33)
              }}>
              {isChannelOpen ? (
                <>
                  <Wifi className="w-3 h-3" style={{ color: accentColor }} />
                  <span className="hidden xs:inline">Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3" style={{ color: color }} />
                  <span className="hidden xs:inline">Disconnected</span>
                </>
              )}
            </div>
          </div>
          {/* Toggle Channel Button */}
          <Button
            onClick={onToggleChannel}
            variant="outline"
            size="sm"
            className="text-xs font-semibold border-2 w-full sm:w-auto"
            style={isChannelOpen ? {
              color: accentColor,
              borderColor: accentColor,
              background: hexToRgba(accentColor, 0.06)
            } : {
              color: color,
              borderColor: color,
              background: hexToRgba(color, 0.06)
            }}
          >
            {isChannelOpen ? 'Close Channel' : 'Open Channel'}
          </Button>
          <Badge variant="secondary" className="text-[10px] sm:text-xs px-2 py-0.5 sm:px-3 sm:py-1 w-max">
            {messages.length} messages
          </Badge>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-2 md:px-4 py-3 md:py-4 space-y-4 md:space-y-4"
        style={{ minHeight: 0 }}
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
            groupedMessages.map((group, groupIdx) => {
              const first = group[0];
              const isUser = first.type === 'user';
              const showMeta = openMetaGroupIdx === groupIdx;
              return (
                <div
                  key={first.id + '-' + group.length}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}
                  onClick={() => {
                    if (window.innerWidth < 768) setOpenMetaGroupIdx(openMetaGroupIdx === groupIdx ? null : groupIdx);
                  }}
                  style={{ cursor: window.innerWidth < 768 ? 'pointer' : 'default' }}
                >
                  {first.type === 'brain' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${color}, ${accentColor})` }}>
                      <BrainIconComponent className="w-4 h-4" style={{ color: '#fff' }} />
                    </div>
                  )}
                  <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}> 
                    {group.map((message, i) => (
                      <div
                        key={message.id}
                        className={`rounded-2xl px-4 py-3 mb-1 last:mb-0 md:bg-muted md:border md:border-border/50`}
                        style={isUser
                          ? { background: `linear-gradient(135deg, ${color}22, ${accentColor}11)`, color: '#fff' }
                          : { background: `linear-gradient(135deg, ${accentColor}22, ${color}11)`, color: '#fff' }}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
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
                    ))}
                    {/* Meta info: only show on md+ screens, or on mobile if group is open */}
                    <div className={`${showMeta ? '' : 'hidden'} md:flex items-center gap-2 mt-2 text-xs text-muted-foreground ${isUser ? 'justify-end' : 'justify-start'}`.replace('$', '')}>
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(new Date(first.timestamp))}</span>
                      {first.type === 'brain' && (
                        <>
                          <span>•</span>
                          <span>Energy: {formatPercentage(brainState?.energy)}</span>
                          <span>•</span>
                          <span>Mood: {formatPercentage(brainState?.mood, { signed: true })}</span>
                        </>
                      )}
                    </div>
                    {/* Remove the tap-to-reveal hint on mobile */}
                    {window.innerWidth < 768 && !showMeta && (
                      <div className="md:hidden text-xs text-muted-foreground text-center mt-1 opacity-60 select-none">Tap message for details</div>
                    )}
                  </div>
                  {isUser && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              );
            })
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

      {/* Input Area - sticky on mobile */}
      <div className="px-2 md:px-4 py-2 md:py-4 border-t border-border/50 bg-background/95 md:bg-transparent sticky bottom-0 z-10 shadow-[0_-2px_8px_0_rgba(0,0,0,0.04)] md:static">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isChannelOpen ? "Type your message..." : "Open the channel to start chatting"}
              disabled={!isChannelOpen || isProcessing}
              className="w-full px-4 py-3 pr-12 text-sm bg-muted/50 border border-border rounded-xl resize-none focus:outline-none disabled:opacity-50"
              rows={1}
              style={{
                minHeight: '44px',
                maxHeight: '120px',
                boxShadow: input && document.activeElement === textareaRef.current ? `0 0 0 2px ${hexToRgba(accentColor, 0.33)}` : undefined,
                borderColor: input && document.activeElement === textareaRef.current ? accentColor : undefined
              }}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || !isChannelOpen || isProcessing}
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 border-2"
              style={{
                background: accentColor,
                color: '#fff',
                borderColor: accentColor
              }}
            >
              <Send className="w-4 h-4" style={{ color: '#fff' }} />
            </Button>
          </div>
        </div>
        
        {/* Quick suggestions - only show when channel is open */}
        {messages.length === 0 && !input.trim() && !isProcessing && isChannelOpen && (
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
    </div>
  );
};

export default ChatInterface; 