import React from 'react';

const SkipLinks: React.FC = () => {
  const handleSkipToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="sr-only focus-within:not-sr-only">
      <div className="fixed top-0 left-0 z-50 p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-lg">
        <a
          href="#main-content"
          onClick={(e) => {
            e.preventDefault();
            handleSkipToElement('main-content');
          }}
          className="block px-4 py-2 text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Skip to main content
        </a>
        <a
          href="#navigation"
          onClick={(e) => {
            e.preventDefault();
            handleSkipToElement('navigation');
          }}
          className="block px-4 py-2 text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Skip to navigation
        </a>
        <a
          href="#footer"
          onClick={(e) => {
            e.preventDefault();
            handleSkipToElement('footer');
          }}
          className="block px-4 py-2 text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Skip to footer
        </a>
      </div>
    </div>
  );
};

export default SkipLinks;
