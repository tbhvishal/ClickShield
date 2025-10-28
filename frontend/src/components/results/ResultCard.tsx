import { useState } from 'react'
import { motion } from 'framer-motion'
import { PredictionResult } from '../../App'
import { CheckCircle, XCircle, Globe, Target, Info, Copy, CheckIcon, Lock, Shield, AlertTriangle, Award, Zap, FileText } from 'lucide-react'
import { generatePDFReport } from '../../utils'

interface ResultCardProps {
  result: PredictionResult
}

const ResultCard = ({ result }: ResultCardProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const text = `URL: ${result.url}
Safe: ${result.safe}
Warning: ${result.warning || false}
Threat Type: ${result.threat_type}
Platform: ${result.platform_type}
Description: ${result.threat_description || ''}
Confidence: ${result.confidence || ''}
SSL Verified: ${result.ssl_verified !== undefined ? (result.ssl_verified ? 'Yes' : 'No') : 'Not Checked'}
Variations Checked: ${result.checked_variations || 1}
Cached: ${result.cached ? 'Yes' : 'No'}
Cache Age: ${result.cache_age || 0} seconds
Recommendation: ${result.recommendation || ''}
Matches Found: ${result.matches?.length || 0}`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const handleExportPDF = () => {
    generatePDFReport(result)
  }

  const getStatusConfig = () => {
    if (result.safe) {
      return {
        bg: 'bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-teal-500/10',
        border: 'border-emerald-200/60 dark:border-emerald-700/40',
        accent: 'from-emerald-500 to-green-600',
        text: 'text-emerald-800 dark:text-emerald-200',
        icon: 'text-emerald-600 dark:text-emerald-400',
        glow: 'shadow-emerald-500/20',
        badge: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200'
      }
    } else if (result.warning) {
      return {
        bg: 'bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-orange-500/10',
        border: 'border-amber-200/60 dark:border-amber-700/40',
        accent: 'from-amber-500 to-orange-600',
        text: 'text-amber-800 dark:text-amber-200',
        icon: 'text-amber-600 dark:text-amber-400',
        glow: 'shadow-amber-500/20',
        badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200'
      }
    } else {
      return {
        bg: 'bg-gradient-to-br from-red-500/10 via-rose-500/5 to-pink-500/10',
        border: 'border-red-200/60 dark:border-red-700/40',
        accent: 'from-red-500 to-rose-600',
        text: 'text-red-800 dark:text-red-200',
        icon: 'text-red-600 dark:text-red-400',
        glow: 'shadow-red-500/20',
        badge: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
      }
    }
  }

  const getStatusInfo = () => {
    if (result.safe) {
      return {
        title: 'Website Appears Safe',
        subtitle: 'No known security threats detected',
        icon: CheckCircle,
        badge: 'SECURE'
      }
    } else if (result.warning) {
      if (result.threat_type === 'UNREACHABLE_DOMAIN') {
        return {
          title: 'Domain Not Available',
          subtitle: result.threat_description || 'This website cannot be reached - treat as potentially risky',
          icon: AlertTriangle,
          badge: 'UNREACHABLE'
        }
      }
      return {
        title: 'Caution Required',
        subtitle: result.threat_description || 'Additional verification recommended',
        icon: AlertTriangle,
        badge: 'CAUTION'
      }
    } else {
      const threatTitles = {
        'MALWARE': 'Malicious Software Detected',
        'SOCIAL_ENGINEERING': 'Phishing Attack Detected',
        'UNWANTED_SOFTWARE': 'Unwanted Software Warning',
        'POTENTIALLY_HARMFUL_APPLICATION': 'Potentially Harmful Content'
      }
      return {
        title: threatTitles[result.threat_type as keyof typeof threatTitles] || 'Security Risk Detected',
        subtitle: result.threat_description || 'This website poses a security risk',
        icon: XCircle,
        badge: 'THREAT'
      }
    }
  }

  const statusInfo = getStatusInfo()
  const status = getStatusConfig()

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative ${status.bg} border ${status.border} rounded-3xl p-8 shadow-2xl ${status.glow} overflow-hidden backdrop-blur-sm`}
    >
      {/* Premium Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent,rgba(255,255,255,0.05),transparent)]" />
      </div>

      {/* Animated Border */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-blue-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="relative z-10">
        {/* Premium Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${status.accent} shadow-lg ring-2 ring-white/30 dark:ring-gray-800/30`}>
              <statusInfo.icon className="w-6 h-6 text-white drop-shadow-md" />
            </div>
            <div className="space-y-2">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${status.badge} border border-current/20`}>
                <Award className="w-3 h-3 mr-1" />
                {statusInfo.badge}
              </div>
              <h3 className={`text-2xl font-bold ${status.text} leading-tight`}>
                {statusInfo.title}
              </h3>
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
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-md">
                  {statusInfo.subtitle}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className="p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 shadow-lg backdrop-blur-sm border border-white/20 dark:border-gray-700/20 transition-all duration-200"
              title="Copy results"
            >
              {copied ? (
                <CheckIcon className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportPDF}
              className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg backdrop-blur-sm border border-blue-400/20 transition-all duration-200"
              title="Export PDF Report"
            >
              <FileText className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>

        {/* 6-Card Premium Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Security Status */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }}
            whileHover={{
              y: -10,
              scale: 1.03,
              transition: { duration: 0.1 }
            }}
            className="group relative bg-gradient-to-br from-white/95 via-white/85 to-white/75 dark:from-gray-900/95 dark:via-gray-800/85 dark:to-gray-700/75 backdrop-blur-xl rounded-2xl p-6 border border-white/50 dark:border-gray-600/50 shadow-xl hover:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.3)] transition-all duration-300 overflow-hidden"
          >
            {/* Enhanced Background Pattern */}
            <div className="absolute inset-0 opacity-25">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/15 via-transparent to-purple-500/15" />
              <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-cyan-400/25 to-blue-500/25 rounded-full blur-2xl" />
            </div>

            {/* Enhanced Animated Border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-lg bg-gradient-to-br ${status.accent} shadow-lg ring-2 ring-white/40 dark:ring-gray-800/40 group-hover:scale-105 transition-transform duration-150`}>
                    <Shield className="w-4 h-4 text-white drop-shadow-md" />
                  </div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">Security Status</h4>
                </div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                  Main
                </div>
              </div>

              <div className="text-center space-y-3">
                <div className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold shadow-sm ${
                  result.safe ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700' :
                  result.warning ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-700' :
                  'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-700'
                }`}>
                  <div className={`w-2.5 h-2.5 rounded-full mr-2 ${
                    result.safe ? 'bg-green-500' : result.warning ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  {result.safe ? 'SECURE' : result.warning ? 'WARNING' : 'THREAT'}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Threat Type */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.3, ease: "easeOut" }}
            whileHover={{
              y: -10,
              scale: 1.03,
              transition: { duration: 0.1 }
            }}
            className="group relative bg-gradient-to-br from-white/95 via-white/85 to-white/75 dark:from-gray-900/95 dark:via-gray-800/85 dark:to-gray-700/75 backdrop-blur-xl rounded-2xl p-6 border border-white/50 dark:border-gray-600/50 shadow-xl hover:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.3)] transition-all duration-300 overflow-hidden"
          >
            {/* Enhanced Background Pattern */}
            <div className="absolute inset-0 opacity-25">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-500/15 via-transparent to-pink-500/15" />
              <div className="absolute top-6 right-6 w-20 h-20 bg-gradient-to-br from-pink-400/25 to-red-500/25 rounded-full blur-2xl" />
            </div>

            {/* Enhanced Animated Border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/30 via-pink-500/30 to-rose-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-lg bg-gradient-to-br from-red-500 to-pink-600 shadow-lg ring-2 ring-white/40 dark:ring-gray-800/40 group-hover:scale-105 transition-transform duration-150">
                    <AlertTriangle className="w-4 h-4 text-white drop-shadow-md" />
                  </div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">Threat Type</h4>
                </div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                  Risk
                </div>
              </div>

              <div className="text-center space-y-3">
                <div className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold shadow-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
                  <div className="w-2.5 h-2.5 bg-gray-500 rounded-full mr-2" />
                  {result.threat_type || 'NONE'}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Platform Type */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.3, ease: "easeOut" }}
            whileHover={{
              y: -10,
              scale: 1.03,
              transition: { duration: 0.1 }
            }}
            className="group relative bg-gradient-to-br from-white/95 via-white/85 to-white/75 dark:from-gray-900/95 dark:via-gray-800/85 dark:to-gray-700/75 backdrop-blur-xl rounded-2xl p-6 border border-white/50 dark:border-gray-600/50 shadow-xl hover:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.3)] transition-all duration-300 overflow-hidden"
          >
            {/* Enhanced Background Pattern */}
            <div className="absolute inset-0 opacity-25">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/15 via-transparent to-indigo-500/15" />
              <div className="absolute bottom-6 left-6 w-24 h-24 bg-gradient-to-br from-indigo-400/25 to-blue-500/25 rounded-full blur-2xl" />
            </div>

            {/* Enhanced Animated Border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/30 via-indigo-500/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg ring-2 ring-white/40 dark:ring-gray-800/40 group-hover:scale-105 transition-transform duration-150">
                    <Globe className="w-4 h-4 text-white drop-shadow-md" />
                  </div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">Platform</h4>
                </div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                  Source
                </div>
              </div>

              <div className="text-center space-y-3">
                <div className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold shadow-sm bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700">
                  <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mr-2" />
                  {result.platform_type || 'Unknown'}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 4: SSL Status */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3, ease: "easeOut" }}
            whileHover={{
              y: -10,
              scale: 1.03,
              transition: { duration: 0.1 }
            }}
            className="group relative bg-gradient-to-br from-white/95 via-white/85 to-white/75 dark:from-gray-900/95 dark:via-gray-800/85 dark:to-gray-700/75 backdrop-blur-xl rounded-2xl p-6 border border-white/50 dark:border-gray-600/50 shadow-xl hover:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.3)] transition-all duration-300 overflow-hidden"
          >
            {/* Enhanced Background Pattern */}
            <div className="absolute inset-0 opacity-25">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-500/15 via-transparent to-teal-500/15" />
              <div className="absolute top-8 right-8 w-18 h-18 bg-gradient-to-br from-teal-400/25 to-green-500/25 rounded-full blur-2xl" />
            </div>

            {/* Enhanced Animated Border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/30 via-teal-500/30 to-emerald-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 shadow-lg ring-2 ring-white/40 dark:ring-gray-800/40 group-hover:scale-105 transition-transform duration-150">
                    <Lock className="w-4 h-4 text-white drop-shadow-md" />
                  </div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">SSL Status</h4>
                </div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                  Security
                </div>
              </div>

              <div className="text-center space-y-3">
                {result.ssl_verified !== undefined ? (
                  <div className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold shadow-sm ${
                    result.ssl_verified ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700' :
                    'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-700'
                  }`}>
                    <Lock className={`w-3 h-3 mr-2 ${result.ssl_verified ? 'text-green-500' : 'text-red-500'}`} />
                    {result.ssl_verified ? 'VALID' : 'INVALID'}
                  </div>
                ) : (
                  <div className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold shadow-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
                    <Info className="w-3 h-3 mr-2 text-gray-500" />
                    NOT CHECKED
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Card 5: Confidence Level */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.3, ease: "easeOut" }}
            whileHover={{
              y: -10,
              scale: 1.03,
              transition: { duration: 0.1 }
            }}
            className="group relative bg-gradient-to-br from-white/95 via-white/85 to-white/75 dark:from-gray-900/95 dark:via-gray-800/85 dark:to-gray-700/75 backdrop-blur-xl rounded-2xl p-6 border border-white/50 dark:border-gray-600/50 shadow-xl hover:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.3)] transition-all duration-300 overflow-hidden"
          >
            {/* Enhanced Background Pattern */}
            <div className="absolute inset-0 opacity-25">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/15 via-transparent to-pink-500/15" />
              <div className="absolute bottom-8 right-8 w-20 h-20 bg-gradient-to-br from-pink-400/25 to-purple-500/25 rounded-full blur-2xl" />
            </div>

            {/* Enhanced Animated Border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-indigo-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg ring-2 ring-white/40 dark:ring-gray-800/40 group-hover:scale-105 transition-transform duration-150">
                    <Target className="w-4 h-4 text-white drop-shadow-md" />
                  </div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">Confidence</h4>
                </div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                  Certainty
                </div>
              </div>

              <div className="text-center space-y-3">
                {result.confidence ? (
                  <div className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold shadow-sm bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-700">
                    <Award className="w-3 h-3 mr-2 text-purple-500" />
                    {result.confidence}
                  </div>
                ) : (
                  <div className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold shadow-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
                    <Info className="w-3 h-3 mr-2 text-gray-500" />
                    N/A
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Card 6: Variations Checked */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.3, ease: "easeOut" }}
            whileHover={{
              y: -10,
              scale: 1.03,
              transition: { duration: 0.1 }
            }}
            className="group relative bg-gradient-to-br from-white/95 via-white/85 to-white/75 dark:from-gray-900/95 dark:via-gray-800/85 dark:to-gray-700/75 backdrop-blur-xl rounded-2xl p-6 border border-white/50 dark:border-gray-600/50 shadow-xl hover:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.3)] transition-all duration-300 overflow-hidden"
          >
            {/* Enhanced Background Pattern */}
            <div className="absolute inset-0 opacity-25">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-500/15 via-transparent to-orange-500/15" />
              <div className="absolute top-6 left-6 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-amber-500/20 rounded-full blur-3xl" />
            </div>

            {/* Enhanced Animated Border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500/30 via-orange-500/30 to-yellow-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg ring-2 ring-white/40 dark:ring-gray-800/40 group-hover:scale-105 transition-transform duration-150">
                    <Zap className="w-4 h-4 text-white drop-shadow-md" />
                  </div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">Variations</h4>
                </div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                  Actual
                </div>
              </div>

              <div className="text-center space-y-3">
                <div className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold shadow-sm bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-700">
                  <div className="w-2.5 h-2.5 bg-amber-500 rounded-full mr-2" />
                  {result.checked_variations || 1}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Threat Matches Section - Only show if there are matches */}
        {result.matches && result.matches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-br from-red-50/80 via-rose-50/60 to-pink-50/80 dark:from-red-950/40 dark:via-rose-950/30 dark:to-pink-950/40 backdrop-blur-sm rounded-2xl p-6 border border-red-200/50 dark:border-red-700/40 shadow-xl"
          >
            <div className="flex items-start space-x-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl shadow-lg ring-2 ring-red-200/50 dark:ring-red-800/30 flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-white drop-shadow-md" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="text-xl font-bold text-red-900 dark:text-red-100">
                    ⚠️ Detected Threats ({result.matches.length})
                  </h4>
                  <span className="px-3 py-1 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 text-xs font-bold rounded-full border border-red-300 dark:border-red-700">
                    HIGH RISK
                  </span>
                </div>
                <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">
                  This website has been flagged for containing security threats. <strong>Do not enter personal information, passwords, or financial details.</strong>
                </p>
              </div>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-red-300 dark:scrollbar-thumb-red-800 scrollbar-track-transparent">
              {result.matches.map((match: any, index: number) => {
                // Define user-friendly threat explanations
                const getThreatInfo = (threatType: string) => {
                  const threats: Record<string, { title: string; description: string; icon: string; action: string }> = {
                    'SOCIAL_ENGINEERING': {
                      title: '🎣 Phishing / Social Engineering Attack',
                      description: 'This site attempts to trick visitors into revealing sensitive information like passwords, credit card numbers, or personal data by impersonating legitimate websites or services.',
                      icon: '🎭',
                      action: 'Never enter login credentials or personal information on this site.'
                    },
                    'MALWARE': {
                      title: '🦠 Malware Distribution',
                      description: 'This website is known to distribute malicious software that can harm your device, steal data, or give attackers unauthorized access to your system.',
                      icon: '☣️',
                      action: 'Do not download any files or click on links from this site.'
                    },
                    'UNWANTED_SOFTWARE': {
                      title: '⚠️ Unwanted Software',
                      description: 'This site may install unwanted programs that change browser settings, display excessive ads, track your activity, or consume system resources without your consent.',
                      icon: '🚫',
                      action: 'Avoid installing any software or browser extensions from this site.'
                    },
                    'POTENTIALLY_HARMFUL_APPLICATION': {
                      title: '🔴 Potentially Harmful Application',
                      description: 'This website may host applications that exhibit suspicious behavior, collect excessive data, or perform actions that could compromise your privacy and security.',
                      icon: '⚡',
                      action: 'Do not download or run any applications from this source.'
                    }
                  }
                  return threats[threatType] || {
                    title: '❌ Unknown Security Threat',
                    description: 'This website has been flagged for security concerns. The specific nature of the threat is being analyzed.',
                    icon: '⚠️',
                    action: 'Exercise extreme caution and avoid interacting with this site.'
                  }
                }

                const getPlatformInfo = (platformType: string) => {
                  const platforms: Record<string, string> = {
                    'ANY_PLATFORM': '💻 All Devices & Platforms',
                    'WINDOWS': '🪟 Windows',
                    'LINUX': '🐧 Linux',
                    'ANDROID': '🤖 Android',
                    'OSX': '🍎 macOS',
                    'IOS': '📱 iOS',
                    'CHROME': '🌐 Chrome',
                    'ALL_PLATFORMS': '🌍 All Platforms'
                  }
                  return platforms[platformType] || '❓ Unknown Platform'
                }

                const threatInfo = getThreatInfo(match.threatType || '')
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="bg-white/90 dark:bg-gray-900/70 backdrop-blur-md rounded-xl p-5 border-2 border-red-300/50 dark:border-red-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {/* Threat Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-2xl">{threatInfo.icon}</span>
                          <h5 className="text-base font-bold text-red-900 dark:text-red-100">
                            {threatInfo.title}
                          </h5>
                        </div>
                        <span className="inline-flex items-center text-xs font-semibold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/40 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-700">
                          <Globe className="w-3 h-3 mr-1.5" />
                          {getPlatformInfo(match.platformType || '')}
                        </span>
                      </div>
                    </div>

                    {/* Threat Description */}
                    <div className="bg-red-50/50 dark:bg-red-950/30 rounded-lg p-4 mb-3 border border-red-100 dark:border-red-900/50">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                        {threatInfo.description}
                      </p>
                      <div className="flex items-start space-x-2 p-3 bg-red-100 dark:bg-red-900/40 rounded-lg border border-red-200 dark:border-red-800">
                        <Shield className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs font-semibold text-red-800 dark:text-red-200">
                          <strong>🛡️ Recommended Action:</strong> {threatInfo.action}
                        </p>
                      </div>
                    </div>

                    {/* Malicious URL */}
                    {match.threat?.url && (
                      <div className="mt-3">
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                          🔗 Flagged URL:
                        </label>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                          <p className="text-xs text-gray-700 dark:text-gray-300 font-mono break-all leading-relaxed">
                            {match.threat.url}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Cache Info if available */}
                    {match.cacheDuration && (
                      <div className="mt-3 flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                        <Info className="w-3 h-3" />
                        <span>Threat detected: {match.cacheDuration}</span>
                      </div>
                    )}
                  </motion.div>
                )
              })}
              
              {result.matches.length > 3 && (
                <div className="text-center py-3">
                  <span className="text-sm font-semibold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/40 px-5 py-2.5 rounded-lg border border-red-200 dark:border-red-700 inline-flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Showing all {result.matches.length} detected threat{result.matches.length > 1 ? 's' : ''}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Warning Banner */}
            <div className="mt-6 p-4 bg-gradient-to-r from-red-600 to-rose-600 rounded-xl shadow-lg border border-red-500">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-white/20 rounded-lg flex-shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h6 className="text-white font-bold text-sm mb-1">🚨 Security Advisory</h6>
                  <p className="text-white/90 text-xs leading-relaxed">
                    This website has been verified as dangerous by Google Safe Browsing. Close this page immediately and report it if you received it via email or message. <strong>Never trust urgent requests for personal information.</strong>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default ResultCard