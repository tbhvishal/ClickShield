import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, Loader, Globe, Zap, Clipboard } from 'lucide-react'

interface URLInputFormProps {
  onSubmit: (url: string) => void
  isLoading: boolean
}

const URLInputForm = ({ onSubmit, isLoading }: URLInputFormProps) => {
  const [url, setUrl] = useState('')
  const [displayUrl, setDisplayUrl] = useState('')
  const [validationMessage, setValidationMessage] = useState('')

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const trimmedUrl = url.trim()

      if (!trimmedUrl) {
        setDisplayUrl('')
        setValidationMessage('')
        return
      }

      if (!trimmedUrl.includes('://') && trimmedUrl.includes('.')) {
        const completedUrl = `https://${trimmedUrl}`
        setDisplayUrl(completedUrl)
        setValidationMessage('')
      } else if (trimmedUrl && !trimmedUrl.includes('.')) {
        setDisplayUrl(trimmedUrl)
        setValidationMessage('Please include a domain extension (e.g., .com, .org)')
      } else if (trimmedUrl && trimmedUrl.includes(' ') || trimmedUrl.includes('<') || trimmedUrl.includes('>')) {
        // The URL has some invalid characters in it
        setDisplayUrl(trimmedUrl)
        setValidationMessage('URL contains invalid characters')
      } else if (trimmedUrl && (trimmedUrl.includes('..') || trimmedUrl.startsWith('.') || trimmedUrl.endsWith('.'))) {
        // The domain structure doesn't look right
        setDisplayUrl(trimmedUrl)
        setValidationMessage('Invalid domain structure')
      } else {
        setDisplayUrl(trimmedUrl)
        setValidationMessage('')
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [url])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const urlToSubmit = displayUrl.trim()
    if (urlToSubmit) {
      onSubmit(urlToSubmit)
    }
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setUrl(text)
    } catch (err) {
      // Couldn't paste from clipboard
    }
  }

  const isValidUrl = (string: string) => {
    if (!string.trim()) return false

    try {
      const urlToTest = string.includes('://') ? string : `https://${string}`
      const url = new URL(urlToTest)

      if (!url.hostname || url.hostname.length < 4) {
        return false
      }

      if (!url.hostname.includes('.')) {
        return false // No TLD
      }

      // Doing a basic check for a valid top-level domain
      const hostname = url.hostname.toLowerCase()
      const validTlds = ['.com', '.org', '.net', '.edu', '.gov', '.mil', '.info', '.biz', '.co', '.io', '.dev', '.app']
      const hasValidTld = validTlds.some(tld => hostname.endsWith(tld)) || hostname.includes('.')

      if (!hasValidTld) {
        return false // Invalid or missing TLD
      }

      if (hostname.includes('..') || hostname.startsWith('.') || hostname.endsWith('.')) {
        return false
      }

      return true
    } catch (_) {
      return false
    }
  }

  const getButtonText = () => {
    if (isLoading) return 'Scanning the website...'
    if (validationMessage) return validationMessage
    if (!isValidUrl(displayUrl) && url.trim()) return 'Invalid URL format'
    return 'Scan Website'
  }

  const getButtonIcon = () => {
    if (isLoading) {
      return (
        <div className="relative">
          <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-white drop-shadow-lg" />
          <div className="absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 animate-spin bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-sm opacity-50"></div>
        </div>
      )
    }

    if (validationMessage || (!isValidUrl(displayUrl) && url.trim())) {
      return (
        <div className="relative">
          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-lg" />
          <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-full blur-sm"></div>
        </div>
      )
    }

    return (
      <div className="relative">
        <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-lg group-hover:text-yellow-200 transition-all duration-300" />
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-sm opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-300/10 to-orange-300/10 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
      </div>
    )
  }

  const getButtonColor = () => {
    if (isLoading) return 'bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 hover:from-blue-600 hover:via-cyan-600 hover:to-indigo-700 shadow-blue-500/40'
    if (validationMessage || (!isValidUrl(displayUrl) && url.trim())) return 'bg-gradient-to-r from-red-500 via-pink-500 to-orange-600 hover:from-red-600 hover:via-pink-600 hover:to-orange-700 shadow-red-500/40'
    return 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 hover:from-emerald-600 hover:via-green-600 hover:to-teal-700 shadow-emerald-500/40'
  }

  const isButtonDisabled = () => {
    return isLoading || !url.trim() || !isValidUrl(displayUrl)
  }

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-teal-500/10 dark:from-blue-500/15 dark:via-cyan-500/15 dark:to-teal-500/15 rounded-2xl blur-xl max-w-4xl mx-auto" />

      <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <motion.div
          className="space-y-4 sm:space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="space-y-3 sm:space-y-4">
            <motion.label
              htmlFor="url"
              className="block text-center mb-4 sm:mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="inline-flex items-center justify-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-full border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm shadow-sm">
                <div className="p-1 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Scan Website for Threats
                </span>
                <div className="p-1 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-full">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
            </motion.label>

            <motion.div
              className="relative max-w-2xl mx-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="relative">
                <input
                  type="text"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isButtonDisabled()) {
                      handleSubmit({ preventDefault: () => {} } as React.FormEvent)
                    }
                  }}
                  placeholder="Enter website address to scan (e.g. https://example.com)"
                  className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 pr-16 sm:pr-20 text-base sm:text-base lg:text-lg text-center border-2 border-gray-200/30 dark:border-gray-600/30 rounded-full focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 dark:bg-gradient-to-r dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-md shadow-2xl hover:shadow-3xl focus:shadow-3xl focus:outline-none transition-all duration-500 bg-white/95 dark:text-white dark:placeholder-gray-400 placeholder:text-gray-500 dark:placeholder:text-gray-500"
                  disabled={isLoading}
                  autoComplete="off"
                  spellCheck="false"
                  required
                />
                <motion.button
                  onClick={handlePaste}
                  className="absolute right-3 sm:right-4 lg:right-6 top-1/2 transform -translate-y-1/2 p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  disabled={isLoading}
                  title="Paste from clipboard"
                >
                  <Clipboard className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
              </div>

              {displayUrl && displayUrl !== url && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-gray-600 dark:text-gray-400 mt-3 flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Will check: <span className="font-semibold text-blue-600 dark:text-blue-400">{displayUrl}</span></span>
                </motion.p>
              )}

              {validationMessage && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-red-600 dark:text-red-400 mt-3 flex items-center space-x-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>{validationMessage}</span>
                </motion.p>
              )}
            </motion.div>
          </div>

          <motion.button
            onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
            disabled={isButtonDisabled()}
            className={`relative max-w-xs sm:max-w-sm lg:max-w-md mx-auto block font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-xl text-white text-sm sm:text-base transition-all duration-500 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105 disabled:transform-none disabled:shadow-lg overflow-hidden group ${getButtonColor()}`}
            whileHover={!isButtonDisabled() ? { scale: 1.02 } : {}}
            whileTap={!isButtonDisabled() ? { scale: 0.98 } : {}}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            {/* Background layers */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/5 rounded-xl"></div>

            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1200 ease-out rounded-xl"></div>

            {/* Glow rings */}
            <div className="absolute inset-0 rounded-xl ring-1 ring-white/20 group-hover:ring-white/40 transition-all duration-500"></div>
            <div className="absolute inset-0 rounded-xl ring-2 ring-white/10 group-hover:ring-white/30 transition-all duration-500"></div>

            {/* Inner glow */}
            <div className={`absolute inset-1 rounded-lg transition-opacity duration-500 ${
              isLoading
                ? 'bg-gradient-to-r from-blue-400/30 via-cyan-400/30 to-indigo-400/30 opacity-0 group-hover:opacity-100'
                : validationMessage || (!isValidUrl(displayUrl) && url.trim())
                ? 'bg-gradient-to-r from-red-400/30 via-pink-400/30 to-orange-400/30 opacity-0 group-hover:opacity-100'
                : 'bg-gradient-to-r from-emerald-400/30 via-green-400/30 to-teal-400/30 opacity-0 group-hover:opacity-100'
            }`}></div>

            {/* Particles */}
            <div className="absolute top-2 left-4 w-1 h-1 bg-white/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
            <div className="absolute top-3 right-6 w-0.5 h-0.5 bg-white/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="absolute bottom-2 right-4 w-1 h-1 bg-white/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            <div className="absolute bottom-3 left-6 w-0.5 h-0.5 bg-white/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" style={{ animationDelay: '0.6s' }}></div>

            <div className="relative flex items-center justify-center space-x-2 z-10">
              <div className="relative p-1 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 group-hover:border-white/30 shadow-inner group-hover:shadow-white/20">
                <div className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:drop-shadow-2xl">
                  {getButtonIcon()}
                </div>
                {/* Icon ring effect */}
                <div className="absolute inset-0 rounded-full ring-1 ring-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
              </div>
              <span className="tracking-wide drop-shadow-sm font-semibold group-hover:tracking-wider transition-all duration-300">{getButtonText()}</span>
            </div>

            {/* Corner highlights */}
            <div className="absolute top-1 left-1 w-2 h-2 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
            <div className="absolute top-1 right-1 w-2 h-2 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
            <div className="absolute bottom-1 left-1 w-2 h-2 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
            <div className="absolute bottom-1 right-1 w-2 h-2 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>

            {/* Border accent */}
            <div className="absolute inset-0 rounded-xl border border-white/10 group-hover:border-white/20 transition-all duration-500"></div>
          </motion.button>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-4"
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-200 dark:border-blue-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300 ml-2">
                  Analyzing website security...
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Decorative */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 dark:from-blue-500 dark:to-cyan-600 rounded-full opacity-60" />
        <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-cyan-400 to-teal-500 dark:from-cyan-500 dark:to-teal-600 rounded-full opacity-40" />
      </div>
    </motion.div>
  )
}

export default URLInputForm