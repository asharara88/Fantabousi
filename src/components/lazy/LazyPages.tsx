import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy load page components for better performance
export const LazyHomePage = lazy(() => import('../../pages/HomePage'));
export const LazyDashboardPage = lazy(() => import('../../pages/DashboardPage'));
export const LazyMyCoachPage = lazy(() => import('../../pages/MyCoachPage'));
export const LazyNutritionPage = lazy(() => import('../../pages/NutritionPage'));
export const LazyFitnessPage = lazy(() => import('../../pages/FitnessPage'));
export const LazySupplementsPage = lazy(() => import('../../pages/SupplementsPage'));
export const LazyRecipesPage = lazy(() => import('../../pages/RecipesPage'));
export const LazyAboutPage = lazy(() => import('../../pages/AboutPage'));
export const LazyCartPage = lazy(() => import('../../pages/CartPage'));
export const LazyMyStacksPage = lazy(() => import('../../pages/MyStacksPage'));
export const LazySupplementStorePage = lazy(() => import('../../pages/SupplementStorePage'));
export const LazySupplementDetailPage = lazy(() => import('../../pages/SupplementDetailPage'));
export const LazyRecipeDetailPage = lazy(() => import('../../pages/RecipeDetailPage'));
export const LazySavedRecipesPage = lazy(() => import('../../pages/SavedRecipesPage'));
export const LazyNutritionDashboardPage = lazy(() => import('../../pages/NutritionDashboardPage'));
export const LazySupplementRecommendationsPage = lazy(() => import('../../pages/SupplementRecommendationsPage'));
export const LazyMetabolismPage = lazy(() => import('../../pages/MetabolismPage'));
export const LazyBioclockPage = lazy(() => import('../../pages/BioclockPage'));

// Loading fallback component
export const PageLoadingFallback = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-text-muted">Loading...</p>
    </div>
  </div>
);

// HOC to wrap lazy components with Suspense
export const withSuspense = (Component: React.ComponentType) => {
  return (props: any) => (
    <Suspense fallback={<PageLoadingFallback />}>
      <Component {...props} />
    </Suspense>
  );
};
