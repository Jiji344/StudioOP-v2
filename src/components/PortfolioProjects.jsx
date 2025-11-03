import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import LogoBanner from './LogoBanner'
import './PortfolioProjects.css'

const PortfolioProjects = () => {
  const portfolioRef = useRef(null)
  const backgroundImageRef = useRef(null)
  const animationManagerRef = useRef(null)
  const timeDisplayRef = useRef(null)

  useEffect(() => {
    // Import du plugin GSAP ScrambleText (si disponible)
    // Si le plugin n'est pas disponible, on utilisera une alternative
    const CONFIG = {
      timeZone: "Europe/Paris",
      timeUpdateInterval: 1000
    }

    class AnimationManager {
      constructor() {
        this.projectItems = portfolioRef.current?.querySelectorAll(".project-item") || []
        this.portfolioContainer = portfolioRef.current?.querySelector(".portfolio-container")
        this.currentActiveIndex = -1
        this.originalTexts = new Map()
        this.debounceTimeout = null
        this.idleAnimation = null
        this.isIdle = true
        this.idleTimer = null
        
        this.projectItems.forEach((item) => {
          const textElements = item.querySelectorAll(".hover-text")
          const texts = Array.from(textElements).map((el) => el.textContent)
          this.originalTexts.set(item, texts)
        })
      }

      getBackgroundImage() {
        return backgroundImageRef.current
      }

      initializeAnimations() {
        if (!this.portfolioContainer) return
        this.preloadImages()
        this.projectItems.forEach((item, index) => {
          this.addEventListeners(item, index)
        })
        
        this.portfolioContainer.addEventListener("mouseleave", () => {
          if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout)
          }
          this.clearActiveStates()
          this.hideBackgroundImage()
          this.startIdleTimer()
        })
        this.startIdleTimer()
      }

      preloadImages() {
        this.projectItems.forEach((item) => {
          const imageUrl = item.dataset.image
          if (imageUrl) {
            const img = new Image()
            img.crossOrigin = "anonymous"
            img.src = imageUrl
          }
        })
      }

      addEventListeners(item, index) {
        const textElements = item.querySelectorAll(".hover-text")
        const imageUrl = item.dataset.image
        const originalTexts = this.originalTexts.get(item)
        
        const handleMouseEnter = () => {
          this.stopIdleAnimation()
          this.stopIdleTimer()
          this.isIdle = false
          if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout)
          }
          if (this.currentActiveIndex === index) return
          this.updateActiveStates(index)
          
          textElements.forEach((element, i) => {
            gsap.killTweensOf(element)
            // Animation simple de texte (remplacement de scrambleText si le plugin n'est pas disponible)
            element.textContent = originalTexts[i]
            gsap.fromTo(element, 
              { opacity: 0.3 },
              { 
                opacity: 1, 
                duration: 0.3,
                ease: "power2.out"
              }
            )
          })
          
          if (imageUrl) {
            this.showBackgroundImage(imageUrl)
          }
        }

        const handleMouseLeave = () => {
          this.debounceTimeout = setTimeout(() => {
            textElements.forEach((element, i) => {
              gsap.killTweensOf(element)
              element.textContent = originalTexts[i]
            })
          }, 50)
        }

        item.addEventListener("mouseenter", handleMouseEnter)
        item.addEventListener("mouseleave", handleMouseLeave)
      }

      updateActiveStates(activeIndex) {
        this.currentActiveIndex = activeIndex
        if (this.portfolioContainer) {
          this.portfolioContainer.classList.add("has-active")
        }
        this.projectItems.forEach((item, index) => {
          if (index === activeIndex) {
            item.classList.add("active")
          } else {
            item.classList.remove("active")
          }
        })
      }

      clearActiveStates() {
        this.currentActiveIndex = -1
        if (this.portfolioContainer) {
          this.portfolioContainer.classList.remove("has-active")
        }
        this.projectItems.forEach((item) => {
          item.classList.remove("active")
          const textElements = item.querySelectorAll(".hover-text")
          const originalTexts = this.originalTexts.get(item)
          textElements.forEach((element, i) => {
            gsap.killTweensOf(element)
            element.textContent = originalTexts[i]
          })
        })
        this.startIdleTimer()
      }

      showBackgroundImage(imageUrl) {
        const bgImage = this.getBackgroundImage()
        if (!bgImage) {
          console.warn('Background image element not found')
          return
        }
        bgImage.style.transition = "none"
        bgImage.style.transform = "translate(-50%, -50%) scale(1.2)"
        bgImage.style.backgroundImage = `url(${imageUrl})`
        bgImage.style.opacity = "1"
        bgImage.style.display = "block"
        
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            bgImage.style.transition =
              "opacity 0.6s ease, transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
            bgImage.style.transform =
              "translate(-50%, -50%) scale(1.0)"
          })
        })
      }

      hideBackgroundImage() {
        const bgImage = this.getBackgroundImage()
        if (bgImage) {
          bgImage.style.opacity = "0"
        }
      }

      startIdleTimer() {
        this.stopIdleTimer()
        this.idleTimer = setTimeout(() => {
          if (this.currentActiveIndex === -1) {
            this.isIdle = true
            this.startIdleAnimation()
          }
        }, 3000)
      }

      stopIdleTimer() {
        if (this.idleTimer) {
          clearTimeout(this.idleTimer)
          this.idleTimer = null
        }
      }

      startIdleAnimation() {
        if (this.idleAnimation) return
        
        this.idleAnimation = gsap.timeline({
          repeat: -1,
          repeatDelay: 2
        })
        
        const columnElements = {
          artists: [...this.projectItems].map((item) =>
            item.querySelector(".artist")
          ),
          albums: [...this.projectItems].map((item) =>
            item.querySelector(".album")
          ),
          categories: [...this.projectItems].map((item) =>
            item.querySelector(".category")
          ),
          labels: [...this.projectItems].map((item) =>
            item.querySelector(".label")
          ),
          years: [...this.projectItems].map((item) => item.querySelector(".year"))
        }
        
        const totalRows = this.projectItems.length
        const columnStartDelay = 0.25
        const rowDelay = 0.05
        const hideShowGap = totalRows * rowDelay * 0.5
        
        this.projectItems.forEach((item, rowIndex) => {
          const hideTime = 0 + rowIndex * rowDelay
          const showTime = 0 + hideShowGap + rowIndex * rowDelay
          this.idleAnimation.call(
            () => {
              item.classList.add("counter-hidden")
            },
            [],
            hideTime
          )
          this.idleAnimation.call(
            () => {
              item.classList.remove("counter-hidden")
            },
            [],
            showTime
          )
        })
        
        Object.keys(columnElements).forEach((columnName, columnIndex) => {
          const elements = columnElements[columnName]
          const columnStart = (columnIndex + 1) * columnStartDelay
          elements.forEach((element, rowIndex) => {
            const hideTime = columnStart + rowIndex * rowDelay
            this.idleAnimation.to(
              element,
              {
                duration: 0.1,
                opacity: 0.05,
                ease: "power2.inOut"
              },
              hideTime
            )
          })
          elements.forEach((element, rowIndex) => {
            const showTime = columnStart + hideShowGap + rowIndex * rowDelay
            this.idleAnimation.to(
              element,
              {
                duration: 0.1,
                opacity: 1,
                ease: "power2.inOut"
              },
              showTime
            )
          })
        })
      }

      stopIdleAnimation() {
        if (this.idleAnimation) {
          this.idleAnimation.kill()
          this.idleAnimation = null
          const allProjectData = document.querySelectorAll(".project-data")
          gsap.set([...allProjectData], {
            opacity: 1
          })
          this.projectItems.forEach((item) => {
            item.classList.remove("counter-hidden")
          })
        }
      }

      destroy() {
        this.stopIdleAnimation()
        this.stopIdleTimer()
        if (this.debounceTimeout) {
          clearTimeout(this.debounceTimeout)
        }
      }
    }

    class TimeDisplay {
      constructor(element) {
        this.element = element
      }

      start() {
        this.updateDisplay()
        this.interval = setInterval(() => this.updateDisplay(), CONFIG.timeUpdateInterval)
      }

      updateDisplay() {
        const { hours, minutes, dayPeriod } = this.getCurrentTime()
        const timeString = `${hours}<span class="time-blink">:</span>${minutes} ${dayPeriod}`
        if (this.element) {
          this.element.innerHTML = timeString
        }
      }

      getCurrentTime() {
        const now = new Date()
        const options = {
          timeZone: CONFIG.timeZone,
          hour12: true,
          hour: "numeric",
          minute: "numeric",
          second: "numeric"
        }
        const formatter = new Intl.DateTimeFormat("en-US", options)
        const parts = formatter.formatToParts(now)
        return {
          hours: parts.find((part) => part.type === "hour").value,
          minutes: parts.find((part) => part.type === "minute").value,
          dayPeriod: parts.find((part) => part.type === "dayPeriod").value
        }
      }

      destroy() {
        if (this.interval) {
          clearInterval(this.interval)
        }
      }
    }

    if (portfolioRef.current) {
      animationManagerRef.current = new AnimationManager()
      animationManagerRef.current.initializeAnimations()

      const timeElement = timeDisplayRef.current
      if (timeElement) {
        timeDisplayRef.current = new TimeDisplay(timeElement)
        timeDisplayRef.current.start()
      }
    }

    return () => {
      if (animationManagerRef.current) {
        animationManagerRef.current.destroy()
      }
      if (timeDisplayRef.current && timeDisplayRef.current.destroy) {
        timeDisplayRef.current.destroy()
      }
    }
  }, [])

  // Données des projets (vous pouvez les modifier selon vos besoins)
  const projects = [
    { artist: "PROJET 1", album: "Site Web", category: "WEB", label: "REACT", year: "2024", image: "https://assets.codepen.io/7558/portrait-fashion-001.jpg" },
    { artist: "PROJET 2", album: "Application", category: "APP", label: "MOBILE", year: "2024", image: "https://assets.codepen.io/7558/portrait-fashion-002.jpg" },
    { artist: "PROJET 3", album: "Branding", category: "DESIGN", label: "IDENTITY", year: "2023", image: "https://assets.codepen.io/7558/portrait-fashion-003.jpg" },
    { artist: "PROJET 4", album: "E-commerce", category: "WEB", label: "SHOPIFY", year: "2023", image: "https://assets.codepen.io/7558/portrait-fashion-004.jpg" },
    { artist: "PROJET 5", album: "Dashboard", category: "APP", label: "DATA", year: "2023", image: "https://assets.codepen.io/7558/portrait-fashion-005.jpg" },
    { artist: "PROJET 6", album: "Portfolio", category: "WEB", label: "CREATIVE", year: "2022", image: "https://assets.codepen.io/7558/portrait-fashion-006.jpg" },
    { artist: "PROJET 7", album: "Animation", category: "MOTION", label: "GSAP", year: "2022", image: "https://assets.codepen.io/7558/portrait-fashion-007.jpg" },
    { artist: "PROJET 8", album: "Interface", category: "UI/UX", label: "DESIGN", year: "2022", image: "https://assets.codepen.io/7558/portrait-fashion-008.jpg" },
    { artist: "PROJET 9", album: "Campaing", category: "MARKETING", label: "SOCIAL", year: "2021", image: "https://assets.codepen.io/7558/portrait-fashion-001.jpg" },
    { artist: "PROJET 10", album: "Platform", category: "WEB", label: "SaaS", year: "2021", image: "https://assets.codepen.io/7558/portrait-fashion-002.jpg" },
  ]

  return (
    <>
      <div ref={portfolioRef} className="portfolio-wrapper">
        <h2 className="portfolio-title">Mes Projets</h2>
        <main className="portfolio-container">
          <h1 className="sr-only">Portfolio Projets</h1>
          <ul className="project-list" role="list">
            {projects.map((project, index) => (
              <li 
                key={index} 
                className="project-item" 
                data-image={project.image}
              >
                <span className="project-data artist hover-text">{project.artist}</span>
                <span className="project-data album hover-text">{project.album}</span>
                <span className="project-data category hover-text">{project.category}</span>
                <span className="project-data label hover-text">{project.label}</span>
                <span className="project-data year hover-text">{project.year}</span>
              </li>
            ))}
          </ul>
        </main>

        <div className="background-image" ref={backgroundImageRef} role="img" aria-hidden="true"></div>

        <aside className="corner-elements">
          <div className="corner-item top-left">
            <div className="corner-square" aria-hidden="true"></div>
          </div>
          <nav className="corner-item top-right">
            <a href="#section1">Accueil</a> |
            <a href="#section2">Projets</a> |
            <a href="#section3">Contact</a>
          </nav>
          <div className="corner-item bottom-left">Studio OP</div>
          <time className="corner-item bottom-right" ref={timeDisplayRef}></time>
        </aside>
      </div>
      
      <div className="portfolio-banner-wrapper">
        <LogoBanner />
      </div>
    </>
  )
}

export default PortfolioProjects

