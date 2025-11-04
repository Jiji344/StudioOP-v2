import React from 'react'
import { GridAnimationProvider, useGridAnimation } from './contexts/GridAnimationContext'
import { LanguageProvider, useLanguage } from './contexts/LanguageContext'
import HeroSection from './components/HeroSection'
import Section from './components/Section'
import GridOverlay from './components/GridOverlay'

function AppContent() {
  const { shouldAnimate } = useGridAnimation()
  const { t } = useLanguage()
  const sections = [
    { id: 'section2', title: t('myProjects'), content: t('section2Content') },
    { id: 'section3', title: t('section3'), content: t('section3Content') },
    { id: 'section4', title: t('section4'), content: t('section4Content') },
    { id: 'section5', title: t('section5'), content: t('section5Content') },
    { id: 'section6', title: t('section6'), content: t('section6Content') },
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
    <LanguageProvider>
      <GridAnimationProvider>
        <AppContent />
      </GridAnimationProvider>
    </LanguageProvider>
  )
}

export default App

