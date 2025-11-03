import React, { useRef, useEffect } from 'react'
import './CircularText.css'

const CircularText = () => {
  const svgRef = useRef(null)
  
  // Texte à afficher : STUDIO OP deux fois séparé par des étoiles
  const text = "★ STUDIO OP ★ STUDIO OP "
  
  // Répéter le texte plusieurs fois pour remplir le cercle
  const repeatedText = text.repeat(30)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    let rotation = 0
    const speed = 0.25 // Vitesse de rotation (degrés par frame)

    const animate = () => {
      rotation += speed
      if (rotation >= 360) {
        rotation = 0
      }
      
      // Faire tourner tout le groupe de texte
      const textElements = svg.querySelectorAll('.circular-text-group')
      textElements.forEach((element) => {
        element.setAttribute('transform', `rotate(${rotation} 100 100)`)
      })
      
      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)
    
    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div className="circular-text-container">
      <svg
        ref={svgRef}
        className="circular-text-svg"
        viewBox="0 0 200 200"
        width="80"
        height="80"
      >
        <defs>
          {/* Chemin circulaire */}
          <path
            id="circular-text-path"
            d="M 100, 40 A 60, 60 0 1, 1 100, 160 A 60, 60 0 1, 1 100, 40"
            fill="none"
          />
        </defs>
        <g className="circular-text-group">
          <text className="circular-text">
            <textPath
              href="#circular-text-path"
              className="circular-text-path"
              fontSize="13.5"
              fill="#ffffff"
              startOffset="0"
            >
              {repeatedText}
            </textPath>
          </text>
        </g>
      </svg>
    </div>
  )
}

export default CircularText
