import React from 'react'
import GridOverlay from './GridOverlay'

const Section = ({ id, title, content, index }) => {
  return (
    <section className="section" id={id}>
      <GridOverlay />
      <div className="section-content">
        <h2>{title}</h2>
        <p>{content}</p>
      </div>
    </section>
  )
}

export default Section

