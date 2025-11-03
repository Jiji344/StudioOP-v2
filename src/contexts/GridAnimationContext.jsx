import React, { createContext, useContext, useState } from 'react'

const GridAnimationContext = createContext()

export const GridAnimationProvider = ({ children }) => {
  const [shouldAnimate, setShouldAnimate] = useState(false)

  const triggerAnimation = () => {
    setShouldAnimate(true)
  }

  return (
    <GridAnimationContext.Provider value={{ shouldAnimate, triggerAnimation }}>
      {children}
    </GridAnimationContext.Provider>
  )
}

export const useGridAnimation = () => {
  const context = useContext(GridAnimationContext)
  if (!context) {
    throw new Error('useGridAnimation must be used within GridAnimationProvider')
  }
  return context
}





