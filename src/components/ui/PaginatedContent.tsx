import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Loader2, AlertCircle, ArrowUp } from 'lucide-react';
import { Button } from './Button';

interface PaginatedContentItem {
  id: string;
  content: React.ReactNode;
}

interface PaginatedContentProps {
  items: PaginatedContentItem[];
  loadMore?: () => Promise<PaginatedContentItem[]>;
  hasMore?: boolean;
  loading?: boolean;
  pageSize?: number;
  mode?: 'pagination' | 'loadMore' | 'virtualScroll';
  onLoadMore?: () => void;
  className?: string;
  emptyState?: React.ReactNode;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  showBackToTop?: boolean;
  announceChanges?: boolean;
}

/**
 * Accessible Paginated Content Component - Alternative to infinite scroll
 * 
 * Features:
 * - Multiple loading patterns (pagination, load more, virtual scroll)
 * - Keyboard navigation
 * - Screen reader announcements
 * - Back to top functionality
 * - Loading and error states
 * - Progressive enhancement
 * - Intersection observer for performance
 * - Respects reduced motion preferences
 */
const PaginatedContent: React.FC<PaginatedContentProps> = ({
  items,
  loadMore,
  hasMore = false,
  loading = false,
  pageSize = 10,
  mode = 'pagination',
  onLoadMore,
  className = '',
  emptyState,
  loadingComponent,
  errorComponent,
  showBackToTop = true,
  announceChanges = true
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedItems, setDisplayedItems] = useState<PaginatedContentItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [showBackToTopButton, setShowBackToTopButton] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Initialize displayed items
  useEffect(() => {
    if (mode === 'pagination') {
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      setDisplayedItems(items.slice(startIndex, endIndex));
    } else {
      setDisplayedItems(items);
    }
  }, [items, currentPage, pageSize, mode]);

  // Calculate pagination info
  const totalPages = Math.ceil(items.length / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, items.length);

  // Handle load more functionality
  const handleLoadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setError(null);
      
      if (onLoadMore) {
        onLoadMore();
      } else if (loadMore) {
        const newItems = await loadMore();
        setDisplayedItems(prev => [...prev, ...newItems]);
      }

      // Announce new content loaded
      if (announceChanges) {
        setAnnouncement('New content loaded. Continue reading or navigate to see more.');
      }
    } catch (err) {
      setError('Failed to load more content. Please try again.');
      console.error('Load more error:', err);
    }
  }, [loading, hasMore, onLoadMore, loadMore, announceChanges]);

  // Intersection observer for auto-loading
  useEffect(() => {
    if (mode !== 'loadMore' || !loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [mode, hasMore, loading, handleLoadMore]);

  // Back to top visibility
  useEffect(() => {
    if (!showBackToTop) return;

    const handleScroll = () => {
      setShowBackToTopButton(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showBackToTop]);

  // Pagination navigation
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    
    setCurrentPage(page);
    
    // Scroll to top of content
    if (topRef.current) {
      topRef.current.scrollIntoView({ 
        behavior: isReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
    }

    // Announce page change
    if (announceChanges) {
      setAnnouncement(`Page ${page} of ${totalPages} loaded. Showing items ${startItem} to ${endItem} of ${items.length}.`);
    }
  };

  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  // Back to top functionality
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: isReducedMotion ? 'auto' : 'smooth'
    });
    
    if (topRef.current) {
      topRef.current.focus();
    }
    
    if (announceChanges) {
      setAnnouncement('Scrolled to top of page.');
    }
  };

  // Keyboard navigation for pagination
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (mode !== 'pagination') return;

    switch (e.key) {
      case 'ArrowLeft':
        if (currentPage > 1) {
          e.preventDefault();
          goToPreviousPage();
        }
        break;
      case 'ArrowRight':
        if (currentPage < totalPages) {
          e.preventDefault();
          goToNextPage();
        }
        break;
      case 'Home':
        if (currentPage !== 1) {
          e.preventDefault();
          goToPage(1);
        }
        break;
      case 'End':
        if (currentPage !== totalPages) {
          e.preventDefault();
          goToPage(totalPages);
        }
        break;
    }
  };

  // Empty state
  if (items.length === 0 && !loading) {
    return (
      <div className={`text-center py-12 ${className}`}>
        {emptyState || (
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No content available</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">Check back later for updates</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`paginated-content ${className}`}>
      {/* Top anchor for back to top */}
      <div ref={topRef} tabIndex={-1} className="sr-only">
        Top of content
      </div>

      {/* Content status for screen readers */}
      {mode === 'pagination' && (
        <div className="sr-only" aria-live="polite">
          Showing {startItem} to {endItem} of {items.length} items. Page {currentPage} of {totalPages}.
        </div>
      )}

      {/* Content List */}
      <div className="space-y-4" role="main" aria-label="Content list">
        <AnimatePresence mode="wait">
          {displayedItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={isReducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={isReducedMotion ? {} : { opacity: 0, y: -20 }}
              transition={{ 
                duration: isReducedMotion ? 0 : 0.3,
                delay: isReducedMotion ? 0 : index * 0.05 
              }}
              className="content-item"
            >
              {item.content}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8" role="status" aria-label="Loading content">
          {loadingComponent || (
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-gray-600 dark:text-gray-400">Loading content...</span>
            </div>
          )}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex justify-center items-center py-8" role="alert">
          {errorComponent || (
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={handleLoadMore}>
                Try Again
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {mode === 'pagination' && totalPages > 1 && (
        <nav 
          className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
          aria-label="Pagination navigation"
          onKeyDown={handleKeyDown}
        >
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {startItem} to {endItem} of {items.length} results
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              aria-label={`Go to previous page. Current page: ${currentPage}`}
            >
              Previous
            </Button>

            {/* Page Numbers */}
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page: number;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={page}
                    variant={page === currentPage ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => goToPage(page)}
                    aria-label={`Go to page ${page}`}
                    aria-current={page === currentPage ? "page" : undefined}
                    className="min-w-[40px]"
                  >
                    {page}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              aria-label={`Go to next page. Current page: ${currentPage}`}
            >
              Next
            </Button>
          </div>
        </nav>
      )}

      {/* Load More Button */}
      {mode === 'loadMore' && hasMore && (
        <div className="text-center mt-8">
          <Button
            onClick={handleLoadMore}
            disabled={loading}
            size="lg"
            className="min-w-[200px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-2" />
                Load More
              </>
            )}
          </Button>
        </div>
      )}

      {/* Intersection observer target for auto-loading */}
      {mode === 'loadMore' && hasMore && (
        <div ref={loadMoreRef} className="h-4" aria-hidden="true" />
      )}

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && showBackToTopButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={scrollToTop}
              variant="primary"
              size="sm"
              className="rounded-full w-12 h-12 shadow-lg"
              aria-label="Back to top"
            >
              <ArrowUp className="w-5 h-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen Reader Announcements */}
      {announceChanges && (
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {announcement}
        </div>
      )}

      {/* Keyboard Instructions */}
      {mode === 'pagination' && (
        <div className="sr-only">
          Use arrow keys to navigate pages, Home to go to first page, End to go to last page.
        </div>
      )}
    </div>
  );
};

export default PaginatedContent;
