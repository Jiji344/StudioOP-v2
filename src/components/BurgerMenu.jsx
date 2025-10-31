import React, { useState } from 'react'
import CircularText from './CircularText'
import './BurgerMenu.css'

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      <div className="button-wrap">
        <CircularText />
        <div className="button-shadow"></div>
        <button 
          onClick={handleToggle} 
          className={`hamburger-button ${isOpen ? 'hamburger-open' : ''}`}
        >
          <input 
            type="checkbox" 
            checked={isOpen}
            onChange={handleToggle}
            className="hamburger-input"
          />
          <svg viewBox="0 0 32 32" className="hamburger-svg">
            <path 
              className="line line-top-bottom" 
              d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
            />
            <path 
              className="line" 
              d="M7 16 27 16"
            />
          </svg>
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="menu-overlay" onClick={handleClose}></div>
      )}

      {/* Menu Card */}
      <div className={`menu-card ${isOpen ? 'menu-card-open' : ''}`}>
        <div className="menu-card-shadow"></div>
        <div className="menu-card-content">
          {/* Petit bouton de fermeture avec croix */}
          <button className="menu-close-small" onClick={handleClose}>×</button>
          <nav className="menu-nav">
            <a href="#section1" onClick={handleClose}>Accueil</a>
            <a href="#section2" onClick={handleClose}>Section 2</a>
            <a href="#section3" onClick={handleClose}>Section 3</a>
            <a href="#section4" onClick={handleClose}>Section 4</a>
            <a href="#section5" onClick={handleClose}>Section 5</a>
            <a href="#section6" onClick={handleClose}>Section 6</a>
          </nav>
        </div>
      </div>
    </>
  )
}

export default BurgerMenu
