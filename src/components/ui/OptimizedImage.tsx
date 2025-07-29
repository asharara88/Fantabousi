import React, { useRef, useState } from 'react';
import { useIntersectionObserver } from '../../utils/performance';
import { motion } from 'framer-motion';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  fallback?: string;
  loading?: 'lazy' | 'eager';
  aspectRatio?: 'square' | '16:9' | '4:3' | 'auto';
}

export function OptimizedImage({
  src,
  alt,
  className = '',
  placeholder = '/placeholder-supplement.svg',
  fallback = '/fallback-supplement.svg',
  loading = 'lazy',
  aspectRatio = 'auto'
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(loading === 'lazy' ? placeholder : src);
  const imgRef = useRef<HTMLImageElement>(null);
  
  const isInView = useIntersectionObserver(imgRef, {
    threshold: 0.1,
    rootMargin: '50px'
  });

  React.useEffect(() => {
    if (isInView && loading === 'lazy' && imageSrc === placeholder) {
      setImageSrc(src);
    }
  }, [isInView, loading, src, placeholder, imageSrc]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setImageSrc(fallback);
  };

  const aspectRatioClasses = {
    'square': 'aspect-square',
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    'auto': ''
  };

  return (
    <div className={`relative overflow-hidden ${aspectRatioClasses[aspectRatio]} ${className}`} ref={imgRef}>
      {/* Loading skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-400 dark:text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
      
      {/* Actual image */}
      <motion.img
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      {/* Error indicator */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <div className="text-center">
            <svg
              className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <p className="text-xs text-gray-500 dark:text-gray-400">Image unavailable</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Specialized component for supplement images
interface SupplementImageProps {
  supplementId: string;
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function SupplementImage({ 
  supplementId, 
  name, 
  className = '',
  size = 'md'
}: SupplementImageProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  };
  
  const src = `/supplements/${supplementId}.svg`;
  const placeholder = '/supplements/placeholder.svg';
  const fallback = '/supplements/generic-supplement.svg';
  
  return (
    <OptimizedImage
      src={src}
      alt={`${name} supplement`}
      placeholder={placeholder}
      fallback={fallback}
      className={`${sizeClasses[size]} ${className}`}
      aspectRatio="square"
      loading="lazy"
    />
  );
}
