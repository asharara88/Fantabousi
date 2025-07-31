import React, { useState, useRef, useEffect } from 'react';
import { Send, Volume2, VolumeX, Loader2, HelpCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import ChatMessage from './ChatMessage';
import { createClient } from '@supabase/supabase-js';
import { cn } from '../../utils/cn'; 

// Sample question sets that will rotate after each response
const QUESTION_SETS = [
  [
    { text: "How can I sleep better?", category: "sleep" },
    { text: "What supplements should I take?", category: "supplements" },
    { text: "How can I boost my metabolism?", category: "metabolism" },
    { text: "What's a good fitness routine?", category: "fitness" }
  ],
  [
    { text: "What foods are good for my brain?", category: "nutrition" },
    { text: "How much protein do I need?", category: "nutrition" },
    { text: "How can I track my health?", category: "tracking" },
    { text: "How important is hydration?", category: "hydration" }
  ],
  [
    { text: "How can I reduce stress?", category: "stress" },
    { text: "How do I know if I have a deficiency?", category: "health" },
    { text: "What's a balanced meal?", category: "nutrition" },
    { text: "How can I get more energy?", category: "energy" }
  ],
  [
    { text: "How does sleep affect hormones?", category: "sleep" },
    { text: "How can I eat better for weight loss?", category: "nutrition" },
    { text: "Why is strength training important?", category: "fitness" },
    { text: "How can I recover faster from a workout?", category: "recovery" }
  ],
  [
    { text: "What vitamins should I take?", category: "supplements" },
    { text: "How can I stay healthy long-term?", category: "longevity" },
    { text: "What's the best time to exercise?", category: "fitness" },
    { text: "How can I improve my mental focus?", category: "cognitive" }
  ]
];

// Define message type
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIHealthCoach: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentlyClickedQuestion, setRecentlyClickedQuestion] = useState<string | null>(null);
  const [currentQuestionSetIndex, setCurrentQuestionSetIndex] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize Supabase client
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Get current question set
  const currentQuestions = QUESTION_SETS[currentQuestionSetIndex];

  // Add initial greeting message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: "Hi there! I'm your Biowell Smart Coach. How can I help you optimize your wellness today?",
          timestamp: new Date()
        }
      ]);
    }
  }, [messages.length]);

  const handleSubmit = async (e: React.FormEvent, questionText?: string) => {
    e.preventDefault();
    
    // Use either the provided question or the input field value
    const messageText = questionText || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!questionText) setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Call OpenAI proxy function
      const { data, error: apiError } = await supabase.functions.invoke('openai-proxy', {
        body: {
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: messageText }
          ]
        }
      });

      if (apiError) throw new Error(apiError.message);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.result || "I'm sorry, I couldn't process that request.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Save to chat history
      await supabase.from('chat_history').insert([
        {
          user_id: (await supabase.auth.getUser()).data.user?.id,
          message: messageText,
          response: data.result,
          role: 'user',
          timestamp: new Date().toISOString()
        }
      ]);

      // If voice is enabled, convert response to speech
      if (voiceEnabled) {
        playTextToSpeech(data.result);
      }
      
      // Update question set after each response
      setCurrentQuestionSetIndex((prevIndex) => 
        (prevIndex + 1) % QUESTION_SETS.length
      );
      
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to get a response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionClick = (question: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setRecentlyClickedQuestion(question);
    handleSubmit(e, question);
    
    // Clear the recently clicked question after a delay
    setTimeout(() => {
      setRecentlyClickedQuestion(null);
    }, 2000);
  };

  const playTextToSpeech = async (text: string) => {
    try {
      // Call ElevenLabs proxy function if implemented
      console.log('Would play text to speech:', text);
      // Implement actual TTS functionality when ElevenLabs is set up
    } catch (err) {
      console.error('Error with text-to-speech:', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-200 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-tertiary to-secondary text-white p-4 flex items-center justify-between rounded-t-lg shadow-sm">
        <div className="flex items-center">
          <img
            src="/logos/biowell-dark.svg"
            alt="Biowell Logo" 
            className="h-8 w-auto mr-3 object-contain" 
          />
          <h2 className="text-lg font-semibold">Smart Coach</h2>
        </div>
        <button
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className={cn(
            "p-2 rounded-full transition-colors",
            voiceEnabled 
              ? "bg-primary-light hover:bg-primary-dark" 
              : "hover:bg-primary-dark"
          )}
          aria-label={voiceEnabled ? "Disable voice responses" : "Enable voice responses"}
        >
          {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-700 transition-all duration-200">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isLoading={false}
          />
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-gray-700 dark:text-white p-3 bg-white dark:bg-gray-600 rounded-lg w-fit shadow-md">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Biowell AI is thinking...</span>
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg font-medium shadow-sm">
            <AlertCircle className="w-4 h-4 inline-block mr-2" />
            {error}
          </div>
        )}
        
        {/* Suggested Questions */}
        {!isLoading && messages.length > 0 && messages[messages.length - 1].role === 'assistant' && (
          <div className="flex flex-wrap gap-2 mt-4 mb-2">
            <div className="w-full flex items-center mb-3">
              <HelpCircle className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Suggested questions:
              </span>
            </div>
            {currentQuestions.map((questionObj, index) => (
              <motion.button
                key={index}
                onClick={(e) => handleQuestionClick(questionObj.text)(e)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow",
                  "flex-grow md:flex-grow-0 relative overflow-hidden",
                  recentlyClickedQuestion === questionObj.text
                    ? "bg-primary text-white" 
                    : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                aria-label={`Ask about ${questionObj.text}`}
              >
                <span className={`absolute left-0 top-0 h-full w-1 ${getCategoryColor(questionObj.category)}`}></span>
                <span className="pl-4">{questionObj.text}</span>
              </motion.button>
            ))}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 transition-all duration-200">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your health, supplements, or wellness goals..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 transition-all duration-200 shadow-inner"
              rows={2}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="h-10 w-10 p-0 flex items-center justify-center rounded-full bg-gradient-to-r from-primary via-tertiary to-secondary"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        <div className="mt-2 text-xs text-gray-700 dark:text-gray-300 transition-all duration-200 font-medium">
          <p>Your Smart Coach provides general wellness guidance based on your inputs. Not medical advice.</p>
        </div>
      </form>
    </div>
  );
  
  // Helper function to get color based on category
  function getCategoryColor(category: string): string {
    switch (category) {
      case 'sleep':
        return 'bg-purple-500';
      case 'supplements':
        return 'bg-green-500';
      case 'nutrition':
        return 'bg-blue-500';
      case 'fitness':
        return 'bg-orange-500';
      case 'metabolism':
        return 'bg-red-500';
      case 'hydration':
        return 'bg-cyan-500';
      case 'stress':
        return 'bg-pink-500';
      case 'energy':
        return 'bg-yellow-500';
      case 'recovery':
        return 'bg-indigo-500';
      case 'cognitive':
        return 'bg-emerald-500';
      case 'longevity':
        return 'bg-violet-500';
      case 'tracking':
        return 'bg-amber-500';
      case 'health':
        return 'bg-teal-500';
      default:
        return 'bg-gray-500';
    }
  }
};

export default AIHealthCoach;