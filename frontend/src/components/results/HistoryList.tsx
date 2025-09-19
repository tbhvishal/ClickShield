import { motion } from 'framer-motion'
import { PredictionResult } from '../../App'
import { CheckCircle, AlertTriangle, Shield, Clock, ExternalLink } from 'lucide-react'

interface HistoryListProps {
  history: PredictionResult[]
}

const HistoryList = ({ history }: HistoryListProps) => {
  const getResultColor = (safe: boolean, threatType: string) => {
    if (safe) return {
      bg: 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      border: 'border-blue-200 dark:border-blue-700',
      text: 'text-blue-700 dark:text-blue-300',
      icon: 'text-blue-600 dark:text-blue-400'
    }
    switch (threatType) {
      case 'MALWARE':
        return {
          bg: 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20',