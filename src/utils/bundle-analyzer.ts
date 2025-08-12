// Bundle analysis and optimization utilities
export class BundleAnalyzer {
  private static readonly startTime = performance.now();

  // Analyze current bundle performance
  static analyzeBundlePerformance() {
    const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

    const jsFiles = entries.filter(entry => entry.name.includes('.js'));
    const cssFiles = entries.filter(entry => entry.name.includes('.css'));
    const imageFiles = entries.filter(entry => 
      entry.name.includes('.jpg') || 
      entry.name.includes('.png') || 
      entry.name.includes('.svg') ||
      entry.name.includes('.webp')
    );

    console.group('📦 Bundle Performance Analysis');
    console.log('JavaScript Files:', jsFiles.length);
    console.log('CSS Files:', cssFiles.length);
    console.log('Image Files:', imageFiles.length);
    
    // Find largest files
    const sortedEntries = [...entries].sort((a, b) => (b.transferSize || 0) - (a.transferSize || 0));
    const largestFiles = sortedEntries.slice(0, 10);
    
    console.table(largestFiles.map(file => ({
      name: file.name.split('/').pop(),
      size: `${Math.round((file.transferSize || 0) / 1024)}KB`,
      duration: `${Math.round(file.duration)}ms`
    })));
    console.groupEnd();

    return {
      jsFiles: jsFiles.length,
      cssFiles: cssFiles.length,
      imageFiles: imageFiles.length,
      totalFiles: entries.length,
      largestFiles
    };
  }

  // Monitor real-time performance
  static monitorRealTimePerformance() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource') {
          const resource = entry as PerformanceResourceTiming;
          if (resource.transferSize && resource.transferSize > 100000) { // > 100KB
            console.warn(`Large resource detected: ${resource.name} (${Math.round(resource.transferSize / 1024)}KB)`);
          }
        }
      }
    });
    
    observer.observe({ entryTypes: ['resource'] });
    return observer;
  }

  // Get unused code suggestions
  static analyzeUnusedCode() {
    // This would integrate with tools like webpack-bundle-analyzer
    // For now, we'll provide basic suggestions
    const suggestions = [
      'Consider lazy loading non-critical components',
      'Use React.memo() for expensive components',
      'Implement virtual scrolling for large lists',
      'Optimize images with WebP format',
      'Remove unused dependencies',
      'Enable gzip compression',
      'Use code splitting for routes'
    ];

    console.group('🔧 Performance Optimization Suggestions');
    suggestions.forEach((suggestion, index) => {
      console.log(`${index + 1}. ${suggestion}`);
    });
    console.groupEnd();

    return suggestions;
  }

  // Memory usage monitoring
  static monitorMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      console.group('🧠 Memory Usage');
      console.log('Used JS Heap Size:', `${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB`);
      console.log('Total JS Heap Size:', `${Math.round(memory.totalJSHeapSize / 1024 / 1024)}MB`);
      console.log('JS Heap Size Limit:', `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)}MB`);
      console.groupEnd();

      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      };
    }
    return null;
  }

  // Core Web Vitals monitoring
  static monitorCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        console.log('LCP:', entry.startTime);
        if (entry.startTime > 2500) {
          console.warn('LCP is slower than recommended (>2.5s)');
        }
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const fidEntry = entry as any;
        const fid = fidEntry.processingStart - fidEntry.startTime;
        console.log('FID:', fid);
        if (fid > 100) {
          console.warn('FID is slower than recommended (>100ms)');
        }
      }
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      console.log('CLS:', clsValue);
      if (clsValue > 0.1) {
        console.warn('CLS is higher than recommended (>0.1)');
      }
    }).observe({ entryTypes: ['layout-shift'] });
  }

  // Initialization function
  static init() {
    if (process.env.NODE_ENV === 'development') {
      // Run initial analysis after a delay
      setTimeout(() => {
        this.analyzeBundlePerformance();
        this.analyzeUnusedCode();
        this.monitorMemoryUsage();
      }, 3000);

      // Start real-time monitoring
      this.monitorRealTimePerformance();
      this.monitorCoreWebVitals();
    }
  }
}

// Auto-initialize in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  BundleAnalyzer.init();
}
