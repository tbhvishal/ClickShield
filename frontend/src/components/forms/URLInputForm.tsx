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