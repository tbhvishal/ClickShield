import { motion } from 'framer-motion'
import { Zap, Radar, ShieldCheck } from 'lucide-react'
import logo from '../../assets/500x500.png'

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