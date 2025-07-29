import React from 'react';

interface SkipLink {
  href: string;
  label: string;
}

interface SkipLinksProps {
  links?: SkipLink[];
  className?: string;
}

const defaultLinks: SkipLink[] = [
  { href: '#main-content', label: 'Skip to main content' },
  { href: '#main-navigation', label: 'Skip to navigation' },
  { href: '#footer', label: 'Skip to footer' }
];

/**
 * Skip Links Component
 * Provides keyboard navigation shortcuts for accessibility
 * Complies with WCAG 2.1 Success Criterion 2.4.1
 */
const SkipLinks: React.FC<SkipLinksProps> = ({ 
  links = defaultLinks, 
  className = '' 
}) => {
  const handleSkipLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // Set tabindex if not already focusable
      if (!targetElement.hasAttribute('tabindex')) {
        targetElement.setAttribute('tabindex', '-1');
      }
      
      // Focus the target element
      targetElement.focus();
      
      // Scroll into view
      targetElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      
      // Remove tabindex after focus (if we added it)
      if (targetElement.getAttribute('tabindex') === '-1') {
        setTimeout(() => {
          targetElement.removeAttribute('tabindex');
        }, 100);
      }
    }
  };

  return (
    <nav 
      className={`skip-links ${className}`}
      role="navigation"
      aria-label="Skip navigation links"
    >
      {links.map((link, index) => (
        <a
          key={index}
          href={link.href}
          className="skip-link"
          onClick={(e) => handleSkipLinkClick(e, link.href)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleSkipLinkClick(e as any, link.href);
            }
          }}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
};

export default SkipLinks;
