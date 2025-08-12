import { Routes, Route } from 'react-router-dom';
import './styles/accessibility-typography.css';
import './styles/enhanced-contrast.css';
import './styles/dyslexia-friendly-typography.css';
import './styles/enhanced-headings.css';
import './styles/reading-optimization.css';
import './styles/enhanced-interactions.css';
import Layout from './components/layout/Layout';
import TestPage from './pages/TestPage';
import { ThemeProvider } from './contexts/ThemeContext';
import PerformanceDashboard from './components/ui/PerformanceDashboard';

// Lazy loaded pages for better performance
import {
  LazyHomePage,
  LazyDashboardPage,
  LazyMyCoachPage,
  LazyNutritionPage,
  LazyFitnessPage,
  LazySupplementsPage,
  LazyRecipesPage,
  LazyAboutPage,
  LazyCartPage,
  LazyMyStacksPage,
  LazySupplementStorePage,
  LazySupplementDetailPage,
  LazyRecipeDetailPage,
  LazySavedRecipesPage,
  LazyNutritionDashboardPage,
  LazySupplementRecommendationsPage,
  LazyMetabolismPage,
  LazyBioclockPage,
  withSuspense
} from './components/lazy/LazyPages';

// Auth pages loaded eagerly as they're small and critical
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import OnboardingPage from './pages/auth/OnboardingPage';
import NotFoundPage from './pages/NotFoundPage';
import DiagnosticsPage from './pages/DiagnosticsPage';
import LandingPage from './pages/LandingPage';
import SupabaseDebugPage from './pages/SupabaseDebugPage';

// Payment pages
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentCancelPage from './pages/PaymentCancelPage';

// Demo pages
import LiveTimeDemo from './components/demo/LiveTimeDemo';
import GlassmorphismShowcase from './components/ui/GlassmorphismShowcase';
import PricingPage from './pages/PricingPage';

// Wrap lazy components with Suspense
const HomePage = withSuspense(LazyHomePage);
const DashboardPage = withSuspense(LazyDashboardPage);
const MyCoachPage = withSuspense(LazyMyCoachPage);
const NutritionPage = withSuspense(LazyNutritionPage);
const FitnessPage = withSuspense(LazyFitnessPage);
const SupplementsPage = withSuspense(LazySupplementsPage);
const RecipesPage = withSuspense(LazyRecipesPage);
const AboutPage = withSuspense(LazyAboutPage);
const CartPage = withSuspense(LazyCartPage);
const MyStacksPage = withSuspense(LazyMyStacksPage);
const SupplementStorePage = withSuspense(LazySupplementStorePage);
const SupplementDetailPage = withSuspense(LazySupplementDetailPage);
const RecipeDetailPage = withSuspense(LazyRecipeDetailPage);
const SavedRecipesPage = withSuspense(LazySavedRecipesPage);
const NutritionDashboardPage = withSuspense(LazyNutritionDashboardPage);
const SupplementRecommendationsPage = withSuspense(LazySupplementRecommendationsPage);
const MetabolismPage = withSuspense(LazyMetabolismPage);
const BioclockPage = withSuspense(LazyBioclockPage);

function App() {
  return (
    <ThemeProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/welcome" element={<HomePage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/diagnostics" element={<DiagnosticsPage />} />
        <Route path="/debug" element={<SupabaseDebugPage />} />
        <Route path="/glassmorphism" element={<GlassmorphismShowcase />} />
        
        {/* Payment routes */}
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path="/payment-cancel" element={<PaymentCancelPage />} />
        
        {/* Protected routes wrapped in Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="mycoach" element={<MyCoachPage />} />
          <Route path="nutrition" element={<NutritionPage />} />
          <Route path="nutrition/dashboard" element={<NutritionDashboardPage />} />
          <Route path="fitness" element={<FitnessPage />} />
          <Route path="supplements" element={<SupplementsPage />} />
          <Route path="supplements/store" element={<SupplementStorePage />} />
          <Route path="supplements/stacks" element={<MyStacksPage />} />
          <Route path="supplements/recommendations" element={<SupplementRecommendationsPage />} />
          <Route path="supplements/:id" element={<SupplementDetailPage />} />
          <Route path="recipes" element={<RecipesPage />} />
          <Route path="recipes/saved" element={<SavedRecipesPage />} />
          <Route path="recipes/:id" element={<RecipeDetailPage />} />
          <Route path="metabolism" element={<MetabolismPage />} />
          <Route path="bioclock" element={<BioclockPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="test" element={<TestPage />} />
          <Route path="demo/live-time" element={<LiveTimeDemo />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      
      {/* Performance monitoring dashboard for development */}
      <PerformanceDashboard />
    </ThemeProvider>
  );
}

export default App;