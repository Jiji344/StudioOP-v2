import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import './Clock.css'

const Clock = () => {
  const [time, setTime] = useState(new Date())
  const { language, toggleLanguage } = useLanguage()

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }

  return (
    <div className="clock-container">
      <div className="clock-text">{formatTime(time)}</div>
      <div className="language-switch-container">
        <button 
          className="language-switch" 
          onClick={toggleLanguage}
          aria-label="Toggle language"
        >
          <span className={`lang-option ${language === 'fr' ? 'active' : ''}`}>FR</span>
          <span className={`lang-option ${language === 'en' ? 'active' : ''}`}>EN</span>
        </button>
      </div>
    </div>
  )
}

export default Clock







