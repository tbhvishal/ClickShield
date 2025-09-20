import { useState } from 'react'
import { BookOpen, Shield, CheckCircle, AlertTriangle, Lock, Mail, Zap, ArrowDown, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const SecurityTipsButton = () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleButtonClick = () => {
    // Switching the visibility of the content
    setIsOpen(!isOpen)

    // Scrolling to the tips section after a bit to let it load
    setTimeout(() => {
      const tipsContent = document.querySelector('[data-security-tips-content]')
      if (tipsContent && !isOpen) { // Only scroll when opening, not when closing
        tipsContent.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    }, 500)
  }

  const securityTips = [
    {
      icon: Shield,
      title: 'Understand Threat Levels',
      description: 'Learn what different threat types mean - from malware to phishing. Our system uses Google\'s comprehensive database to identify specific risks.',
      color: 'text-blue-500'
    },
    {
      icon: AlertTriangle,
      title: 'Check SSL Certificates',
      description: 'Look for the SSL verification status. Sites without proper SSL certificates are more likely to be malicious or untrustworthy.',
      color: 'text-red-500'
    },
    {
      icon: Lock,
      title: 'Review Platform Types',
      description: 'Different platforms have different risk levels. Social media links, email attachments, and suspicious downloads are common attack vectors.',
      color: 'text-green-500'
    },
    {
      icon: Mail,
      title: 'Verify Before Clicking',
      description: 'Always check suspicious URLs with ClickShield before visiting. Don\'t click links from unknown sources or unexpected emails.',
      color: 'text-purple-500'
    },
    {
      icon: Zap,
      title: 'Use Real-time Scanning',
      description: 'Our lightning-fast analysis provides instant results. New threats are detected within seconds using the latest security intelligence.',
      color: 'text-yellow-500'
    },
    {
      icon: CheckCircle,
      title: 'Follow Safety Recommendations',
      description: 'When a site is flagged, follow our specific recommendations. Some threats require immediate action, others just caution.',
      color: 'text-emerald-500'
    }
  ]

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.button
        onClick={handleButtonClick}
        className="w-auto bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 hover:from-blue-600 hover:via-purple-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 group mx-auto"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <BookOpen className="w-4 h-4 group-hover:animate-pulse" />
        <div className="flex flex-col items-center">
          <span className="text-sm font-semibold">How to Protect Yourself</span>
          <span className="text-xs text-blue-200/80 font-normal">Learn essential security tips</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <ArrowDown className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 overflow-hidden"
            data-security-tips-content
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {securityTips.map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4 p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-600/50 transition-colors"
                  >
                    <div className={`p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 ${tip.color}`}>
                      <tip.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                        {tip.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {tip.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 p-6 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-green-800/20 rounded-2xl border-2 border-green-200/60 dark:border-green-700/40 shadow-lg"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-green-300/50 dark:ring-green-600/50">
                      <CheckCircle className="w-7 h-7 text-white drop-shadow-md" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-green-800 dark:text-green-200 mb-1">
                      Maximize ClickShield Protection
                    </h4>
                    <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                      Advanced Threat Detection
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Use ClickShield before visiting any suspicious link. Our advanced analysis combined with Google's Safe Browsing provides the most comprehensive protection available.
                </p>
              </motion.div>

              {/* Scan Protect Safe Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl border border-blue-200/50 dark:border-blue-700/40 text-center">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h5 className="font-bold text-blue-800 dark:text-blue-200 mb-1">SCAN</h5>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Check URLs before clicking</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl border border-green-200/50 dark:border-green-700/40 text-center">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <h5 className="font-bold text-green-800 dark:text-green-200 mb-1">PROTECT</h5>
                  <p className="text-sm text-green-700 dark:text-green-300">Stay safe from threats</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 p-4 rounded-xl border border-emerald-200/50 dark:border-emerald-700/40 text-center">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <h5 className="font-bold text-emerald-800 dark:text-emerald-200 mb-1">SAFE</h5>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">Browse with confidence</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SecurityTipsButton
