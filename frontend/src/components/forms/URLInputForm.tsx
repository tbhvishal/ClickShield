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