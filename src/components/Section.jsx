import React from 'react'
import LogoBanner from './LogoBanner'
import PortfolioProjects from './PortfolioProjects'

const Section = ({ id, title, content, index }) => {
  return (
    <section className={`section ${id === 'section2' ? 'portfolio-section' : ''}`} id={id}>
      {id === 'section2' ? (
        <PortfolioProjects />
      ) : (
        <>
          <div className="section-content">
            <h2>{title}</h2>
            <p>{content}</p>
          </div>
        </>
      )}
    </section>
  )
}

export default Section

