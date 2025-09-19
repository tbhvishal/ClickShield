import { useState } from 'react'
import { motion } from 'framer-motion'
import { PredictionResult } from '../../App'
import { CheckCircle, AlertTriangle, Shield, Zap, XCircle, Globe, Database, Clock, Target, Info, Check, Copy, Check as CheckIcon, Lock, RefreshCw } from 'lucide-react'

interface ResultCardProps {
  result: PredictionResult
}

const ResultCard = ({ result }: ResultCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `URL: ${result.url}\nSafe: ${result.safe}\nThreat Type: ${result.threat_type}\nPlatform: ${result.platform_type}\nDescription: ${result.threat_description || ''}\nConfidence: ${result.confidence || ''}\nSSL Verified: ${result.ssl_verified ? 'Yes' : 'No'}\nRecommendation: ${result.recommendation || ''}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
