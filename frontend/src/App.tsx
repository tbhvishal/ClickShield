import { useState, useMemo, useCallback, Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Zap, Radar, ShieldCheck } from 'lucide-react'
import logo from './assets/500x500.png'

// Lazy load heavy components for better performance
const SecurityTipsButton = lazy(() => import('./components/SecurityTipsButton'))
const URLInputForm = lazy(() => import('./components/forms/URLInputForm'))
const ResultCard = lazy(() => import('./components/results/ResultCard'))
const HistoryList = lazy(() => import('./components/results/HistoryList'))
const Header = lazy(() => import('./components/layout/Header'))
const Footer = lazy(() => import('./components/layout/Footer'))

// Loading fallback component
import LoadingFallback from './components/LoadingFallback'

export interface PredictionResult {
  url: string
  safe: boolean
  threat_type: string
  platform_type: string
  matches: any[]
  threat_description?: string
  confidence?: string
  checked_variations?: number
  recommendation?: string
  cached?: boolean
  cache_age?: number
  ssl_verified?: boolean
}

function App() {
  const [currentResult, setCurrentResult] = useState<PredictionResult | null>(null)
  const [history, setHistory] = useState<PredictionResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Optimized background elements for better performance
  const backgroundElements = useMemo(() => [
    {
      id: 1,
      size: 'w-80 h-80',
      colors: 'bg-gradient-to-r from-blue-300/6 to-blue-400/6 dark:from-blue-500/8 dark:to-blue-600/8',
      position: 'top-20 left-10',
      duration: 25, // Optimized for better performance
      delay: 0,
      blur: 'blur-2xl'
    },
    {
      id: 2,
      size: 'w-72 h-72',
      colors: 'bg-gradient-to-r from-blue-300/5 to-blue-400/5 dark:from-blue-500/7 dark:to-blue-600/7',
      position: 'bottom-20 right-10',
      duration: 28, // Optimized for better performance
      delay: 2,
      blur: 'blur-2xl'
    },
    {
      id: 3,
      size: 'w-64 h-64',
      colors: 'bg-gradient-to-r from-blue-300/4 to-blue-400/4 dark:from-blue-500/6 dark:to-blue-600/6',
      position: 'top-1/2 left-1/2',
      duration: 32, // Optimized for better performance
      delay: 4,
      blur: 'blur-xl'
    }
  ], [])

  const handlePrediction = useCallback(async (url: string) => {
    setIsLoading(true)
    setError(null)
    setCurrentResult(null)

    try {
      const apiBaseUrl = import.meta.env.VITE_BACKEND_API_URL;
      if (!apiBaseUrl) {
        throw new Error('VITE_BACKEND_API_URL is not set in your environment. Please define it in your .env file.');
      }
      const response = await fetch(`${apiBaseUrl}/api/check-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      console.log('Google Safe Browsing API Response:', data)
      console.log('Response Details:')
      console.log('- URL:', data.url)
      console.log('- Safe:', data.safe)
      console.log('- Threat Type:', data.threat_type)
      console.log('- Platform Type:', data.platform_type)
      console.log('- Matches:', data.matches)
      console.log('- Number of matches:', data.matches?.length || 0)

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to check URL')
      }

      // Use the real data from Google Safe Browsing API
      const result: PredictionResult = {
        url: data.url,
        safe: data.safe,
        threat_type: data.threat_type,
        platform_type: data.platform_type,
        matches: data.matches || [],
        threat_description: data.threat_description,
        confidence: data.confidence,
        checked_variations: data.checked_variations,
        recommendation: data.recommendation,
        cached: data.cached,
        cache_age: data.cache_age,
        ssl_verified: data.ssl_verified
      }

      setCurrentResult(result)
      setHistory(prev => [result, ...prev.slice(0, 4)]) // Keep last 5 results

      // Auto-scroll to results after a short delay with improved reliability
      setTimeout(() => {
        const resultElement = document.querySelector('[data-result-section]');
        if (resultElement) {
          // Add a temporary highlight class for visual feedback
          resultElement.classList.add('scroll-highlight');

          // Use multiple scroll methods for better compatibility
          resultElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });

          // Fallback scroll method
          setTimeout(() => {
            const rect = resultElement.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const targetY = rect.top + scrollTop - 100; // Add some offset from top

            window.scrollTo({
              top: targetY,
              behavior: 'smooth'
            });
          }, 300);

          // Remove highlight after animation
          setTimeout(() => {
            resultElement.classList.remove('scroll-highlight');
          }, 2000);
        }
      }, 800); // Increased delay to ensure component is fully rendered

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-blue-50/60 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900 transition-all duration-500 relative overflow-hidden" role="application" aria-label="ClickShield Phishing Detection Application">
      {/* Progress Bar at top of page */}
      {isLoading && (
        <div className="fixed top-0 left-0 w-full z-50" role="progressbar" aria-label="URL analysis in progress" aria-valuetext="Analyzing URL...">
          <div className="h-1 bg-gradient-to-r from-blue-500 via-blue-500 to-blue-500 animate-pulse" style={{ width: '100%' }} />
        </div>
      )}
      {/* Premium background pattern */}
      <div className="absolute inset-0 opacity-4 dark:opacity-3" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.15)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.08)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>

      {/* Optimized background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {backgroundElements.map((element) => (
          <div
            key={element.id}
            className={`absolute ${element.position} ${element.size} ${element.colors} rounded-full ${element.blur}`}
          />
        ))}
      </div>

      {/* Header */}
      <Suspense fallback={<div className="animate-pulse h-16 bg-gray-200 dark:bg-gray-700"></div>}>
        <Header />
      </Suspense>

      <main className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl min-h-screen" role="main">
        <section className="relative flex flex-col justify-center min-h-[65vh] sm:min-h-[70vh]" aria-labelledby="main-heading">
          <header className="relative flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="text-center mb-6 sm:mb-8"
            >
              {/* Logo Section */}
              <motion.div