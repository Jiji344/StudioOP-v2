import React, { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

const translations = {
  fr: {
    // Navigation
    home: 'Accueil',
    section2: 'Section 2',
    section3: 'Section 3',
    section4: 'Section 4',
    section5: 'Section 5',
    section6: 'Section 6',
    
    // InfoBanner
    basedIn: 'BASÉE À MONTPELLIER',
    france: 'FRANCE',
    availableWorldwide: 'DISPONIBLE PARTOUT DANS',
    theWorld: 'LE MONDE',
    brandDesigner: 'BRAND DESIGNER +',
    marketingStrategy: 'STRATÉGIE MARKETING',
    
    // Sections
    myProjects: 'Mes projets',
    section2Content: 'Contenu de la section Mes projets',
    section3Content: 'Contenu de la troisième section',
    section4Content: 'Contenu de la quatrième section',
    section5Content: 'Contenu de la cinquième section',
    section6Content: 'Contenu de la sixième section',
    
    // Title
    siteTitle: 'Studio OP - Grilles Parfaites',
  },
  en: {
    // Navigation
    home: 'Home',
    section2: 'Section 2',
    section3: 'Section 3',
    section4: 'Section 4',
    section5: 'Section 5',
    section6: 'Section 6',
    
    // InfoBanner
    basedIn: 'BASED IN MONTPELLIER',
    france: 'FRANCE',
    availableWorldwide: 'AVAILABLE',
    theWorld: 'WORLDWIDE',
    brandDesigner: 'BRAND DESIGNER +',
    marketingStrategy: 'MARKETING STRATEGY',
    
    // Sections
    myProjects: 'My Projects',
    section2Content: 'My Projects section content',
    section3Content: 'Third section content',
    section4Content: 'Fourth section content',
    section5Content: 'Fifth section content',
    section6Content: 'Sixth section content',
    
    // Title
    siteTitle: 'Studio OP - Perfect Grids',
  },
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Récupérer la langue depuis localStorage ou utiliser 'fr' par défaut
    const savedLanguage = localStorage.getItem('language')
    return savedLanguage || 'fr'
  })

  useEffect(() => {
    // Sauvegarder la langue dans localStorage
    localStorage.setItem('language', language)
    
    // Mettre à jour le titre de la page
    document.title = translations[language].siteTitle
    
    // Mettre à jour l'attribut lang de l'HTML
    document.documentElement.lang = language
  }, [language])

  const t = (key) => {
    return translations[language][key] || key
  }

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'fr' ? 'en' : 'fr'))
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
