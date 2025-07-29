import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import AccessibleCarousel from '../ui/AccessibleCarousel';
import AccessibleDropdown from '../ui/AccessibleDropdown';
import PaginatedContent from '../ui/PaginatedContent';
import ProgressiveNavigation from '../ui/ProgressiveNavigation';
import AccessibleMediaPlayer from '../ui/AccessibleMediaPlayer';
import { ToastProvider, useToast, toast } from '../ui/AccessibleToast';
import AdvancedDataTable from '../ui/AdvancedDataTable';
import { 
  Play, 
  Image, 
  List, 
  Navigation, 
  Video, 
  Bell, 
  Table,
  CheckCircle,
  Heart,
  Star,
  Trophy
} from 'lucide-react';

/**
 * Demo page showcasing inclusive design patterns
 * This demonstrates accessible alternatives to common problematic UI patterns
 */

// Sample data for demonstrations
const carouselItems = [
  {
    id: '1',
    title: 'Personalized Nutrition',
    content: (
      <p>Get tailored supplement recommendations based on your unique health profile and goals.</p>
    ),
    image: '/api/placeholder/600/300',
    alt: 'Person reviewing personalized nutrition recommendations on tablet'
  },
  {
    id: '2',
    title: 'AI-Powered Insights',
    content: (
      <p>Our advanced AI analyzes your health data to provide actionable insights and recommendations.</p>
    ),
    image: '/api/placeholder/600/300',
    alt: 'AI dashboard showing health analytics and trends'
  },
  {
    id: '3',
    title: 'Expert Guidance',
    content: (
      <p>Connect with certified nutritionists and health experts for personalized guidance.</p>
    ),
    image: '/api/placeholder/600/300',
    alt: 'Video call with health expert providing consultation'
  }
];

const dropdownOptions = [
  { value: 'vitamin-d', label: 'Vitamin D', description: 'Supports bone health and immune function', group: 'Vitamins' },
  { value: 'omega-3', label: 'Omega-3', description: 'Essential fatty acids for heart and brain health', group: 'Supplements' },
  { value: 'probiotics', label: 'Probiotics', description: 'Beneficial bacteria for digestive health', group: 'Supplements' },
  { value: 'vitamin-b12', label: 'Vitamin B12', description: 'Essential for energy and nerve function', group: 'Vitamins' },
  { value: 'magnesium', label: 'Magnesium', description: 'Important for muscle and nerve function', group: 'Minerals' },
  { value: 'zinc', label: 'Zinc', description: 'Supports immune system and wound healing', group: 'Minerals' }
];

const sampleData = Array.from({ length: 50 }, (_, i) => ({
  id: (i + 1).toString(),
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  status: i % 3 === 0 ? 'Active' : i % 3 === 1 ? 'Inactive' : 'Pending',
  score: Math.floor(Math.random() * 100),
  joinDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString()
}));

const tableColumns = [
  { key: 'name', label: 'Name', sortable: true, searchable: true },
  { key: 'email', label: 'Email', sortable: true, searchable: true },
  { key: 'status', label: 'Status', filterable: true, sortable: true },
  { key: 'score', label: 'Score', sortable: true, align: 'right' as const },
  { key: 'joinDate', label: 'Join Date', sortable: true }
];

const DemoSection: React.FC<{
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}> = ({ title, description, icon: Icon, children }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="space-y-6"
  >
    <div className="text-center">
      <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{description}</p>
    </div>
    <Card className="p-6">
      {children}
    </Card>
  </motion.section>
);

const ToastDemo: React.FC = () => {
  const { addToast } = useToast();

  const showToasts = () => {
    addToast(toast.success(
      'Success!',
      'Your health profile has been updated successfully.',
      {
        action: {
          label: 'View Profile',
          onClick: () => console.log('View profile clicked')
        }
      }
    ));

    setTimeout(() => {
      addToast(toast.info(
        'Recommendation Ready',
        'New supplement recommendations are available based on your latest health data.'
      ));
    }, 1000);

    setTimeout(() => {
      addToast(toast.warning(
        'Reminder',
        'Don\'t forget to take your evening supplements.',
        {
          action: {
            label: 'Mark as Taken',
            onClick: () => console.log('Marked as taken')
          }
        }
      ));
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-600 dark:text-gray-400">
        Accessible toast notifications with screen reader support, keyboard navigation, 
        and auto-dismiss with pause on hover/focus.
      </p>
      <Button onClick={showToasts} className="w-full">
        Show Toast Examples
      </Button>
    </div>
  );
};

const InclusiveDesignDemo: React.FC = () => {
  const [selectedSupplement, setSelectedSupplement] = useState<string>('');
  const [contentItems, setContentItems] = useState(() => 
    Array.from({ length: 25 }, (_, i) => ({
      id: (i + 1).toString(),
      content: (
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              {i % 3 === 0 ? <Heart className="w-5 h-5 text-primary" /> :
               i % 3 === 1 ? <Star className="w-5 h-5 text-primary" /> :
               <Trophy className="w-5 h-5 text-primary" />}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Health Tip #{i + 1}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {i % 3 === 0 ? 'Nutrition' : i % 3 === 1 ? 'Exercise' : 'Wellness'}
              </p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            This is a sample health tip that provides valuable information about maintaining 
            optimal wellness through evidence-based practices.
          </p>
        </Card>
      )
    }))
  );

  return (
    <ToastProvider containerProps={{ position: 'top-right' }}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Inclusive Design Patterns
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Accessible alternatives to common problematic UI patterns. These components 
                work across diverse users and provide excellent accessibility support.
              </p>
            </motion.div>
          </div>

          <div className="space-y-16">
            {/* Accessible Carousel */}
            <DemoSection
              title="Accessible Carousel"
              description="Alternative to auto-advancing carousels with full keyboard navigation, screen reader support, and user controls."
              icon={Image}
            >
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Features: Keyboard navigation (arrow keys, home, end), screen reader announcements, 
                  auto-play controls, reduced motion support, and touch/swipe gestures.
                </p>
                <AccessibleCarousel
                  items={carouselItems}
                  autoPlay={false}
                  showThumbnails={true}
                  showControls={true}
                  showIndicators={true}
                  ariaLabel="Health platform features showcase"
                />
              </div>
            </DemoSection>

            {/* Accessible Dropdown */}
            <DemoSection
              title="Enhanced Dropdown"
              description="Accessible alternative to complex dropdown menus with search, filtering, and keyboard navigation."
              icon={List}
            >
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Features: Full keyboard navigation, search functionality, grouped options, 
                  multiple selection, ARIA attributes, and progressive enhancement.
                </p>
                <div className="max-w-md">
                  <AccessibleDropdown
                    options={dropdownOptions}
                    value={selectedSupplement}
                    onChange={(value) => setSelectedSupplement(value as string)}
                    placeholder="Select a supplement"
                    label="Choose Your Supplement"
                    description="Select from our curated list of high-quality supplements"
                    searchable={true}
                    allowClear={true}
                  />
                </div>
                {selectedSupplement && (
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-green-800 dark:text-green-200">
                      Selected: {dropdownOptions.find(opt => opt.value === selectedSupplement)?.label}
                    </p>
                  </div>
                )}
              </div>
            </DemoSection>

            {/* Paginated Content */}
            <DemoSection
              title="Paginated Content"
              description="Accessible alternative to infinite scroll with multiple loading patterns and back-to-top functionality."
              icon={Navigation}
            >
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Features: Multiple loading patterns (pagination, load more), back to top functionality, 
                  screen reader announcements, and keyboard navigation.
                </p>
                <PaginatedContent
                  items={contentItems}
                  mode="pagination"
                  pageSize={6}
                  showBackToTop={true}
                  announceChanges={true}
                  className="max-h-[600px] overflow-hidden"
                />
              </div>
            </DemoSection>

            {/* Media Player */}
            <DemoSection
              title="Accessible Media Player"
              description="Enhanced media player with custom accessible controls and keyboard support."
              icon={Video}
            >
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Features: Custom accessible controls, full keyboard support, screen reader announcements, 
                  and reduced motion support.
                </p>
                <div className="max-w-2xl">
                  <AccessibleMediaPlayer
                    src="/api/placeholder/800/450"
                    type="audio"
                    title="Wellness Meditation Audio"
                    description="A guided meditation session for stress relief and mental clarity"
                    controls={true}
                  />
                </div>
              </div>
            </DemoSection>

            {/* Toast Notifications */}
            <DemoSection
              title="Accessible Notifications"
              description="Enhanced toast system with screen reader support and keyboard navigation."
              icon={Bell}
            >
              <ToastDemo />
            </DemoSection>

            {/* Data Table */}
            <DemoSection
              title="Advanced Data Table"
              description="Accessible data table with multiple view modes, sorting, filtering, and keyboard navigation."
              icon={Table}
            >
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Features: Multiple view modes (table, grid, list), advanced filtering and searching, 
                  sortable columns, row selection, and full keyboard navigation.
                </p>
                <AdvancedDataTable
                  data={sampleData}
                  columns={tableColumns}
                  title="User Management"
                  description="Manage and view user accounts with advanced filtering and sorting capabilities"
                  searchable={true}
                  filterable={true}
                  selectable={true}
                  viewMode="table"
                  allowViewModeChange={true}
                  pageSize={8}
                />
              </div>
            </DemoSection>

            {/* Guidelines Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-6"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Accessibility Guidelines
              </h2>
              <div className="max-w-4xl mx-auto">
                <Card className="p-8 text-left">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Keyboard Navigation
                      </h3>
                      <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                        <li>• Tab order is logical and predictable</li>
                        <li>• Focus indicators are clearly visible</li>
                        <li>• Escape key closes modals and dropdowns</li>
                        <li>• Arrow keys navigate within components</li>
                        <li>• Home/End keys jump to beginning/end</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Screen Reader Support
                      </h3>
                      <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                        <li>• ARIA labels and descriptions</li>
                        <li>• Live regions for dynamic content</li>
                        <li>• Proper heading hierarchy</li>
                        <li>• Meaningful alternative text</li>
                        <li>• Status announcements</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Progressive Enhancement
                      </h3>
                      <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                        <li>• Works without JavaScript</li>
                        <li>• Graceful degradation</li>
                        <li>• Touch-friendly design (44px targets)</li>
                        <li>• Respects reduced motion preferences</li>
                        <li>• High contrast mode support</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Universal Design
                      </h3>
                      <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                        <li>• Mobile-first responsive design</li>
                        <li>• Multiple interaction methods</li>
                        <li>• Flexible and adaptable interfaces</li>
                        <li>• Error prevention and recovery</li>
                        <li>• Clear and simple language</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
};

export default InclusiveDesignDemo;
