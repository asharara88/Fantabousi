/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from 'react';
import { Send, Volume2, VolumeX, Settings, Sparkles, X, HelpCircle, AlertCircle, Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import ChatMessage from './ChatMessage';
import { cn } from '../../utils/cn'; 
import { elevenlabsApi, Voice } from '../../api/elevenlabsApi';
import VoicePreferences from './VoicePreferences';
import { useServices } from '../../contexts/ServiceContext';
import { ErrorHandler } from '../../utils/errorHandler';
import { apiService } from '../../utils/apiService';
import { envManager } from '../../utils/envManager';

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

interface VoiceSettings {
  enabled: boolean;
  voiceId: string;
  stability: number;
  similarity_boost: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

declare global {
  interface Window {
    SpeechRecognition: new() => SpeechRecognition;
    webkitSpeechRecognition: new() => SpeechRecognition;
  }
}

const MyCoach: React.FC = () => {
  // Get service status from context
  const serviceContext = useServices();
  
  // Initialize error handler
  const errorHandler = ErrorHandler.getInstance();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionSetIndex, setCurrentQuestionSetIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [recentlyClickedQuestion, setRecentlyClickedQuestion] = useState<string | null>(null);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    enabled: false,
    voiceId: 'EXAVITQu4vr4xnSDxMaL', // Default voice ID
    stability: 0.5,
    similarity_boost: 0.75
  });
  const [, setAvailableVoices] = useState<Voice[]>([]);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isFetching, setIsFetching] = useState(false); 
  const [typingText, setTypingText] = useState('');
  const [typingTimeout, setTypingTimeout] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<SpeechRecognition | null>(null);
  const [voiceToVoiceMode, setVoiceToVoiceMode] = useState(false);
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const typingTimeoutRef = useRef<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Get current questions based on index
  const currentQuestions = QUESTION_SETS[currentQuestionSetIndex];

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognitionAPI();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0]?.[0]?.transcript || '';
        if (transcript.trim()) {
          setInput(transcript);
          if (voiceToVoiceMode) {
            // Auto-submit in voice-to-voice mode
            setTimeout(() => {
              handleSubmit(new Event('submit') as any, transcript);
            }, 500);
          }
        }
      };
      
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        let errorMessage: string;
        switch (event.error) {
          case 'not-allowed':
            setMicPermission('denied');
            errorMessage = 'Microphone access denied. Please enable microphone permissions in your browser settings.';
            break;
          case 'no-speech':
            errorMessage = 'No speech detected. Please try speaking again.';
            break;
          case 'network':
            errorMessage = 'Network error. Please check your internet connection and try again.';
            break;
          case 'audio-capture':
            errorMessage = 'Audio capture failed. Please check your microphone and try again.';
            break;
          case 'service-not-allowed':
            errorMessage = 'Speech recognition service not available. Please try again later.';
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
        }
        
        errorHandler.handleError(new Error(errorMessage));
        setError(errorMessage);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      setSpeechRecognition(recognition);
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
  }, [voiceToVoiceMode]);

  // Check microphone permission
  useEffect(() => {
    const checkMicPermission = async () => {
      try {
        const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        setMicPermission(result.state);
        
        result.addEventListener('change', () => {
          setMicPermission(result.state);
        });
      } catch (error) {
        console.warn('Could not check microphone permission:', error);
      }
    };
    
    checkMicPermission();
  }, []);

  // Load available voices on mount
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const isConfigured = await elevenlabsApi.isConfigured();
        
        if (isConfigured) {
          const voices = await elevenlabsApi.getVoices();
          if (voices && voices.length > 0) {
            setAvailableVoices(voices);
          }
        }
      } catch (error) {
        console.error("Error fetching voices:", error);
      }
    };
    fetchVoices();
  }, []);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Add initial greeting message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: "Hi there! I'm your MyCoach™ health assistant. How can I help you optimize your wellness today?",
          timestamp: new Date()
        }
      ]);
    }
  }, [messages.length]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }
      
      // Clear any active typing timeouts
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent, questionText?: string) => {
    e.preventDefault();
    
    // Use either the provided question or the input field value
    const messageText = questionText || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: `${messageText}${messageText.endsWith('?') ? '' : '?'}`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!questionText) setInput('');
    setIsLoading(true);
    setError(null);
    setIsFetching(true);
    
    // Start typing animation
    startTypingAnimation();

    try {
      // Use our new API service with fallback support
      const response = await apiService.callChatApi(messageText);
      
      if (!response.success && response.error) {
        throw new Error(response.error);
      }

      const assistantContent = response.data?.response || "I'm sorry, I couldn't process that request.";
      
      // Add fallback indicator if using demo mode
      const finalContent = response.fallback 
        ? `${assistantContent}\n\n*Note: Currently in demo mode. Configure API keys for full functionality.*`
        : assistantContent;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: finalContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Save to chat history if Supabase is properly configured
      if (envManager.getConfig().supabase.isConfigured) {
        try {
          const supabase = envManager.getSupabaseClient();
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            await supabase.from('chat_history').insert([
              {
                user_id: user.id,
                message: messageText,
                response: assistantContent,
                role: 'user',
                timestamp: new Date().toISOString()
              }
            ]);
          }
        } catch (chatError) {
          console.warn('Could not save chat history:', chatError);
          // Continue even if saving chat history fails
        }
      }

      // If voice is enabled, convert response to speech
      if (voiceSettings.enabled) {
        playTextToSpeech(assistantContent);
      }
      
      // Stop typing animation
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      setTypingTimeout(null);
      setTypingText('');
      setIsFetching(false);
      
      // If in voice-to-voice mode and voice is enabled, play response
      if (voiceToVoiceMode && voiceSettings.enabled && assistantContent) {
        playTextToSpeech(assistantContent);
      }
      
      // Update question set after each response
      setCurrentQuestionSetIndex((prevIndex) => 
        (prevIndex + 1) % QUESTION_SETS.length
      );
      
    } catch (err) {
      console.error('Error sending message:', err);
      
      // Use enhanced error handler
      const appError = errorHandler.handleError(err);
      setError(appError.message);
      
      // Stop typing animation
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      setTypingTimeout(null);
      setTypingText('');
      setIsFetching(false);
    } finally {
      setIsLoading(false);
    }
  };

  const startTypingAnimation = () => {
    const texts = [
      "Thinking",
      "Analyzing your question",
      "Checking health data",
      "Researching evidence",
      "Formulating response"
    ];
    
    let index = 0;
    
    const updateTypingText = () => {
      setTypingText(texts[index % texts.length]);
      index++;
      
      const timeout = window.setTimeout(updateTypingText, 3000);
      setTypingTimeout(timeout);
    };
    
    updateTypingText();
  };

  const startVoiceInput = async () => {
    if (!speechRecognition) {
      setError('Speech recognition not supported in this browser');
      return;
    }
    
    if (micPermission === 'denied') {
      setError('Microphone access denied. Please enable microphone permissions in your browser settings.');
      return;
    }
    
    try {
      // Request microphone permission if needed
      if (micPermission === 'prompt') {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
        setMicPermission('granted');
      }
      
      speechRecognition.start();
    } catch (error) {
      console.error('Error starting voice input:', error);
      setError('Could not access microphone. Please check your permissions.');
      setMicPermission('denied');
    }
  };

  const stopVoiceInput = () => {
    if (speechRecognition && isListening) {
      speechRecognition.stop();
    }
  };

  const toggleVoiceToVoice = () => {
    const newMode = !voiceToVoiceMode;
    setVoiceToVoiceMode(newMode);
    
    if (newMode) {
      // Enable voice settings when entering voice-to-voice mode
      setVoiceSettings(prev => ({ ...prev, enabled: true }));
    }
  };

  // Helper function to get color based on category
  const getCategoryColor = (category: string): string => {
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
      default:
        return 'bg-gray-500';
    }
  };

  const handleQuestionClick = (question: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setRecentlyClickedQuestion(question);
    handleSubmit(e, question);
    
    // Clear the recently clicked question after a delay
    setTimeout(() => {
      setRecentlyClickedQuestion(null);
    }, 3000);
  };

  const playTextToSpeech = async (text: string) => {
    try {
      // Check ElevenLabs service status before making request
      if (serviceContext && !serviceContext.services.elevenlabs) {
        console.warn('Voice synthesis is currently unavailable');
        return;
      }
      
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }

      setIsPlayingAudio(true);

      // Call ElevenLabs API
      const audioData = await elevenlabsApi.textToSpeech(
        text,
        voiceSettings.voiceId,
        {
          stability: voiceSettings.stability,
          similarity_boost: voiceSettings.similarity_boost
        }
      );

      if (!audioData) {
        throw new Error('Failed to generate speech');
      }

      // Create audio element
      const audio = new Audio();
      audioRef.current = audio;

      // Create blob and set as audio source
      const blob = new Blob([audioData], { type: 'audio/mpeg' });
      // Create object URL to play audio
      const url = URL.createObjectURL(blob);
      audio.src = url;

      // Play audio
      audio.onended = () => {
        setIsPlayingAudio(false);
        URL.revokeObjectURL(url);
      };

      audio.onerror = () => {
        // Clean up on error
        if (audioRef.current) {
          audioRef.current = null;
        }
        setIsPlayingAudio(false);
        console.error('Audio playback failed');
      };

      await audio.play();
    } catch (err) {
      console.error('Error with text-to-speech:', err);
      setIsPlayingAudio(false);
      
      // Use enhanced error handler
      errorHandler.handleError(err, { context: 'Voice synthesis' });
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    
    // Show typing indicator
    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
    }
    
    if (e.target.value.length > 0) {
      // Set typing timeout - could be used for typing indicators
      typingTimeoutRef.current = window.setTimeout(() => {
        typingTimeoutRef.current = null;
        // Additional typing indicator logic could go here
      }, 1000);
    }
  };
  
  // Clean up any timeouts on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="relative flex items-center justify-between p-5 overflow-hidden text-white shadow-md bg-gradient-to-r from-primary via-tertiary to-secondary rounded-t-xl">
        {/* Background pattern for header */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 translate-x-1/2 -translate-y-1/2 bg-white rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 -translate-x-1/2 translate-y-1/2 bg-white rounded-full"></div>
        </div>
        
        <div className="flex items-center">
          <Sparkles className="w-6 h-6 mr-2" />
          <h2 className="text-lg font-semibold">MyCoach<sup className="text-xs tracking-tighter">™</sup></h2>
          <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
            {voiceToVoiceMode ? 'Voice Mode' : 'Wellness AI'}
          </span>
        </div>
        <div className="flex items-center">
          <button
            onClick={toggleVoiceToVoice}
            className={cn(
              "p-2 rounded-full transition-colors mr-2",
              voiceToVoiceMode 
                ? "bg-green-500 hover:bg-green-600" 
                : "hover:bg-primary-dark"
            )}
            aria-label={voiceToVoiceMode ? "Disable voice-to-voice mode" : "Enable voice-to-voice mode"}
            title={voiceToVoiceMode ? "Voice-to-voice mode active" : "Enable voice-to-voice mode"}
          >
            {voiceToVoiceMode ? (
              <Volume2 size={20} className="text-white" />
            ) : (
              <Mic size={20} />
            )}
          </button>
          <button
            onClick={() => setVoiceSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
            className={cn(
              "p-2 rounded-full transition-colors",
              voiceSettings.enabled 
                ? "bg-primary-light hover:bg-primary-dark" 
                : "hover:bg-primary-dark"
            )}
            aria-label={voiceSettings.enabled ? "Disable voice responses" : "Enable voice responses"}
          >
            {voiceSettings.enabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <button
            onClick={() => setShowVoiceSettings(!showVoiceSettings)}
            className="p-2 transition-colors rounded-full hover:bg-primary-dark"
            aria-label="Voice settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Voice Settings Panel */}
      {showVoiceSettings && (
        <VoicePreferences
          settings={voiceSettings}
          onSettingsChange={setVoiceSettings}
          onClose={() => setShowVoiceSettings(false)}
          isPlayingAudio={isPlayingAudio}
          stopAudio={stopAudio}
        />
      )}

      {/* Service Status Banner */}
      {serviceContext && (!serviceContext.services.openai || !serviceContext.services.elevenlabs) && (
        <div className="p-3 mx-5 mt-3 border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 rounded-r-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {!serviceContext.services.openai && !serviceContext.services.elevenlabs
                  ? 'AI chat and voice features are currently unavailable'
                  : !serviceContext.services.openai
                  ? 'AI chat features are currently unavailable'
                  : 'Voice features are currently unavailable'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 p-5 space-y-5 overflow-y-auto transition-all duration-300 bg-gray-50 dark:bg-gray-700">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isLoading={false}
          />
        ))}
        {isFetching && (
          <div className="flex flex-col p-4 space-y-2 text-gray-700 bg-white shadow-md dark:text-white dark:bg-gray-600 rounded-xl w-fit">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span className="tracking-wide">
                MyCoach<sup className="text-xs">™</sup> {typingText || 'is thinking...'}
                <span className="inline-block animate-pulse">...</span>
              </span>
            </div>
            <div className="flex ml-6 space-x-1">
              <div className="w-2 h-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        {error && (
          <div className="p-4 font-medium text-red-700 shadow-md bg-red-50 dark:bg-red-900/20 dark:text-red-300 rounded-xl">
            <AlertCircle className="inline-block w-4 h-4 mr-2" />
            <span className="tracking-wide">{error}</span>
          </div>
        )}
        
        {/* Suggested Questions */}
        {!isLoading && messages.length > 0 && messages[messages.length - 1].role === 'assistant' && (
          <div className="flex flex-wrap gap-3 mt-5 mb-3">
            <div className="flex items-center w-full mb-4">
              <HelpCircle className="w-4 h-4 mr-2 text-primary" />
              <span className="text-sm font-medium tracking-wide text-gray-600 dark:text-gray-300">
                Suggested questions:
              </span>
            </div>
            {currentQuestions && currentQuestions.map((questionObj, index) => (
              <motion.button
                key={index}
                onClick={handleQuestionClick(questionObj.text)}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg",
                  "flex-grow md:flex-grow-0 relative overflow-hidden",
                  recentlyClickedQuestion === questionObj.text 
                    ? "bg-primary text-white" 
                    : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
              >
                <span className={`absolute left-0 top-0 h-full w-1.5 ${getCategoryColor(questionObj.category)}`}></span>
                <span className="pl-5 tracking-wide">{questionObj.text}</span>
              </motion.button>
            ))}
          </div>
        )}
        
        {isPlayingAudio && (
          <div className="fixed bottom-24 right-5 bg-primary text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center space-x-3">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="tracking-wide">Speaking...</span>
            <button
              onClick={stopAudio}
              className="ml-2 p-1.5 hover:bg-primary-dark rounded-full"
            >
              <X size={16} />
            </button>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-5 transition-all duration-300 bg-white border-t border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-end space-x-3">
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={isListening ? stopVoiceInput : startVoiceInput}
            disabled={isLoading}
            className={cn(
              "h-12 w-12 p-0 flex items-center justify-center rounded-full transition-all duration-300",
              isListening 
                ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" 
                : micPermission === 'denied'
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400"
            )}
            aria-label={isListening ? "Stop listening" : "Start voice input"}
            title={
              micPermission === 'denied' 
                ? "Microphone access denied"
                : isListening 
                  ? "Click to stop listening" 
                  : "Click to start voice input"
            }
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          
          <div className="relative flex-1">
            <div className="relative">
              {isListening && (
                <div className="absolute flex items-center top-2 left-3">
                  <div className="w-2 h-2 mr-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-red-500">Listening...</span>
                </div>
              )}
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={
                voiceToVoiceMode 
                  ? "Click the microphone to speak or type here..." 
                  : "Ask about your health, supplements, or wellness goals..."
              }
              className={cn(
                "w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 transition-all duration-300 shadow-inner tracking-wide",
                isListening && "border-red-500 focus:ring-red-500",
                voiceToVoiceMode && "border-green-500 focus:ring-green-500"
              )}
              rows={2}
              disabled={isLoading}
            />
            </div>
          </div>
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex items-center justify-center w-12 h-12 p-0 rounded-full shadow-lg bg-gradient-to-r from-primary via-tertiary to-secondary"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Voice Mode Indicator */}
        {voiceToVoiceMode && (
          <div className="flex items-center mt-3 text-xs text-green-600 dark:text-green-400">
            <Volume2 className="w-4 h-4 mr-1" />
            <span>Voice-to-voice mode active - Speak naturally for hands-free interaction</span>
          </div>
        )}
        
        {/* Microphone Status */}
        {micPermission === 'denied' && (
          <div className="p-2 mt-3 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800">
            <div className="flex items-center text-xs text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span>Microphone access required for voice input. Please enable in browser settings.</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default MyCoach;