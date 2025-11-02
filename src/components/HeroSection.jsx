import React, { Suspense, useState, useEffect, lazy } from 'react'
import { useGridAnimation } from '../contexts/GridAnimationContext'
import BurgerMenu from './BurgerMenu'
import Clock from './Clock'
import InfoBanner from './InfoBanner'
import Loader from './Loader'
import './HeroSection.css'

// Lazy load du composant 3D pour réduire le bundle initial
const LazyCanvas3D = lazy(() => import('./Canvas3D'))

const HeroSection = () => {
  const [fov, setFov] = useState(75)
  const [isClient, setIsClient] = useState(false)
  const [showLoader, setShowLoader] = useState(true)
  const { triggerAnimation } = useGridAnimation()

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

  const handleModelLoaded = () => {
    // Cacher le loader après un court délai
    setTimeout(() => {
      setShowLoader(false)
      // Déclencher l'animation de la grille après avoir caché le loader
      setTimeout(() => {
        triggerAnimation()
      }, 300)
    }, 500)
  }

  return (
    <section className="section hero-section" id="section1">
      {/* Loader stylé avec des carrés */}
      {showLoader && <Loader />}
      
      <Clock />
      <BurgerMenu />
      
      {/* Canvas 3D pour l'objet Studio - Lazy loaded */}
      <div className="hero-3d-container">
        {isClient && (
          <Suspense fallback={null}>
            <LazyCanvas3D fov={fov} onModelLoaded={handleModelLoaded} />
          </Suspense>
        )}
      </div>
      
      <div className="section-content hero-content">
        <h1 className="hero-title" data-text="STUDIO">
          STUDIO
        </h1>
      </div>
      
      <InfoBanner />
    </section>
  )
}

export default HeroSection
