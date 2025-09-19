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
        // Contains invalid characters
        setDisplayUrl(trimmedUrl)
        setValidationMessage('URL contains invalid characters')
      } else if (trimmedUrl && (trimmedUrl.includes('..') || trimmedUrl.startsWith('.') || trimmedUrl.endsWith('.'))) {
        // Invalid domain structure
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
      // Failed to paste
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

      // Check for valid TLD (basic check)
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
                  className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 pr-16 sm:pr-20 text-sm sm:text-base lg:text-lg text-center border-2 border-gray-200/30 dark:border-gray-600/30 rounded-full focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 dark:bg-gradient-to-r dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-md shadow-2xl hover:shadow-3xl focus:shadow-3xl focus:outline-none transition-all duration-500 bg-white/95 dark:text-white dark:placeholder-gray-400 placeholder:text-gray-500 dark:placeholder:text-gray-500"
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