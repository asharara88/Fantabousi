/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { X, Play, Loader2, Volume2, VolumeX, Info } from 'lucide-react';
import { elevenlabsApi, Voice } from '../../api/elevenlabsApi';
import { Button } from '../ui/Button'; 
import { Card } from '../ui/Card';

interface VoiceSettings {
  enabled: boolean;
  voiceId: string;
  stability: number;
  similarity_boost: number;
}

interface VoicePreferencesProps {
  settings: VoiceSettings;
  onSettingsChange: (settings: VoiceSettings) => void;
  onClose: () => void;
  isPlayingAudio: boolean;
  stopAudio: () => void;
}

const VoicePreferences: React.FC<VoicePreferencesProps> = ({
  
  settings,
  onSettingsChange,
  onClose,
  isPlayingAudio,
  stopAudio
}) => {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [isLoadingVoices, setIsLoadingVoices] = useState(false);
  const [isTestingVoice, setIsTestingVoice] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string>(settings.voiceId);
  const [stability, setStability] = useState(settings.stability);
  const [similarityBoost, setSimilarityBoost] = useState(settings.similarity_boost);
  const [isConfigured, setIsConfigured] = useState(false);
  const [testPhrase, setTestPhrase] = useState("Hello, I'm your Biowell health assistant.");

  useEffect(() => {
    const checkConfiguration = async () => {
      const configured = await elevenlabsApi.isConfigured();
      setIsConfigured(configured);
      
      if (configured) {
        loadVoices();
      }
    };
    
    checkConfiguration();
  }, []);

  const loadVoices = async () => {
    setIsLoadingVoices(true);
    try {
      const voicesData = await elevenlabsApi.getVoices();
      setVoices(voicesData);
    } catch (error) {
      console.error('Error loading voices:', error);
    } finally {
      setIsLoadingVoices(false);
    }
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVoice(e.target.value);
  };

  const handleStabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStability(parseFloat(e.target.value));
  };

  const handleSimilarityBoostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSimilarityBoost(parseFloat(e.target.value));
  };

  const handleSaveSettings = () => {
    onSettingsChange({
      ...settings,
      voiceId: selectedVoice,
      stability,
      similarity_boost: similarityBoost
    });
    onClose();
  };

  const handleTestVoice = async () => {
    if (isTestingVoice || isPlayingAudio) return;
    
    setIsTestingVoice(true); 
    try {
      // Stop any currently playing audio
      stopAudio();
      
      // Generate test audio
      const audioData = await elevenlabsApi.textToSpeech(
        testPhrase,
        selectedVoice,
        { stability, similarity_boost: similarityBoost }
      );
      
      if (!audioData) {
        throw new Error('Failed to generate test audio');
      }
      
      // Create animated dots during playback
      const showPlayingAnimation = () => {
        const dots = document.getElementById('playing-animation');
        if (dots) {
          dots.innerHTML = '.';
          setTimeout(() => { if (dots) dots.innerHTML = '..'; }, 500);
          setTimeout(() => { if (dots) dots.innerHTML = '...'; }, 1000);
          setTimeout(() => { if (dots) dots.innerHTML = ''; }, 1500);
          setTimeout(showPlayingAnimation, 2000);
        }
      };
      
      // Play the audio with animation
      const blob = new Blob([audioData], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      
      audio.onended = () => {
        URL.revokeObjectURL(url);
        setIsTestingVoice(false);
        clearTimeout(showPlayingAnimation as any);
      };
      
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        setIsTestingVoice(false);
        console.error('Error playing test audio');
      };
      
      await audio.play();
      showPlayingAnimation();
    } catch (error: any) {
      console.error('Error testing voice:', error);
      setIsTestingVoice(false);
    }
  };

  const applyPreset = (preset: 'standard' | 'clear' | 'expressive') => {
    switch (preset) {
      case 'standard':
        setStability(0.5);
        setSimilarityBoost(0.75);
        break;
      case 'clear':
        setStability(0.75);
        setSimilarityBoost(0.5);
        break;
      case 'expressive':
        setStability(0.3);
        setSimilarityBoost(0.85);
        break;
    }
  };

  const getStabilityLabel = () => {
    if (stability < 0.35) return "More variable";
    if (stability > 0.65) return "More stable";
    return "Balanced";
  };

  const getSimilarityLabel = () => {
    if (similarityBoost < 0.35) return "More unique";
    if (similarityBoost > 0.65) return "More clear";
    return "Balanced";
  };

  return (
    <Card className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-200">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Voice Preferences</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          aria-label="Close voice preferences"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {!isConfigured ? (
        <div className="text-center py-4">
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            ElevenLabs API is not configured. Voice responses are unavailable.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Please contact your administrator to set up ElevenLabs integration.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Info message */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4 text-sm">
            <div className="flex items-start">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-blue-700 dark:text-blue-300">
                Voice responses use your ElevenLabs credits. Adjust settings to balance quality and usage.
              </p>
            </div>
          </div>
          
          {/* Test phrase input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Test Phrase
            </label>
            <input
              value={testPhrase}
              onChange={(e) => setTestPhrase(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Enable Voice Responses
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => onSettingsChange({ ...settings, enabled: e.target.checked })}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                id="enable-voice"
              />
              {settings.enabled ? 
                <Volume2 className="h-4 w-4 text-primary ml-2 mr-1" /> : 
                <VolumeX className="h-4 w-4 text-gray-500 ml-2 mr-1" />}
              <span className="ml-2 text-gray-700 dark:text-gray-300">
                {settings.enabled ? 'Voice responses enabled' : 'Voice responses disabled'}
              </span>
            </div>
          </div>

          <div className={settings.enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Voice
              </label>
              <select
                value={selectedVoice}
                onChange={handleVoiceChange}
                disabled={isLoadingVoices || !settings.enabled}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
              >
                {isLoadingVoices ? (
                  <option>Loading voices...</option>
                ) : (
                  voices.map((voice) => (
                    <option key={voice.voice_id} value={voice.voice_id}>
                      {voice.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Stability: {stability.toFixed(2)}
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {getStabilityLabel()}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={stability}
                onChange={handleStabilityChange}
                disabled={!settings.enabled}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Variable</span>
                <span>Stable</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Clarity: {similarityBoost.toFixed(2)}
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {getSimilarityLabel()}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={similarityBoost}
                onChange={handleSimilarityBoostChange}
                disabled={!settings.enabled}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Unique</span>
                <span>Clear</span>
              </div>
            </div>

            <div className="flex space-x-2 mb-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => applyPreset('standard')}
                disabled={!settings.enabled}
              >
                Standard
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => applyPreset('clear')}
                disabled={!settings.enabled}
              >
                Clear
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => applyPreset('expressive')}
                disabled={!settings.enabled}
              >
                Expressive
              </Button>
            </div>

            <Button
              onClick={handleTestVoice}
              disabled={isTestingVoice || isPlayingAudio || !settings.enabled}
              className="w-full mb-4"
            >
              {isTestingVoice ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testing Voice<span id="playing-animation"></span>
                </>
              ) : (
                <> 
                  <Play className="w-4 h-4 mr-2" />
                  Test Voice
                </>
              )}
            </Button>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSaveSettings}>
              Save Settings
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default VoicePreferences;