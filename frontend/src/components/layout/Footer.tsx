import { Github, Shield, Zap, Heart, Globe, FileText } from 'lucide-react'
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
                Real-time phishing detection powered by Google's Safe Browsing API.
                Protecting users worldwide with cutting-edge security technology.
              </p>
            </div>

            {/* Features Section */}
            <div className="text-center lg:text-left">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center justify-center lg:justify-start space-x-2">
                <Zap className="w-5 h-5 text-blue-500" />
                <span>Features</span>
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-center lg:justify-start space-x-3 text-sm text-gray-600 dark:text-gray-300">
                  <Zap className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                  <span>Fast Scan</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-3 text-sm text-gray-600 dark:text-gray-300">
                  <Shield className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  <span>Smart Detect</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-3 text-sm text-gray-600 dark:text-gray-300">
                  <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span>Clear Report</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-center lg:text-left">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center justify-center lg:justify-start space-x-2">
                <Globe className="w-5 h-5 text-blue-500" />
                <span>Connect</span>
              </h4>
              <div className="space-y-4">
                {/* Premium GitHub Button */}
                <a
                  href="https://github.com/tbhvishal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 block"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-center justify-center space-x-2 py-3 px-4">
                    <Github className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-sm font-semibold text-white">Follow GitHub</span>
                  </div>
                </a>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <a
                    href="https://github.com/tbhvishal/ClickShield"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 block"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center justify-center space-x-2 py-2 px-3">
                      <Github className="w-4 h-4 text-white" />
                      <span className="text-sm font-medium text-white">Source Code</span>
                    </div>
                  </a>

                  <a
                    href="https://github.com/tbhvishal/ClickShield"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 group relative overflow-hidden rounded-lg bg-gradient-to-r from-green-600 via-green-700 to-green-800 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 block"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-green-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center justify-center space-x-2 py-2 px-3">
                      <Github className="w-4 h-4 text-white" />
                      <span className="text-sm font-medium text-white">Star Repo</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} ClickShield. All rights reserved.
              </p>

              {/* System Status Indicator */}
              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">System Online</span>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                  <span>Made With</span>
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>By</span>
                  <a
                    href="https://github.com/tbhvishal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium"
                  >
                    Vishal Sharma
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer