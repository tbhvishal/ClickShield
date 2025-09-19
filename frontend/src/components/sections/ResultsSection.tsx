import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

interface ResultsSectionProps {
  error: string | null
  currentResult: any
}

const ResultsSection = ({ error, currentResult }: ResultsSectionProps) => {
  return (
    <section className="relative">
      {/* Error Section */}
      {error && (
        <aside role="alert" aria-live="assertive" className="mb-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-2 border-red-200 dark:border-red-800 rounded-3xl p-8 shadow-2xl"
          >