import { useState } from 'react'
import { Shield, CheckCircle, AlertTriangle, Lock, Mail, Zap, ArrowDown, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const SecurityTipsButton = () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleButtonClick = () => {
    // Toggle the content visibility
    setIsOpen(!isOpen)

    // Scroll to the security tips content after a short delay to allow content to render
    setTimeout(() => {
      const tipsContent = document.querySelector('[data-security-tips-content]')
      if (tipsContent && !isOpen) { // Only scroll when opening, not when closing
        tipsContent.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }