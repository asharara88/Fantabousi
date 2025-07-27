import React, { useState } from 'react';
import { User, Sparkles, ThumbsUp } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
  onReaction?: (messageId: string, reaction: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isLoading = false,
  onReaction 
}) => {
  const isUser = message.role === 'user';
  const [showReactions, setShowReactions] = useState(false);
  
  return (
    <motion.div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 relative group`}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 flex items-start mt-1 ${isUser ? 'ml-4' : 'mr-4'}`}>
          <motion.div 
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center shadow-md",
              isUser 
                ? "bg-primary text-white" 
                : "bg-white dark:bg-gray-700 text-primary dark:text-white"
            )}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {isUser ? <User size={18} /> : <Sparkles size={18} />}
          </motion.div>
        </div>
        
        <motion.div 
          className={cn(
            "rounded-xl p-5 shadow-md text-left",
            isUser 
              ? "bg-primary text-white" 
              : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          )}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-sm whitespace-pre-wrap leading-relaxed tracking-wide">{message.content}</div>
          <div className={cn(
            "text-xs mt-3",
            isUser 
              ? "text-white/90" 
              : "text-gray-600 dark:text-white/90"
          )}>
            {format(new Date(message.timestamp), 'h:mm a')}
          </div>
        </motion.div>
        
        {!isUser && onReaction && (
          <motion.div 
            className={`absolute ${isUser ? 'left-0' : 'right-0'} -bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
            animate={{ y: showReactions ? 0 : 10 }}
          >
            <button
              className="p-1.5 bg-white dark:bg-gray-700 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-600"
              onClick={() => onReaction?.(message.id, 'like')}
              aria-label="Like message"
            >
              <ThumbsUp className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;