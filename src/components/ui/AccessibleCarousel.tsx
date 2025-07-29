import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from './Button';

interface CarouselItem {
  id: string;
  title: string;
  content: React.ReactNode;
  image?: string;
  alt?: string;
}

interface AccessibleCarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showThumbnails?: boolean;
  showControls?: boolean;
  showIndicators?: boolean;
  allowKeyboardNavigation?: boolean;
  ariaLabel?: string;
  className?: string;
}

/**
 * Accessible Carousel Component - Alternative to problematic carousel patterns
 * 
 * Features:
 * - Full keyboard navigation support
 * - Screen reader announcements
 * - Reduced motion support
 * - Auto-play with pause/resume controls
 * - Thumbnail navigation option
 * - Touch/swipe support
 * - Progressive enhancement
 */
const AccessibleCarousel: React.FC<AccessibleCarouselProps> = ({
  items,
  autoPlay = false,
  autoPlayInterval = 5000,
  showThumbnails = false,
  showControls = true,
  showIndicators = true,
  allowKeyboardNavigation = true,
  ariaLabel = "Image carousel",
  className = ""
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && !isReducedMotion) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }, autoPlayInterval);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, isReducedMotion, autoPlayInterval, items.length]);

  // Navigation functions
  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    announceSlideChange(index);
  }, []);

  const goToPrevious = useCallback(() => {
    const newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, items.length, goToSlide]);

  const goToNext = useCallback(() => {
    const newIndex = (currentIndex + 1) % items.length;
    goToSlide(newIndex);
  }, [currentIndex, items.length, goToSlide]);

  // Screen reader announcements
  const announceSlideChange = (index: number) => {
    const announcement = `Slide ${index + 1} of ${items.length}: ${items[index].title}`;
    const ariaLive = document.createElement('div');
    ariaLive.setAttribute('aria-live', 'polite');
    ariaLive.setAttribute('aria-atomic', 'true');
    ariaLive.className = 'sr-only';
    ariaLive.textContent = announcement;
    document.body.appendChild(ariaLive);
    
    setTimeout(() => document.body.removeChild(ariaLive), 1000);
  };

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!allowKeyboardNavigation) return;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        goToPrevious();
        break;
      case 'ArrowRight':
        e.preventDefault();
        goToNext();
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(items.length - 1);
        break;
      case ' ':
      case 'Enter':
        e.preventDefault();
        setIsPlaying(!isPlaying);
        break;
    }
  }, [allowKeyboardNavigation, goToPrevious, goToNext, goToSlide, items.length, isPlaying]);

  // Touch/swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  const resetToFirst = () => {
    goToSlide(0);
  };

  return (
    <div className={`accessible-carousel relative ${className}`}>
      {/* Carousel Container */}
      <div
        ref={carouselRef}
        className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 min-h-[300px]"
        role="region"
        aria-label={ariaLabel}
        aria-live="polite"
        onKeyDown={handleKeyDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        tabIndex={0}
      >
        {/* Main Slide Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={isReducedMotion ? {} : { opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={isReducedMotion ? {} : { opacity: 0, x: -50 }}
            transition={{ duration: isReducedMotion ? 0 : 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-full h-full flex flex-col md:flex-row items-center">
              {items[currentIndex].image && (
                <div className="w-full md:w-1/2 h-48 md:h-full">
                  <img
                    src={items[currentIndex].image}
                    alt={items[currentIndex].alt || items[currentIndex].title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="w-full md:w-1/2 p-6 text-center md:text-left">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  {items[currentIndex].title}
                </h3>
                <div className="text-gray-600 dark:text-gray-300">
                  {items[currentIndex].content}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        {showControls && items.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 shadow-lg z-10"
              onClick={goToPrevious}
              aria-label={`Go to previous slide. Current slide: ${currentIndex + 1} of ${items.length}`}
              disabled={items.length <= 1}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 shadow-lg z-10"
              onClick={goToNext}
              aria-label={`Go to next slide. Current slide: ${currentIndex + 1} of ${items.length}`}
              disabled={items.length <= 1}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </>
        )}

        {/* Auto-play Controls */}
        {autoPlay && !isReducedMotion && (
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 shadow-lg"
              onClick={toggleAutoPlay}
              aria-label={isPlaying ? "Pause auto-play" : "Resume auto-play"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 shadow-lg"
              onClick={resetToFirst}
              aria-label="Reset to first slide"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Slide Indicators */}
      {showIndicators && items.length > 1 && (
        <div className="flex justify-center mt-4 gap-2" role="tablist" aria-label="Slide navigation">
          {items.map((_, index) => (
            <button
              key={index}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Go to slide ${index + 1}: ${items[index].title}`}
              className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 ${
                index === currentIndex
                  ? 'bg-primary shadow-lg scale-110'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}

      {/* Thumbnail Navigation */}
      {showThumbnails && items.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {items.map((item, index) => (
            <button
              key={index}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 ${
                index === currentIndex
                  ? 'border-primary shadow-lg'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Thumbnail for slide ${index + 1}: ${item.title}`}
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400">
                  {index + 1}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Current Slide Status for Screen Readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {currentIndex + 1} of {items.length}: {items[currentIndex].title}
      </div>

      {/* Keyboard Instructions */}
      <div className="sr-only">
        Use arrow keys to navigate slides, Home and End to go to first or last slide, Space or Enter to pause auto-play.
      </div>
    </div>
  );
};

export default AccessibleCarousel;
