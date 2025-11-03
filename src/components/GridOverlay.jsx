import React, { useState, useEffect } from 'react'

const GridOverlay = ({ shouldAnimate = false }) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [documentHeight, setDocumentHeight] = useState(0)
  const [viewWidth, setViewWidth] = useState(10000)

  useEffect(() => {
    if (shouldAnimate) {
      setIsAnimating(true)
    }
  }, [shouldAnimate])

  // Calculer la hauteur réelle du document
  useEffect(() => {
    const updateDimensions = () => {
      // Obtenir la hauteur totale du document
      const height = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      )
      setDocumentHeight(height)
      // La largeur doit correspondre à la largeur de l'écran
      setViewWidth(window.innerWidth)
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    // Observer les changements de taille du document
    const resizeObserver = new ResizeObserver(updateDimensions)
    resizeObserver.observe(document.body)
    
    return () => {
      window.removeEventListener('resize', updateDimensions)
      resizeObserver.disconnect()
    }
  }, [])

  // Ajuster pour avoir exactement 5 rectangles de largeur
  const numberOfRectanglesWidth = 5
  const gridWidth = viewWidth / numberOfRectanglesWidth  // Largeur d'un rectangle
  const gridHeight = gridWidth / 2  // Ratio 2:1, hauteur d'un rectangle
  
  // Calculer combien de rectangles sont nécessaires pour couvrir toute la hauteur du document
  const numberOfRectanglesHeight = Math.ceil(documentHeight / gridHeight)
  const viewHeight = gridHeight * numberOfRectanglesHeight  // Hauteur suffisante pour couvrir tout le document
  
  // Arrêter la grille après la 5ème case de hauteur
  const gridStopY = 5 * gridHeight  // Fin de la case 5
  
  // Générer les lignes verticales - arrêter après la case 5
  const verticalLines = []
  let vIndex = 0
  for (let x = 0; x <= viewWidth; x += gridWidth) {
    const delay = vIndex * 0.05  // Délai progressif plus rapide
    verticalLines.push(
      <line
        key={`v-${x}`}
        x1={x}
        y1={0}
        x2={x}
        y2={gridStopY}
        className={`grid-line-drawing vertical-line ${isAnimating ? 'drawing' : ''}`}
        style={{
          '--line-length': gridStopY,
          '--animation-delay': `${delay}s`
        }}
      />
    )
    vIndex++
  }
  
  // Générer les lignes horizontales - arrêter après la case 5
  const horizontalLines = []
  let hIndex = 0
  for (let y = 0; y <= gridStopY; y += gridHeight) {
    const delay = 0.2 + hIndex * 0.05  // Délai progressif plus rapide
    horizontalLines.push(
      <line
        key={`h-${y}`}
        x1={0}
        y1={y}
        x2={viewWidth}
        y2={y}
        className={`grid-line-drawing horizontal-line ${isAnimating ? 'drawing' : ''}`}
        style={{
          '--line-length': viewWidth,
          '--animation-delay': `${delay}s`
        }}
      />
    )
    hIndex++
  }

  // Ne pas afficher si les dimensions ne sont pas encore calculées
  if (documentHeight === 0 || viewWidth === 0) {
    return (
      <>
        <div className="grid-overlay diamond-texture"></div>
      </>
    )
  }

  return (
    <>
      {/* Texture en mini losanges - arrêter après la case 5 */}
      <div className="grid-overlay diamond-texture" style={{
        position: 'relative',
        maskImage: `linear-gradient(to bottom, 
          black 0%, 
          black ${(gridStopY / viewHeight) * 100}%, 
          transparent ${(gridStopY / viewHeight) * 100}%, 
          transparent 100%)`,
        WebkitMaskImage: `linear-gradient(to bottom, 
          black 0%, 
          black ${(gridStopY / viewHeight) * 100}%, 
          transparent ${(gridStopY / viewHeight) * 100}%, 
          transparent 100%)`
      }}></div>
      {/* Grille principale avec animation de dessin */}
      <div className="grid-overlay main-grid-animated">
        <svg
          className="grid-svg"
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: '100%',
            height: '100%'
          }}
        >
          <g className="grid-lines-container">
            {verticalLines}
            {horizontalLines}
          </g>
        </svg>
      </div>
    </>
  )
}

export default GridOverlay

