import React, { useState, useRef, useMemo } from 'react';
import { useIntersectionObserver } from '../../utils/performance';
import { motion } from 'framer-motion';

interface OptimizedImageV2Props {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  fallback?: string;
  loading?: 'lazy' | 'eager';
  aspectRatio?: 'auto' | 'square' | '16:9' | '4:3' | '3:2';
  sizes?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImageV2: React.FC<OptimizedImageV2Props> = ({
  src,
  alt,
  className = '',
  placeholder,
  fallback,
  loading = 'lazy',
  aspectRatio = 'auto',
  sizes,
  priority = false,
  onLoad,
  onError
}) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [imageSrc, setImageSrc] = useState(priority ? src : placeholder || '');
  const imgRef = useRef<HTMLImageElement>(null);
  
  const isInView = useIntersectionObserver(imgRef, {
    threshold: 0.1,
    rootMargin: '50px'
  });

  // Optimize image source based on device capabilities
  const optimizedSrc = useMemo(() => {
    if (!src) return '';
    
    // Check if browser supports WebP
    const supportsWebP = (() => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    })();

    // Generate responsive sources
    if (supportsWebP && !src.includes('.svg')) {
      // Convert to WebP if supported and not SVG
      return src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
    
    return src;
  }, [src]);

  // Generate srcSet for responsive images
  const srcSet = useMemo(() => {
    if (!src || src.includes('.svg')) return undefined;
    
    const baseName = src.replace(/\.[^/.]+$/, '');
    const extension = src.split('.').pop();
    
    return [
      `${baseName}-480w.${extension} 480w`,
      `${baseName}-768w.${extension} 768w`,
      `${baseName}-1024w.${extension} 1024w`,
      `${baseName}-1200w.${extension} 1200w`
    ].join(', ');
  }, [src]);

  // Handle intersection for lazy loading
  React.useEffect(() => {
    if (loading === 'lazy' && isInView && imageSrc !== src) {
      setImageSrc(optimizedSrc);
    }
  }, [isInView, loading, optimizedSrc, imageSrc, src]);

  // Handle image load
  const handleLoad = () => {
    setImageState('loaded');
    onLoad?.();
  };

  // Handle image error
  const handleError = () => {
    setImageState('error');
    if (fallback && imageSrc !== fallback) {
      setImageSrc(fallback);
    } else {
      onError?.();
    }
  };

  // Aspect ratio classes
  const aspectRatioClass = {
    auto: '',
    square: 'aspect-square',
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '3:2': 'aspect-[3/2]'
  }[aspectRatio];

  // Loading skeleton
  if (imageState === 'loading' && (!imageSrc || imageSrc === placeholder)) {
    return (
      <div
        ref={imgRef}
        className={`bg-gray-200 dark:bg-gray-700 animate-pulse ${aspectRatioClass} ${className}`}
        role="img"
        aria-label={`Loading ${alt}`}
      >
        <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      ref={imgRef}
      className={`overflow-hidden ${aspectRatioClass} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: imageState === 'loaded' ? 1 : 0.7 }}
      transition={{ duration: 0.3 }}
    >
      <img
        src={imageSrc}
        srcSet={srcSet}
        sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageState === 'loaded' ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        loading={loading}
        decoding="async"
      />
      
      {/* Error state */}
      {imageState === 'error' && !fallback && (
        <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </motion.div>
  );
};

// Pre-configured image components for common use cases
export const ProfileImage: React.FC<Omit<OptimizedImageV2Props, 'aspectRatio'>> = (props) => (
  <OptimizedImageV2 {...props} aspectRatio="square" />
);

export const CardImage: React.FC<Omit<OptimizedImageV2Props, 'aspectRatio'>> = (props) => (
  <OptimizedImageV2 {...props} aspectRatio="16:9" />
);

export const HeroImage: React.FC<OptimizedImageV2Props> = (props) => (
  <OptimizedImageV2 {...props} priority sizes="100vw" />
);
