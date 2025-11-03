import React from 'react'
import './Loader.css'

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader-squares">
        <div className="loader-square square-1"></div>
        <div className="loader-square square-2"></div>
        <div className="loader-square square-3"></div>
        <div className="loader-square square-4"></div>
        <div className="loader-square square-5"></div>
        <div className="loader-square square-6"></div>
        <div className="loader-square square-7"></div>
        <div className="loader-square square-8"></div>
        <div className="loader-square square-9"></div>
      </div>
      <div className="loader-text">Chargement...</div>
    </div>
  )
}

export default Loader





