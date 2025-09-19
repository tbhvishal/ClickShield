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