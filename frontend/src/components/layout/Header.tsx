import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import logo from '../../assets/500x500.png'

const Header = () => {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')

    // We start in light mode by default, unless the user picked dark before
    if (savedTheme === 'dark') {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    } else {
      setDarkMode(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)

    if (newDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-br from-slate-50/98 via-white/95 to-indigo-50/90 dark:from-slate-900/98 dark:via-gray-900/95 dark:to-indigo-900/90 backdrop-blur-3xl shadow-2xl border-b border-slate-200/20 dark:border-slate-700/20">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/3 via-cyan-500/2 to-blue-500/3 dark:from-indigo-400/5 dark:via-purple-400/3 dark:via-cyan-400/2 dark:to-blue-400/3" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/8 to-white/12 dark:from-transparent dark:via-gray-900/8 dark:to-gray-900/12" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/2 to-transparent dark:via-indigo-400/2" />
      <div className="container mx-auto px-8 sm:px-12 lg:px-16 relative">
        <div className="flex items-center justify-between h-20">
          {/* Ultra Premium Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              {/* Multi-layered Logo Container */}
              <div className="relative w-12 h-12 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/50 dark:ring-slate-700/50 hover:ring-white/70 dark:hover:ring-slate-600/70 transition-all duration-300">
                {/* Outer Glow */}
                <div className="absolute -inset-3 bg-gradient-to-br from-indigo-500/30 via-purple-500/25 to-blue-500/25 rounded-3xl blur-xl" />
                {/* Middle Glow */}
                <div className="absolute -inset-2 bg-gradient-to-br from-indigo-400/20 via-cyan-400/15 to-blue-400/18 rounded-3xl blur-lg" />
                {/* Inner Glow */}
                <div className="absolute -inset-1 bg-gradient-to-br from-indigo-300/12 via-purple-300/10 to-blue-300/12 rounded-3xl blur-md" />
                {/* Core Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-200/8 via-cyan-200/6 to-blue-200/8 rounded-3xl" />
                <img
                  src={logo}
                  alt="ClickShield Logo"
                  className="relative w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                {/* Premium Border Overlay */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 via-transparent to-slate-900/20 dark:from-white/20 dark:via-transparent dark:to-slate-900/30" />
                {/* Inner Highlight */}
                <div className="absolute top-1 left-1 w-3 h-3 bg-gradient-to-br from-white/50 to-transparent rounded-full blur-sm" />
                {/* Premium Shine Effect */}
                <div className="absolute top-0 left-0 w-6 h-6 bg-gradient-to-br from-white/30 to-transparent rounded-full blur-sm" />
              </div>
            </div>

            {/* Enhanced Brand Section */}
            <div className="flex flex-col space-y-0.5">
              <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 dark:from-indigo-300 dark:via-purple-300 dark:to-blue-400 bg-clip-text text-transparent tracking-tight drop-shadow-lg">
                ClickShield
              </h1>
              <div className="flex items-center space-x-2">
                <p className="text-xs text-slate-700 dark:text-slate-300 font-bold tracking-wide bg-gradient-to-r from-slate-600 to-slate-500 dark:from-slate-400 dark:to-slate-500 bg-clip-text text-transparent">
                  Advanced Phishing Detection & Security Analysis
                </p>
                <div className="w-1 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full shadow-md" />
              </div>
            </div>
          </div>

          {/* Premium Theme Toggle */}
          <div className="flex items-center">
            <div className="relative group">
              <button
                onClick={toggleDarkMode}
                className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-white/95 via-slate-50/90 to-white/85 dark:from-slate-900/95 dark:via-gray-900/90 dark:to-slate-800/85 shadow-2xl ring-2 ring-slate-200/60 dark:ring-slate-700/60 overflow-hidden"
                aria-label="Toggle dark mode"
              >
                {/* Background Gradient */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/8 via-cyan-400/6 to-blue-500/10 dark:from-indigo-400/15 dark:via-purple-400/12 dark:via-cyan-300/10 dark:to-blue-400/15" />

                {/* Icon Container */}
                <div className="relative z-10 flex items-center justify-center w-full h-full">
                  {darkMode ? (
                    <Sun className="w-7 h-7 text-yellow-500 drop-shadow-lg" />
                  ) : (
                    <Moon className="w-7 h-7 text-indigo-600 drop-shadow-lg" />
                  )}
                </div>

                {/* Subtle Inner Shadow */}
                <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-transparent to-slate-900/5 dark:to-white/5" />
              </button>
            </div>
          </div>
        </div>
      </div>


    </header>
  )
}

export default Header

