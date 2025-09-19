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