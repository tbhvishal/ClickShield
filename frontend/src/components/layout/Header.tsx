import { useState, useEffect } from 'react'
import { Moon, Sun, Shield } from 'lucide-react'
import logo from '../../assets/500x500.png'

const Header = () => {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')

    // Always start in light mode unless user explicitly chose dark
    if (savedTheme === 'dark') {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    } else {
      setDarkMode(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])
