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
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 mb-8">
            {/* Brand Section */}
            <div className="lg:col-span-2 text-center lg:text-left">
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start sm:space-x-4 space-y-3 sm:space-y-0 mb-6">
                <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-xl flex-shrink-0">
                  <img 
                    src={logo} 
                    alt="ClickShield Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 bg-clip-text text-transparent">
                    ClickShield
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Advanced Security Scanner</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed max-w-md mx-auto lg:mx-0">