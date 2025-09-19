import { Github, Shield, Zap, Heart, Lock, Star, Code, Users, FileText } from 'lucide-react'

import logo from '../../assets/500x500.png'

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-gray-900 dark:to-blue-900/20 border-t border-blue-100/30 dark:border-gray-700/30 mt-16">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-15 dark:opacity-8">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.08),transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(6,182,212,0.06),transparent_70%)]" />
      </div>

      {/* Dot pattern */}
      <div className="absolute inset-0 opacity-3 dark:opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(59,130,246,0.15)_1px,transparent_1px)] bg-[length:24px_24px]" />
      </div>

      <div className="relative container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto">