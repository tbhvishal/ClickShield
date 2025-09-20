import { motion } from 'framer-motion'

interface HistorySectionProps {
  history: any[]
  currentResult: any
}

const HistorySection = ({ history, currentResult }: HistorySectionProps) => {
  if (history.length === 0) return null

  return (
    <section aria-labelledby="history-heading" className={`transition-all duration-500 ease-in-out ${currentResult ? 'mt-8 mb-12' : 'mt-12 mb-12'}`}>
      <h2 id="history-heading" className="sr-only">Recent Security Checks</h2>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.3 }}
      >
        {/* HistoryList will be lazy loaded */}
      </motion.div>
    </section>
  )
}

export default HistorySection
