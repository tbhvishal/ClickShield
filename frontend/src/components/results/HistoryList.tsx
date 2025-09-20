import { motion } from 'framer-motion'
import { CheckCircle, AlertTriangle, Shield, Clock, ExternalLink } from 'lucide-react'
import { PredictionResult } from '../../App'

interface HistoryListProps {
  history: PredictionResult[]
}

const HistoryList = ({ history }: HistoryListProps) => {
  const getResultColor = (safe: boolean, threatType: string) => {
    if (safe) return {
      bg: 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      border: 'border-green-200 dark:border-green-700',
      text: 'text-green-700 dark:text-green-300',
      icon: 'text-green-600 dark:text-green-400'
    }
    switch (threatType) {
      case 'MALWARE':
        return {
          bg: 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20',
          border: 'border-red-200 dark:border-red-700',
          text: 'text-red-700 dark:text-red-300',
          icon: 'text-red-600 dark:text-red-400'
        }
      case 'SOCIAL_ENGINEERING':
        return {
          bg: 'bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20',
          border: 'border-orange-200 dark:border-orange-700',
          text: 'text-orange-700 dark:text-orange-300',
          icon: 'text-orange-600 dark:text-orange-400'
        }
      case 'UNWANTED_SOFTWARE':
        return {
          bg: 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20',
          border: 'border-red-200 dark:border-red-700',
          text: 'text-red-700 dark:text-red-300',
          icon: 'text-red-600 dark:text-red-400'
        }
      case 'UNREACHABLE_DOMAIN':
        return {
          bg: 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20',
          border: 'border-yellow-200 dark:border-yellow-700',
          text: 'text-yellow-700 dark:text-yellow-300',
          icon: 'text-yellow-600 dark:text-yellow-400'
        }
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20',
          border: 'border-gray-200 dark:border-gray-700',
          text: 'text-gray-700 dark:text-gray-300',
          icon: 'text-gray-600 dark:text-gray-400'
        }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-gradient-to-br from-white/90 via-white/80 to-white/70 dark:from-gray-900/90 dark:via-gray-800/80 dark:to-gray-900/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-8 relative overflow-hidden"
    >
      {/* Premium background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

      <div className="flex items-center space-x-4 mb-8 relative z-10">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
          <Clock className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Scan History
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Your recent security scans
          </p>
        </div>
      </div>

      <div className="space-y-6 relative z-10">
        {history.map((result, index) => {
          const colors = getResultColor(result.safe, result.threat_type)

          return (
            <motion.div
              key={`${result.url}-${index}`}
              initial={{ opacity: 0, x: -30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{
                delay: index * 0.15,
                duration: 0.5,
                ease: "easeOut"
              }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className={`${colors.bg} border ${colors.border} rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group`}
            >
              {/* Card background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-start space-x-4 flex-1 min-w-0">
                  <div className={`p-3 rounded-xl shadow-md ${result.safe
                    ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-500/25'
                    : result.threat_type === 'UNREACHABLE_DOMAIN'
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-yellow-500/25'
                    : 'bg-gradient-to-br from-red-400 to-rose-500 shadow-red-500/25'
                  }`}>
                    {result.safe ? (
                      <CheckCircle className="w-6 h-6 text-white drop-shadow-sm" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-white drop-shadow-sm" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <p className={`text-lg font-bold ${colors.text} tracking-wide`}>
                        {result.safe ? 'SECURE' : result.threat_type === 'UNREACHABLE_DOMAIN' ? 'WARNING' : 'THREAT'}
                      </p>
                      <div className={`w-2 h-2 rounded-full ${result.safe
                        ? 'bg-green-500 shadow-green-500/50 shadow-lg'
                        : result.threat_type === 'UNREACHABLE_DOMAIN'
                        ? 'bg-yellow-500 shadow-yellow-500/50 shadow-lg'
                        : 'bg-red-500 shadow-red-500/50 shadow-lg'
                      }`} />
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline font-medium"
                        >
                          {result.url}
                        </a>
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {result.threat_description || 'No known threats detected'}
                      </p>
                    </div>
                  </div>
                </div>

                <motion.a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 text-gray-400 hover:text-blue-500 transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl group/link"
                  title="Visit website"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ExternalLink className="w-5 h-5 group-hover/link:text-blue-600 transition-colors" />
                </motion.a>
              </div>
            </motion.div>
          )
        })}
      </div>

      {history.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center py-12 relative z-10"
        >
          <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-3xl shadow-xl inline-block">
            <Shield className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          </div>
          <h4 className="text-xl font-bold text-gray-700 dark:text-gray-300 mt-6 mb-2">
            No scan history yet
          </h4>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
            Your recent security scans will appear here. Start by scanning a website to see your history grow.
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

export default HistoryList
