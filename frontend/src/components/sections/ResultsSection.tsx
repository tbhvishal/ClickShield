import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

interface ResultsSectionProps {
  error: string | null
  currentResult: any
}

const ResultsSection = ({ error }: ResultsSectionProps) => {
  return (
    <section className="relative">
      {/* Error Section */}
      {error && (
        <motion.aside
          role="alert"
          aria-live="assertive"
          className="mb-5"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-2 border-red-200 dark:border-red-800 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 dark:bg-red-800/50 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-red-800 dark:text-red-200 mb-2">
                  Error Detected
                </h3>
                <p className="text-red-700 dark:text-red-300 leading-relaxed">
                  {error}
                </p>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </section>
  )
}

export default ResultsSection
