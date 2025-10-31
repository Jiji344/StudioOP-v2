import React from 'react'
import './LogoBanner.css'

const LogoBanner = () => {
  const logos = [
    { name: 'Adobe Illustrator', initials: 'Ai', color: '#FF9A00', bgColor: '#330000' },
    { name: 'Adobe Photoshop', initials: 'Ps', color: '#31A8FF', bgColor: '#001E36' },
    { name: 'Adobe InDesign', initials: 'Id', color: '#FF3366', bgColor: '#49021F' },
    { name: 'Figma', type: 'figma', gradient: true },
    { name: 'Canva', type: 'canva', gradient: true },
  ]

  // Dupliquer les logos pour un défilement infini sans saccade
  const duplicatedLogos = [...logos, ...logos]

  return (
    <div className="logo-banner-container">
      <div className="logo-banner-track">
        {duplicatedLogos.map((logo, index) => (
          <div key={index} className="logo-item">
            {logo.type === 'figma' ? (
              <div className="logo-figma">
                <div className="figma-shape shape-1"></div>
                <div className="figma-shape shape-2"></div>
                <div className="figma-shape shape-3"></div>
                <div className="figma-shape shape-4"></div>
              </div>
            ) : logo.type === 'canva' ? (
              <div className="logo-canva">Canva</div>
            ) : (
              <div 
                className="logo-adobe" 
                style={{ 
                  backgroundColor: logo.bgColor,
                  color: logo.color 
                }}
              >
                {logo.initials}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default LogoBanner

