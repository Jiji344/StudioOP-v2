import React, { Suspense, useState, useEffect, lazy } from 'react'
import GridOverlay from './GridOverlay'
import BurgerMenu from './BurgerMenu'
import './HeroSection.css'

// Lazy load du composant 3D pour réduire le bundle initial
const LazyCanvas3D = lazy(() => import('./Canvas3D'))

const HeroSection = () => {
  const [fov, setFov] = useState(75)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    const updateFov = () => {
      if (window.innerWidth <= 480) {
        setFov(60)
      } else if (window.innerWidth <= 768) {
        setFov(70)
      } else {
        setFov(75)
      }
    }

    updateFov()
    window.addEventListener('resize', updateFov)
    return () => window.removeEventListener('resize', updateFov)
  }, [])

  return (
    <section className="section hero-section" id="section1">
      <BurgerMenu />
      <GridOverlay />
      
      {/* Canvas 3D pour l'objet Studio - Lazy loaded */}
      <div className="hero-3d-container">
        {isClient && (
          <Suspense fallback={null}>
            <LazyCanvas3D fov={fov} />
          </Suspense>
        )}
      </div>
      
      <div className="section-content hero-content">
        <h1 className="hero-title" data-text="STUDIO">
          STUDIO
        </h1>
      </div>
    </section>
  )
}

export default HeroSection
