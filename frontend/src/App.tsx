import { useState, useMemo, useCallback, Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Zap, ShieldCheck, Eye } from 'lucide-react'
import logo from './assets/500x500.png'

// Loading components only when needed to keep things fast
const SecurityTipsButton = lazy(() => import('./components/SecurityTipsButton'))
const URLInputForm = lazy(() => import('./components/forms/URLInputForm'))
const ResultCard = lazy(() => import('./components/results/ResultCard'))
const HistoryList = lazy(() => import('./components/results/HistoryList'))
const Header = lazy(() => import('./components/layout/Header'))
const Footer = lazy(() => import('./components/layout/Footer'))

// A simple loading component to show while things load
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
  warning?: boolean
}

function App() {
  const [currentResult, setCurrentResult] = useState<PredictionResult | null>(null)
  const [history, setHistory] = useState<PredictionResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Background elements that are optimized for smooth performance
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
      // Use configured backend URL when provided, otherwise use relative API path
      const apiBaseUrl = import.meta.env.VITE_BACKEND_API_URL || '';
      const fetchUrl = apiBaseUrl ? `${apiBaseUrl.replace(/\/$/, '')}/api/check-url` : '/api/check-url';
      const response = await fetch(fetchUrl, {
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

      // Using the actual data from Google's Safe Browsing API
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
        ssl_verified: data.ssl_verified,
        warning: data.warning
      }

      setCurrentResult(result)
      setHistory(prev => [result, ...prev.slice(0, 4)]) // Keep last 5 results

      // Scrolling to the results section after a short wait for better user experience
      setTimeout(() => {
        const resultElement = document.querySelector('[data-result-section]');
        if (resultElement) {
          // Adding a highlight effect to draw attention
          resultElement.classList.add('scroll-highlight');

          // Trying different scroll methods to work on all browsers
          resultElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });

          // Another way to scroll if the first one doesn't work
          setTimeout(() => {
            const rect = resultElement.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const targetY = rect.top + scrollTop - 100; // Add some offset from top

            window.scrollTo({
              top: targetY,
              behavior: 'smooth'
            });
          }, 300);

          // Removing the highlight once the animation is done
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

      <main className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl" role="main">
        <section className="relative flex flex-col justify-center min-h-[85vh] sm:min-h-[90vh] lg:min-h-[95vh] pb-8" aria-labelledby="main-heading">
          <header className="relative flex flex-col justify-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="text-center mb-4 sm:mb-6"
            >
              {/* Logo Section */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.05, duration: 0.3, ease: "easeOut" }}
                className="mb-2 sm:mb-3"
              >
                <div className="flex justify-center mb-2 sm:mb-3">
                  <motion.div
                    whileHover={{ scale: 1.03, rotate: 3 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white/20 dark:border-gray-700/50 backdrop-blur-sm">
                      <img
                        src={logo}
                        alt="ClickShield Logo"
                        className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl"
                      />
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                      className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-blue-500 dark:from-blue-500 dark:to-blue-600 rounded-2xl opacity-20 blur-sm"
                    />
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
                className="mb-2 sm:mb-3"
              >
                <h1 id="main-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent mb-1 sm:mb-2 leading-tight tracking-tight drop-shadow-lg">
                  ClickShield
                </h1>
                <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-blue-500 to-blue-500 mx-auto rounded-full"></div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }}
                className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4 sm:mb-6 leading-relaxed px-4"
              >
                Advanced phishing detection powered by Google's Safe Browsing API.
                Protect yourself from malicious websites with real-time security analysis.
              </motion.p>

              {/* Features Grid - Compact */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3 max-w-3xl mx-auto mb-4 sm:mb-6">
                <div className="flex flex-row items-center justify-start text-left p-2 sm:p-2.5 bg-gradient-to-br from-white/80 via-white/70 to-slate-50/60 dark:from-gray-800/80 dark:via-gray-800/70 dark:to-slate-900/60 backdrop-blur-md rounded-xl border-2 border-emerald-200/70 dark:border-emerald-400/50 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 w-auto min-w-0 ring-1 ring-emerald-300/30 dark:ring-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-emerald-500 mr-1.5 flex-shrink-0 drop-shadow-sm" />
                  <h3 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-white bg-gradient-to-r from-emerald-700 to-emerald-600 dark:from-emerald-300 dark:to-emerald-400 bg-clip-text text-transparent leading-tight">Phishing Defense</h3>
                </div>
                <div className="flex flex-row items-center justify-start text-left p-2 sm:p-2.5 bg-gradient-to-br from-white/80 via-white/70 to-slate-50/60 dark:from-gray-800/80 dark:via-gray-800/70 dark:to-slate-900/60 backdrop-blur-md rounded-xl border-2 border-blue-200/70 dark:border-blue-400/50 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 w-auto min-w-0 ring-1 ring-blue-300/30 dark:ring-blue-500/20">
                  <Zap className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-blue-500 mr-1.5 flex-shrink-0 drop-shadow-sm" />
                  <h3 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-white bg-gradient-to-r from-blue-700 to-blue-600 dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent leading-tight">Lightning Fast</h3>
                </div>
                <div className="flex flex-row items-center justify-start text-left p-2 sm:p-2.5 bg-gradient-to-br from-white/80 via-white/70 to-slate-50/60 dark:from-gray-800/80 dark:via-gray-800/70 dark:to-slate-900/60 backdrop-blur-md rounded-xl border-2 border-purple-200/70 dark:border-purple-400/50 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 w-auto min-w-0 ring-1 ring-purple-300/30 dark:ring-purple-500/20">
                  <Eye className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-purple-500 mr-1.5 flex-shrink-0 drop-shadow-sm" />
                  <h3 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-white bg-gradient-to-r from-purple-700 to-purple-600 dark:from-purple-300 dark:to-purple-400 bg-clip-text text-transparent leading-tight">Threat Intelligence</h3>
                </div>
              </div>
            </motion.div>
          </header>

          {/* URL Input Section - Integrated into hero */}
          <div className="relative mt-2 sm:mt-4 mb-4 sm:mb-6">
            <Suspense fallback={<LoadingFallback />}>
              <URLInputForm onSubmit={handlePrediction} isLoading={isLoading} />
            </Suspense>
          </div>

          {/* Security Tips Section - Show in hero until first scan */}
          {!currentResult && !error && (
            <div className="relative">
              <Suspense fallback={<LoadingFallback />}>
                <SecurityTipsButton />
              </Suspense>
            </div>
          )}
        </section>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto mb-6"
          >
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results Section */}
        {currentResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto mb-8"
            data-result-section
          >
            <Suspense fallback={<LoadingFallback />}>
              <ResultCard result={currentResult} />
            </Suspense>
          </motion.div>
        )}

        {/* History Section */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <Suspense fallback={<LoadingFallback />}>
              <HistoryList history={history} />
            </Suspense>
          </motion.div>
        )}

        {/* Security Tips Section - Show below history after first scan */}
        {(currentResult || error) && (
          <div className="relative mb-8 sm:mb-12 lg:mb-16">
            <Suspense fallback={<LoadingFallback />}>
              <SecurityTipsButton />
            </Suspense>
          </div>
        )}
      </main>

      {/* Footer */}
      <Suspense fallback={<div className="animate-pulse h-32 bg-gray-200 dark:bg-gray-700"></div>}>
        <Footer />
      </Suspense>
    </div>
  )
}

export default App
