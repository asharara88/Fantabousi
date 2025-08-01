import React, { useState, useRef, useEffect } from 'react';
import { Send, Volume2, VolumeX, Loader2, Settings, Sparkles, X, HelpCircle, Check, AlertCircle, Mic, MicOff, Brain, Target, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import ChatMessage from './ChatMessage';
import { supabase } from '../../lib/supabase';
import { cn } from '../../utils/cn'; 
import { elevenlabsApi, Voice } from '../../api/elevenlabsApi';
import VoicePreferences from './VoicePreferences';
import { SessionManager, HealthDomain, sessionManager } from '../../services/contextualIntelligence';
import { useUserProfileStore } from '../../store/useUserProfileStore';

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

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
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
    SpeechRecognition: {
      new(): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new(): SpeechRecognition;
    };
  }
}

const MyCoach: React.FC = () => {
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
  const [availableVoices, setAvailableVoices] = useState<Voice[]>([]);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isFetching, setIsFetching] = useState(false); 
  const [typingText, setTypingText] = useState('');
  const [typingTimeout, setTypingTimeout] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<SpeechRecognition | null>(null);
  const [voiceToVoiceMode, setVoiceToVoiceMode] = useState(false);
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  
  // Contextual Intelligence State
  const [sessionManager, setSessionManager] = useState<SessionManager | null>(null);
  const [currentDomain, setCurrentDomain] = useState<HealthDomain>('nutrition');
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  const typingTimeoutRef = useRef<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Get user profile for context
  const { profile } = useUserProfileStore();

  // Check for required API keys
  const checkApiConfiguration = () => {
    const openaiConfigured = !!import.meta.env.VITE_OPENAI_API_KEY;
    const elevenlabsConfigured = !!import.meta.env.VITE_ELEVENLABS_API_KEY;
    
    if (!openaiConfigured) {
      console.warn('VITE_OPENAI_API_KEY not configured in .env file');
    }
    if (!elevenlabsConfigured) {
      console.warn('VITE_ELEVENLABS_API_KEY not configured in .env file');
    }
    
    return { openaiConfigured, elevenlabsConfigured };
  };

  // Initialize contextual intelligence service
  useEffect(() => {
    const initializeContextualIntelligence = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Create or load session using the imported sessionManager
          const session = await sessionManager.createSession(user.id, 'nutrition');
          setSessionId(session.id);
        }
      } catch (error) {
        console.error('Failed to initialize contextual intelligence:', error);
      }
    };

    initializeContextualIntelligence();
  }, [supabase]);

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
        if (event.error === 'not-allowed') {
          setMicPermission('denied');
          setError('Microphone access denied. Please enable microphone permissions.');
        } else {
          setError(`Speech recognition error: ${event.error}`);
        }
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

  // Get current question set
  const currentQuestions = QUESTION_SETS[currentQuestionSetIndex];

  // Add initial greeting message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: "Hi there! I'm your Smart Coach health assistant. How can I help you optimize your wellness today?",
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

  // Helper function for basic OpenAI calls (fallback)
  const callBasicOpenAI = async (messageText: string) => {
    const { data, error: apiError } = await supabase.functions.invoke('contextual-openai-proxy', {
      body: {
        messages: [ 
          ...messages.map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: messageText }
        ],
        userContext: profile ? {
          profile: {
            firstName: profile.firstName,
            age: profile.age,
            healthGoals: profile.primaryHealthGoals,
            activityLevel: profile.activityLevel
          }
        } : null
      }
    });

    if (apiError) throw new Error(apiError.message);
    return data;
  };

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
    setIsFetching(true);
    
    // Start typing animation
    startTypingAnimation();

    try {
      let responseData;
      
      // Use direct OpenAI API call
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a knowledgeable health and wellness coach. Provide helpful, evidence-based advice on nutrition, fitness, supplements, and general wellness. Be encouraging and supportive.'
            },
            ...messages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text
            })),
            {
              role: 'user',
              content: messageText
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      responseData = {
        response: data.choices[0]?.message?.content || 'Sorry, I could not generate a response.',
        context_enhanced: false
          
        } catch (contextError) {
          console.warn('Contextual intelligence failed, falling back to basic mode:', contextError);
          responseData = await callBasicOpenAI(messageText);
        }
      } else {
        // Fallback to basic OpenAI call
        responseData = await callBasicOpenAI(messageText);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseData.result || responseData.response || "I'm sorry, I couldn't process that request.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Update session with assistant response
      if (sessionManager && sessionId) {
        try {
          // Just update the session activity timestamp
          console.log('Session updated with new activity');
        } catch (sessionError) {
          console.warn('Failed to update session:', sessionError);
        }
      }

      // Save to chat history (enhanced with context info)
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          await supabase.from('chat_history').insert([
            {
              user_id: user.id,
              message: messageText,
              response: assistantMessage.content,
              session_id: sessionId,
              domain: currentDomain,
              context_enhanced: !!contextualService,
              timestamp: new Date().toISOString()
            }
          ]);
        }
      } catch (chatError) {
        console.error('Error saving chat history:', chatError);
      }

      // If voice is enabled, convert response to speech
      if (voiceSettings.enabled) {
        playTextToSpeech(assistantMessage.content);
      }
      
      // Stop typing animation
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      setTypingTimeout(null);
      setTypingText('');
      setIsFetching(false);
      
      // If in voice-to-voice mode and voice is enabled, play response
      if (voiceToVoiceMode && voiceSettings.enabled && assistantMessage.content) {
        playTextToSpeech(assistantMessage.content);
      }
      
      // Update question set after each response
      setCurrentQuestionSetIndex((prevIndex) => 
        (prevIndex + 1) % QUESTION_SETS.length
      );
      
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to get a response. Please try again.');
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
      
      const timeout = setTimeout(updateTypingText, 3000);
      setTypingTimeout(timeout as unknown as number);
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
        console.error('Error playing audio');
      };

      await audio.play();
    } catch (err) {
      console.error('Error with text-to-speech:', err);
      setIsPlayingAudio(false);
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
      <div className="bg-gradient-to-r from-primary via-tertiary to-secondary text-white p-5 flex items-center justify-between rounded-t-xl shadow-md relative overflow-hidden">
        {/* Background pattern for header */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
        </div>
        
        <div className="flex items-center">
          <Sparkles className="w-6 h-6 mr-2" />
          <h2 className="text-lg font-semibold">Smart Coach</h2>
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
            className="p-2 rounded-full hover:bg-primary-dark transition-colors"
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gray-50 dark:bg-gray-700 transition-all duration-300">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isLoading={false}
          />
        ))}
        {isFetching && (
          <div className="flex flex-col space-y-2 text-gray-700 dark:text-white p-4 bg-white dark:bg-gray-600 rounded-xl w-fit shadow-md">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span className="tracking-wide">
                Smart Coach {typingText || 'is thinking...'}
                <span className="inline-block animate-pulse">...</span>
              </span>
            </div>
            <div className="flex space-x-1 ml-6">
              <div className="w-2 h-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl font-medium shadow-md">
            <AlertCircle className="w-4 h-4 inline-block mr-2" />
            <span className="tracking-wide">{error}</span>
          </div>
        )}
        
        {/* Suggested Questions */}
        {!isLoading && messages.length > 0 && messages[messages.length - 1].role === 'assistant' && (
          <div className="flex flex-wrap gap-3 mt-5 mb-3">
            <div className="w-full flex items-center mb-4">
              <HelpCircle className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 tracking-wide">
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

      {/* Health Domain Switcher */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-5 py-3 bg-gray-50 dark:bg-gray-750">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Coaching Focus:
            </span>
          </div>
          <div className="flex space-x-2">
            {(['nutrition', 'fitness', 'sleep', 'supplements', 'stress'] as HealthDomain[]).map(domain => (
              <button
                key={domain}
                onClick={() => setCurrentDomain(domain)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                  currentDomain === domain
                    ? "bg-primary text-white shadow-sm"
                    : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                )}
              >
                {domain.charAt(0).toUpperCase() + domain.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {contextualService && sessionId && (
          <div className="flex items-center space-x-2 mt-2">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Contextual AI Active
              </span>
            </div>
            <div className="text-xs text-gray-400">
              Session: {sessionId.substring(0, 8)}...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-700 p-5 bg-white dark:bg-gray-800 transition-all duration-300">
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
          
          <div className="flex-1 relative">
            <div className="relative">
              {isListening && (
                <div className="absolute top-2 left-3 flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-xs text-red-500 font-medium">Listening...</span>
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
            className="h-12 w-12 p-0 flex items-center justify-center rounded-full bg-gradient-to-r from-primary via-tertiary to-secondary shadow-lg"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Voice Mode Indicator */}
        {voiceToVoiceMode && (
          <div className="mt-3 flex items-center text-xs text-green-600 dark:text-green-400">
            <Volume2 className="w-4 h-4 mr-1" />
            <span>Voice-to-voice mode active - Speak naturally for hands-free interaction</span>
          </div>
        )}
        
        {/* Microphone Status */}
        {micPermission === 'denied' && (
          <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
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