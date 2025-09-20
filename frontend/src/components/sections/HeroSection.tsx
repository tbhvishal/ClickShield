import { motion } from 'framer-motion'
import { Zap, Radar, ShieldCheck } from 'lucide-react'
const logo = '/assets/500x500.png'

const HeroSection = () => {
  return (
    <section className="relative flex flex-col justify-center min-h-[65vh] sm:min-h-[70vh]" aria-labelledby="main-heading">
      <header className="relative flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="text-center mb-6 sm:mb-8"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.05, duration: 0.3, ease: "easeOut" }}
            className="mb-6"
          >
            <img
              src={logo}
              alt="ClickShield Logo"
              className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl shadow-2xl"
            />
          </motion.div>

          {/* Title */}
          <motion.h1
            id="main-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-4 leading-tight"
          >
            ClickShield
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Advanced phishing detection powered by Google's Safe Browsing API.
            Protect yourself from malicious websites with real-time security analysis.
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3, ease: "easeOut" }}
            className="flex flex-wrap justify-center gap-6 mb-8"
          >
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              <span>Real-time Detection</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <Zap className="w-5 h-5 text-blue-500" />
              <span>Instant Results</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <Radar className="w-5 h-5 text-purple-500" />
              <span>Comprehensive Analysis</span>
            </div>
          </motion.div>
        </motion.div>
      </header>
    </section>
  )
}

export default HeroSection
