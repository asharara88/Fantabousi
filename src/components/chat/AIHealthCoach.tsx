import React, { useState, useRef, useEffect } from 'react';
import { Send, VolumeX, Volume2, RefreshCw, AlertCircle, CheckCircle, Loader2, HelpCircle, Mic, MicOff } from 'lucide-react';
import { elevenlabsApi } from '../../api/elevenlabsApi';
import { debugAudioIssues, handleAudioError, AudioDiagnostics } from '../../utils/audioDebugger';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import ChatMessage from './ChatMessage';
import { createClient } from '@supabase/supabase-js';
import { cn } from '../../utils/cn';

// Extend Window interface for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

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
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [audioStatus, setAudioStatus] = useState<'idle' | 'testing' | 'ready' | 'error'>('idle');
  const [audioDiagnostics, setAudioDiagnostics] = useState<AudioDiagnostics | null>(null);
  
  // Voice input states
  const [isRecording, setIsRecording] = useState(false);
  const [voiceInputEnabled, setVoiceInputEnabled] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<SpeechRecognition | null>(null);
  const [voiceInputError, setVoiceInputError] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  
  // Microphone permission states
  const [micPermission, setMicPermission] = useState<'prompt' | 'granted' | 'denied' | 'checking'>('prompt');
  const [isCheckingMic, setIsCheckingMic] = useState(false);
  
  // Voice-to-Voice mode states
  const [voiceToVoiceMode, setVoiceToVoiceMode] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
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

  // Audio diagnostics and testing
  const runAudioDiagnostics = async () => {
    setAudioStatus('testing');
    setAudioError(null);
    
    try {
      const diagnostics = await debugAudioIssues();
      setAudioDiagnostics(diagnostics);
      
      if (diagnostics.isUserAuthenticated && diagnostics.isElevenLabsConfigured && diagnostics.canAccessElevenLabsApi) {
        setAudioStatus('ready');
      } else {
        setAudioStatus('error');
        const firstError = diagnostics.errorMessages[0] || 'Audio system not available';
        setAudioError(firstError);
      }
    } catch (error) {
      console.error('Audio diagnostics failed:', error);
      setAudioStatus('error');
      setAudioError('Failed to test audio system');
    }
  };

  // Enhanced text-to-speech function with better error handling and user feedback
  const playTextToSpeech = async (text: string) => {
    if (!voiceEnabled || isGeneratingAudio) return;
    
    setIsGeneratingAudio(true);
    setAudioError(null);
    
    try {
      console.log('🎵 Generating audio for text:', text.substring(0, 50) + '...');
      
      // Check if ElevenLabs is available
      const isConfigured = await elevenlabsApi.isConfigured();
      if (!isConfigured) {
        throw new Error('ElevenLabs API not configured');
      }
      
      // Use ElevenLabs API to generate audio
      const audioBuffer = await elevenlabsApi.textToSpeech(
        text,
        'EXAVITQu4vr4xnSDxMaL', // Default voice ID (Adam from ElevenLabs)
        { 
          stability: 0.5, 
          similarity_boost: 0.75 
        }
      );
      
      if (!audioBuffer) {
        throw new Error('Failed to generate audio - no data returned');
      }
      
      // Create audio blob and play
      const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Clean up previous audio
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        URL.revokeObjectURL(audioElementRef.current.src);
      }
      
      // Create and play new audio
      const audio = new Audio(audioUrl);
      audioElementRef.current = audio;
      
      // Set up event handlers
      audio.onloadstart = () => {
        console.log('🎵 Audio loading started');
      };
      
      audio.oncanplay = () => {
        console.log('🎵 Audio can start playing');
      };
      
      audio.onended = () => {
        console.log('🎵 Audio playback completed');
        URL.revokeObjectURL(audioUrl);
        setIsGeneratingAudio(false);
      };
      
      audio.onerror = (e) => {
        console.error('🎵 Audio playback error:', e);
        setAudioError('Failed to play audio - check your device audio settings');
        URL.revokeObjectURL(audioUrl);
        setIsGeneratingAudio(false);
      };
      
      // Start playback
      await audio.play();
      console.log('✅ Audio playback started successfully');
      
    } catch (error) {
      console.error('🎵 Text-to-speech error:', error);
      
      const errorInfo = handleAudioError(error, 'Text-to-speech generation');
      setAudioError(errorInfo.userMessage);
      setIsGeneratingAudio(false);
      
      // Show detailed error in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Detailed TTS error:', {
          error: errorInfo.technicalDetails,
          timestamp: new Date().toISOString()
        });
      }
      
      // Provide fallback feedback
      console.log('💡 TTS failed, consider using browser\'s built-in speech synthesis as fallback');
      
      // Try browser's built-in speech synthesis as fallback
      if ('speechSynthesis' in window && window.speechSynthesis) {
        try {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 0.9;
          utterance.pitch = 1;
          utterance.volume = 0.8;
          
          utterance.onstart = () => {
            console.log('🎵 Using browser TTS fallback');
            setAudioError('Using browser voice (ElevenLabs unavailable)');
          };
          
          utterance.onend = () => {
            setIsGeneratingAudio(false);
            setAudioError(null);
          };
          
          utterance.onerror = () => {
            setIsGeneratingAudio(false);
            setAudioError('Voice synthesis failed');
          };
          
          window.speechSynthesis.speak(utterance);
        } catch (fallbackError) {
          console.error('Browser TTS fallback also failed:', fallbackError);
          setIsGeneratingAudio(false);
        }
      } else {
        setIsGeneratingAudio(false);
      }
    }
  };

  // Test audio on voice enable
  const handleVoiceToggle = async () => {
    if (!voiceEnabled) {
      // Enabling voice - run diagnostics first
      await runAudioDiagnostics();
      if (audioStatus === 'ready') {
        setVoiceEnabled(true);
        // Test with a short phrase
        await playTextToSpeech('Audio is now enabled.');
      }
    } else {
      // Disabling voice
      setVoiceEnabled(false);
      setAudioError(null);
      
      // Stop any playing audio
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        URL.revokeObjectURL(audioElementRef.current.src);
      }
    }
  };

  // Run initial audio check on component mount
  useEffect(() => {
    runAudioDiagnostics();
    checkMicrophonePermission();
  }, []);

  // Microphone permission management
  const checkMicrophonePermission = async () => {
    setIsCheckingMic(true);
    
    try {
      // Check if navigator.permissions is available
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        setMicPermission(permission.state as 'granted' | 'denied' | 'prompt');
        
        // Listen for permission changes
        permission.onchange = () => {
          setMicPermission(permission.state as 'granted' | 'denied' | 'prompt');
        };
      } else {
        // Fallback: try to access microphone directly
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(track => track.stop()); // Clean up
          setMicPermission('granted');
        } catch (error) {
          console.warn('Microphone permission check failed:', error);
          setMicPermission('denied');
        }
      }
    } catch (error) {
      console.error('Error checking microphone permission:', error);
      setMicPermission('prompt');
    } finally {
      setIsCheckingMic(false);
    }
  };

  const requestMicrophonePermission = async () => {
    setIsCheckingMic(true);
    setVoiceInputError(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      // Permission granted, clean up the stream
      stream.getTracks().forEach(track => track.stop());
      setMicPermission('granted');
      console.log('🎤 Microphone permission granted');
      
      // Initialize speech recognition if not already done
      if (!speechRecognition) {
        initializeSpeechRecognition();
      }
      
    } catch (error) {
      console.error('Microphone permission denied:', error);
      setMicPermission('denied');
      setVoiceInputError('Microphone access denied. Please allow microphone access in your browser settings.');
    } finally {
      setIsCheckingMic(false);
    }
  };

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => {
          console.log('Voice recognition started');
          setIsRecording(true);
          setVoiceInputError(null);
        };
        
        recognition.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          
          setInterimTranscript(interimTranscript);
          
          if (finalTranscript) {
            const newInputValue = input + finalTranscript;
            setInput(newInputValue);
            setInterimTranscript('');
            
            // Auto-submit if the user said something like "send" or appears to be done
            const trimmedFinal = finalTranscript.trim().toLowerCase();
            if (trimmedFinal.endsWith('send') || 
                trimmedFinal.endsWith('submit') || 
                trimmedFinal.endsWith('.') ||
                trimmedFinal.endsWith('?') ||
                trimmedFinal.endsWith('!')) {
              setTimeout(() => {
                handleVoiceInputComplete(newInputValue);
              }, 500); // Small delay to ensure state updates
            }
          }
        };
        
        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setVoiceInputError(`Voice input error: ${event.error}`);
          setIsRecording(false);
        };
        
        recognition.onend = () => {
          console.log('Voice recognition ended');
          setIsRecording(false);
          setInterimTranscript('');
        };
        
        setSpeechRecognition(recognition);
        setVoiceInputEnabled(true);
      } else {
        console.warn('Speech Recognition not supported in this browser');
        setVoiceInputError('Voice input not supported in this browser');
      }
    }
  }, []);

  // Enhanced voice input functions with better UX
  const startVoiceInput = async () => {
    // Check microphone permission first
    if (micPermission !== 'granted') {
      await requestMicrophonePermission();
      if (micPermission !== 'granted') {
        return;
      }
    }

    if (speechRecognition && !isRecording) {
      try {
        // Clear any previous input errors
        setVoiceInputError(null);
        setInterimTranscript('');
        
        // Configure for voice-to-voice mode
        if (voiceToVoiceMode) {
          speechRecognition.continuous = true;
          speechRecognition.interimResults = true;
        } else {
          speechRecognition.continuous = false;
          speechRecognition.interimResults = true;
        }
        
        // Start recognition
        speechRecognition.start();
        console.log('🎙️ Voice input started');
      } catch (error) {
        console.error('Error starting voice recognition:', error);
        setVoiceInputError('Failed to start voice input - check microphone permissions');
      }
    }
  };

  const stopVoiceInput = () => {
    if (speechRecognition && isRecording) {
      try {
        speechRecognition.stop();
        console.log('🎙️ Voice input stopped');
      } catch (error) {
        console.error('Error stopping voice recognition:', error);
      }
    }
  };

  const toggleVoiceToVoiceMode = () => {
    setVoiceToVoiceMode(!voiceToVoiceMode);
    
    if (!voiceToVoiceMode && micPermission !== 'granted') {
      // Request permission when enabling voice-to-voice mode
      requestMicrophonePermission();
    }
    
    // Stop current listening if switching modes
    if (isRecording) {
      stopVoiceInput();
    }
  };

  const toggleVoiceInput = () => {
    if (isRecording) {
      stopVoiceInput();
    } else {
      startVoiceInput();
    }
  };

  // Auto-submit when voice input is complete (after a pause)
  const handleVoiceInputComplete = (finalText: string) => {
    if (finalText.trim()) {
      // Create a proper synthetic event
      const syntheticEvent = {
        preventDefault: () => {},
      } as unknown as React.FormEvent;
      
      handleSubmit(syntheticEvent, finalText.trim());
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
      <div className="flex items-center justify-between p-4 text-white rounded-t-lg shadow-sm bg-gradient-to-r from-primary via-tertiary to-secondary">
        <div className="flex items-center">
          {/* Theme-adaptive logo */}
          <img
            src="/logos/biowell-dark.svg"
            alt="Biowell Logo"
            className="object-contain w-auto h-8 mr-3 dark:hidden"
          />
          <img
            src="/logos/biowell-light.svg"
            alt="Biowell Logo"
            className="hidden object-contain w-auto h-8 mr-3 dark:block"
          />
          <h2 className="text-lg font-semibold">Smart Coach</h2>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Audio & Voice Status Indicators */}
          <div className="flex items-center space-x-2">
            {/* TTS Status */}
            {audioStatus === 'testing' && (
              <div className="flex items-center px-2 py-1 text-sm text-white rounded-full bg-blue-500/20">
                <div className="w-3 h-3 mr-2 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                Testing Audio
              </div>
            )}
            
            {audioStatus === 'error' && (
              <div className="flex items-center px-2 py-1 text-sm text-red-200 rounded-full bg-red-500/20">
                <AlertCircle size={14} className="mr-1" />
                Audio Error
              </div>
            )}
            
            {audioStatus === 'ready' && voiceEnabled && (
              <div className="flex items-center px-2 py-1 text-sm text-green-200 rounded-full bg-green-500/20">
                <CheckCircle size={14} className="mr-1" />
                Audio Ready
              </div>
            )}
            
            {isGeneratingAudio && (
              <div className="flex items-center px-2 py-1 text-sm text-blue-200 rounded-full bg-blue-500/20">
                <div className="w-3 h-3 mr-2 bg-blue-300 rounded-full animate-pulse"></div>
                Speaking...
              </div>
            )}
            
            {/* Voice Input Status */}
            {voiceInputEnabled && isRecording && (
              <div className="flex items-center px-2 py-1 text-sm text-red-200 rounded-full bg-red-500/20">
                <div className="w-3 h-3 mr-2 bg-red-400 rounded-full animate-pulse"></div>
                Listening...
              </div>
            )}
          </div>
          
          {/* Voice Toggle Button - TTS */}
          <button
            onClick={handleVoiceToggle}
            disabled={audioStatus === 'testing' || isGeneratingAudio}
            className={`p-2 rounded-full transition-all duration-200 ${
              voiceEnabled && audioStatus === 'ready'
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : audioStatus === 'error'
                ? 'bg-red-500 hover:bg-red-600 text-white opacity-50 cursor-not-allowed'
                : 'bg-white/20 hover:bg-white/30 text-white'
            } ${audioStatus === 'testing' ? 'opacity-50 cursor-wait' : ''}`}
            aria-label={
              audioStatus === 'error' 
                ? "Audio unavailable" 
                : audioStatus === 'testing'
                ? "Testing audio system"
                : voiceEnabled 
                ? "Disable voice responses" 
                : "Enable voice responses"
            }
            title={
              audioError 
                ? `Audio Error: ${audioError}` 
                : voiceEnabled 
                ? "Click to disable voice responses" 
                : "Click to enable voice responses"
            }
          >
            {audioStatus === 'testing' ? (
              <div className="w-5 h-5 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
            ) : voiceEnabled && audioStatus === 'ready' ? (
              <Volume2 size={20} />
            ) : (
              <VolumeX size={20} />
            )}
          </button>
          
          {/* Audio Test Button (Dev mode) */}
          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={() => playTextToSpeech('Hello! This is a test of the audio system.')}
              disabled={!voiceEnabled || isGeneratingAudio}
              className="px-2 py-1 text-xs text-white transition-all duration-200 rounded bg-white/20 hover:bg-white/30 disabled:opacity-50"
              title="Test audio output"
            >
              Test Audio
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto transition-all duration-200 bg-gray-50 dark:bg-gray-700">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isLoading={false}
          />
        ))}
        {isLoading && (
          <div className="flex items-center p-3 space-x-2 text-gray-700 bg-white rounded-lg shadow-md dark:text-white dark:bg-gray-600 w-fit">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Biowell AI is thinking...</span>
          </div>
        )}
        {error && (
          <div className="p-3 font-medium text-red-700 rounded-lg shadow-sm bg-red-50 dark:bg-red-900/20 dark:text-red-300">
            <AlertCircle className="inline-block w-4 h-4 mr-2" />
            {error}
          </div>
        )}
        
        {/* Suggested Questions */}
        {!isLoading && messages.length > 0 && messages[messages.length - 1].role === 'assistant' && (
          <div className="flex flex-wrap gap-2 mt-4 mb-2">
            <div className="flex items-center w-full mb-3">
              <HelpCircle className="w-4 h-4 mr-2 text-primary" />
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
      <form onSubmit={handleSubmit} className="p-4 transition-all duration-200 bg-white border-t border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-end space-x-2">
          <div className="relative flex-1">
            <textarea
              ref={inputRef}
              value={input + (interimTranscript ? ` ${interimTranscript}` : '')}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your health, supplements, or wellness goals..."
              className="w-full p-3 text-gray-900 placeholder-gray-500 transition-all duration-200 bg-white border border-gray-300 rounded-lg shadow-inner resize-none dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white dark:placeholder-gray-300"
              rows={2}
            />
            {/* Voice input indicator */}
            {isRecording && (
              <div className="absolute flex items-center px-2 py-1 space-x-1 bg-red-100 rounded-full top-2 right-2 dark:bg-red-900/20">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-red-600 dark:text-red-400">Listening...</span>
              </div>
            )}
          </div>
          
          {/* Voice Input Button */}
          {voiceInputEnabled && (
            <Button
              type="button"
              onClick={toggleVoiceInput}
              disabled={isLoading}
              className={`flex items-center justify-center w-10 h-10 p-0 rounded-full transition-all duration-200 ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
              }`}
              aria-label={isRecording ? "Stop voice input" : "Start voice input"}
              title={isRecording ? "Click to stop recording" : "Click to start voice input"}
            >
              {isRecording ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </Button>
          )}
          
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex items-center justify-center w-10 h-10 p-0 rounded-full bg-gradient-to-r from-primary via-tertiary to-secondary"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        
        {/* Voice input error display */}
        {(voiceInputError || audioError) && (
          <div className="mt-2 space-y-1">
            {voiceInputError && (
              <div className="flex items-center p-2 text-sm text-orange-600 rounded bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400">
                <Mic className="flex-shrink-0 w-4 h-4 mr-2" />
                Voice Input: {voiceInputError}
              </div>
            )}
            {audioError && (
              <div className="flex items-center p-2 text-sm text-red-600 rounded bg-red-50 dark:bg-red-900/20 dark:text-red-400">
                <Volume2 className="flex-shrink-0 w-4 h-4 mr-2" />
                Audio Output: {audioError}
              </div>
            )}
          </div>
        )}
        
        <div className="mt-2 text-xs font-medium text-gray-700 transition-all duration-200 dark:text-gray-300">
          <p>Your Smart Coach provides general wellness guidance based on your inputs. Not medical advice.</p>
          <div className="flex flex-wrap gap-4 mt-1 text-blue-600 dark:text-blue-400">
            {voiceInputEnabled && (
              <span className="flex items-center">
                <Mic className="w-3 h-3 mr-1" />
                Click microphone for voice input
              </span>
            )}
            {audioStatus === 'ready' && (
              <span className="flex items-center">
                <Volume2 className="w-3 h-3 mr-1" />
                Audio responses {voiceEnabled ? 'enabled' : 'available'}
              </span>
            )}
          </div>
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