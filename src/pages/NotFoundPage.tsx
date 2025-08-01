import React from 'react'
import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import AdaptiveBackdrop from '../components/ui/AdaptiveBackdrop'
import ThemeToggle from '../components/ui/ThemeToggle'

const NotFoundPage: React.FC = () => {
  return (
    <AdaptiveBackdrop animationSpeed="fast" overlay={true}>
      <ThemeToggle />
      <div className="min-h-screen bg-white/30 dark:bg-black/20 backdrop-blur-sm flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-8 rounded-3xl border border-white/50 dark:border-gray-700/50 shadow-xl">
          <div className="mb-8">
            <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">404</h1>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Page not found</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Sorry, we couldn't find the page you're looking for.
            </p>
          </div>
          
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-emerald-600 transition-all duration-300 shadow-lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Go back home
          </Link>
        </div>
      </div>
    </AdaptiveBackdrop>
  )
}

export default NotFoundPage