import React from 'react'
import { GridAnimationProvider, useGridAnimation } from './contexts/GridAnimationContext'
import HeroSection from './components/HeroSection'
import Section from './components/Section'
import GridOverlay from './components/GridOverlay'

function AppContent() {
  const { shouldAnimate } = useGridAnimation()
  const sections = [
    { id: 'section2', title: 'Mes projets', content: 'Contenu de la section Mes projets' },
    { id: 'section3', title: 'Section 3', content: 'Contenu de la troisième section' },
    { id: 'section4', title: 'Section 4', content: 'Contenu de la quatrième section' },
    { id: 'section5', title: 'Section 5', content: 'Contenu de la cinquième section' },
    { id: 'section6', title: 'Section 6', content: 'Contenu de la sixième section' },
  ]

  return (
    <div className="app">
      {/* Grille qui couvre tout le body */}
      <GridOverlay shouldAnimate={shouldAnimate} />
      
      <HeroSection />
      {sections.map((section, index) => (
        <Section
          key={section.id}
          id={section.id}
          title={section.title}
          content={section.content}
          index={index}
        />
      ))}
    </div>
  )
}

function App() {
  return (
    <GridAnimationProvider>
      <AppContent />
    </GridAnimationProvider>
  )
}

export default App

