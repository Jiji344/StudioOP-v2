import React from 'react'
import LogoBanner from './LogoBanner'

const Section = ({ id, title, content, index }) => {
  return (
    <section className="section" id={id}>
      <div className="section-content">
        <h2>{title}</h2>
        <p>{content}</p>
      </div>
      {id === 'section2' && <LogoBanner />}
    </section>
  )
}

export default Section

