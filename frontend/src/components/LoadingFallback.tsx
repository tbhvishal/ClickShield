import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface LoadingFallbackProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

const LoadingFallback = ({ message = 'Loading...', size = 'md' }: LoadingFallbackProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center space-x-3 p-4"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className={`${sizeClasses[size]} text-blue-500`} />
      </motion.div>
      <span className="text-gray-600 dark:text-gray-300">{message}</span>
    </motion.div>
  )
}

export default LoadingFallback
