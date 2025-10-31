import React from 'react'

const GridOverlay = () => {
  return (
    <>
      {/* Grille fine avec petits carrés */}
      <div className="grid-overlay fine-grid"></div>
      {/* Grille principale avec gros rectangles */}
      <div className="grid-overlay main-grid"></div>
    </>
  )
}

export default GridOverlay

