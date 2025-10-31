import React from 'react'

const GridOverlay = () => {
  return (
    <>
      {/* Texture en mini losanges */}
      <div className="grid-overlay diamond-texture"></div>
      {/* Grille principale avec gros rectangles */}
      <div className="grid-overlay main-grid"></div>
    </>
  )
}

export default GridOverlay

