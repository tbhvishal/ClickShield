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