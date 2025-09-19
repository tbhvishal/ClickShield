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
