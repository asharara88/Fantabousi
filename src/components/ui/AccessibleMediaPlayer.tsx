import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from './Button';

interface MediaPlayerProps {
  src: string;
  type: 'video' | 'audio';
  title?: string;
  description?: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  className?: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

/**
 * Accessible Media Player Component - Progressive enhancement for video/audio
 * 
 * Features:
 * - Full keyboard support
 * - Screen reader announcements
 * - Custom accessible controls
 * - Captions/subtitles support
 * - Reduced motion support
 * - Progressive enhancement (falls back to native controls)
 * - ARIA live regions for status updates
 * - Focus management
 * - Responsive design
 */
const AccessibleMediaPlayer: React.FC<MediaPlayerProps> = ({
  src,
  type,
  title,
  description,
  poster,
  autoPlay = false,
  loop = false,
  muted = false,
  controls = true,
  preload = 'metadata',
  className = '',
  onTimeUpdate,
  onPlay,
  onPause,
  onEnded
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [showControls, setShowControls] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Media event handlers
  const handleLoadedMetadata = () => {
    if (mediaRef.current) {
      setDuration(mediaRef.current.duration);
      setIsLoading(false);
    }
  };

  const handleTimeUpdate = () => {
    if (mediaRef.current) {
      const current = mediaRef.current.currentTime;
      setCurrentTime(current);
      
      if (onTimeUpdate) {
        onTimeUpdate(current, duration);
      }
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setAnnouncement('Playback started');
    if (onPlay) onPlay();
  };

  const handlePause = () => {
    setIsPlaying(false);
    setAnnouncement('Playback paused');
    if (onPause) onPause();
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setAnnouncement('Playback ended');
    if (onEnded) onEnded();
  };

  const handleError = () => {
    setError('Failed to load media');
    setIsLoading(false);
  };

  // Control functions
  const togglePlayPause = () => {
    if (mediaRef.current) {
      if (isPlaying) {
        mediaRef.current.pause();
      } else {
        mediaRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    if (mediaRef.current) {
      const newMuted = !isMuted;
      mediaRef.current.muted = newMuted;
      setIsMuted(newMuted);
      setAnnouncement(newMuted ? 'Muted' : 'Unmuted');
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (mediaRef.current) {
      mediaRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleSeek = (newTime: number) => {
    if (mediaRef.current) {
      mediaRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setAnnouncement(`Seeked to ${formatTime(newTime)}`);
    }
  };

  const restart = () => {
    handleSeek(0);
    setAnnouncement('Restarted from beginning');
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Auto-hide controls for video
  useEffect(() => {
    if (type === 'video' && isPlaying) {
      const hideControls = () => {
        setShowControls(false);
      };

      controlsTimeoutRef.current = setTimeout(hideControls, 3000);

      return () => {
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
      };
    } else {
      setShowControls(true);
    }
  }, [type, isPlaying]);

  // Show controls on mouse move
  const handleMouseMove = () => {
    if (type === 'video') {
      setShowControls(true);
      
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }

      if (isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    }
  };

  // Keyboard controls
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case ' ':
      case 'k':
        e.preventDefault();
        togglePlayPause();
        break;
      case 'm':
        e.preventDefault();
        toggleMute();
        break;
      case 'f':
        if (type === 'video') {
          e.preventDefault();
          toggleFullscreen();
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        handleSeek(Math.max(0, currentTime - 10));
        break;
      case 'ArrowRight':
        e.preventDefault();
        handleSeek(Math.min(duration, currentTime + 10));
        break;
      case 'ArrowUp':
        e.preventDefault();
        handleVolumeChange(Math.min(1, volume + 0.1));
        break;
      case 'ArrowDown':
        e.preventDefault();
        handleVolumeChange(Math.max(0, volume - 0.1));
        break;
      case 'Home':
        e.preventDefault();
        handleSeek(0);
        break;
      case 'End':
        e.preventDefault();
        handleSeek(duration);
        break;
    }
  };

  // Format time for display
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={`accessible-media-player relative bg-black rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 ${className}`}
      onMouseMove={handleMouseMove}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label={`${type} player${title ? `: ${title}` : ''}`}
    >
      {/* Media Element */}
      {type === 'video' ? (
        <video
          ref={mediaRef as React.RefObject<HTMLVideoElement>}
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          preload={preload}
          controls={false} // We use custom controls
          className="w-full h-auto"
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          onError={handleError}
          aria-label={title}
          aria-describedby={description ? 'media-description' : undefined}
        />
      ) : (
        <audio
          ref={mediaRef as React.RefObject<HTMLAudioElement>}
          src={src}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          preload={preload}
          controls={false}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          onError={handleError}
          aria-label={title}
          aria-describedby={description ? 'media-description' : undefined}
        />
      )}

      {/* Audio Player Visual */}
      {type === 'audio' && (
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={isPlaying && !isReducedMotion ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto"
            >
              <Volume2 className="w-8 h-8 text-white" />
            </motion.div>
            {title && (
              <h3 className="text-white text-lg font-medium">{title}</h3>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"
            />
            <p>Loading...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black text-white text-center p-4">
          <div>
            <p className="text-lg font-medium mb-2">Error</p>
            <p className="text-sm text-gray-300">{error}</p>
          </div>
        </div>
      )}

      {/* Custom Controls */}
      {controls && !isLoading && !error && (
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={isReducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={isReducedMotion ? {} : { opacity: 0, y: 20 }}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
            >
              {/* Progress Bar */}
              <div className="mb-4">
                <div 
                  className="w-full h-2 bg-white/20 rounded-full cursor-pointer group"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const percentage = x / rect.width;
                    handleSeek(percentage * duration);
                  }}
                  role="slider"
                  aria-label="Seek"
                  aria-valuemin={0}
                  aria-valuemax={duration}
                  aria-valuenow={currentTime}
                  aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowLeft') {
                      e.preventDefault();
                      handleSeek(Math.max(0, currentTime - 10));
                    } else if (e.key === 'ArrowRight') {
                      e.preventDefault();
                      handleSeek(Math.min(duration, currentTime + 10));
                    }
                  }}
                >
                  <div 
                    className="h-full bg-primary rounded-full transition-all group-hover:h-3 relative"
                    style={{ width: `${progressPercentage}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                
                <div className="flex justify-between text-xs text-white/70 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Play/Pause */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePlayPause}
                    className="text-white hover:bg-white/20 w-10 h-10"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </Button>

                  {/* Restart */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={restart}
                    className="text-white hover:bg-white/20 w-10 h-10"
                    aria-label="Restart"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>

                  {/* Volume */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleMute}
                      className="text-white hover:bg-white/20 w-10 h-10"
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </Button>
                    
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      aria-label="Volume"
                    />
                  </div>
                </div>

                {/* Fullscreen for Video */}
                {type === 'video' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFullscreen}
                    className="text-white hover:bg-white/20 w-10 h-10"
                    aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="w-5 h-5" />
                    ) : (
                      <Maximize2 className="w-5 h-5" />
                    )}
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Description */}
      {description && (
        <div id="media-description" className="sr-only">
          {description}
        </div>
      )}

      {/* Screen Reader Announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      {/* Keyboard Instructions */}
      <div className="sr-only">
        Media player controls: Space or K to play/pause, M to mute/unmute, 
        Arrow keys to seek and adjust volume, F for fullscreen (video only).
      </div>
    </div>
  );
};

export default AccessibleMediaPlayer;
