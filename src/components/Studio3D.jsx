import React, { Suspense, useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function Model() {
  const { scene } = useGLTF('/3D/Studio.glb')
  const modelRef = useRef()
  const mousePosition = useRef({ x: 0, y: 0 })
  const [scale, setScale] = useState([2, 2, 2])
  const [position, setPosition] = useState([0, -2.5, 0])

  // Calculer l'échelle responsive
  useEffect(() => {
    const updateScale = () => {
      if (window.innerWidth <= 480) {
        setScale([1.6, 1.6, 1.6])
        setPosition([0, -1.8, 0])
      } else if (window.innerWidth <= 768) {
        setScale([1.8, 1.8, 1.8])
        setPosition([0, -2, 0])
      } else {
        setScale([2, 2, 2])
        setPosition([0, -2.5, 0])
      }
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  // Écouter les mouvements de la souris
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normaliser les coordonnées de la souris (-1 à 1)
      mousePosition.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Faire tourner le modèle pour qu'il regarde le curseur
  useFrame(() => {
    if (modelRef.current) {
      const { x, y } = mousePosition.current
      
      // Calculer l'angle de rotation horizontal (Y)
      const targetRotationY = Math.atan2(x, 1) * 0.5
      
      // Calculer l'angle de rotation vertical (X) avec limitation
      const targetRotationX = Math.atan2(y, 1) * 0.3
      
      // Lisser la rotation avec interpolation
      modelRef.current.rotation.y += (targetRotationY - modelRef.current.rotation.y) * 0.1
      modelRef.current.rotation.x += (targetRotationX - modelRef.current.rotation.x) * 0.1
      
      // Appliquer l'échelle responsive
      if (modelRef.current.scale.x !== scale[0]) {
        modelRef.current.scale.set(scale[0], scale[1], scale[2])
        modelRef.current.position.set(position[0], position[1], position[2])
      }
    }
  })

  // Centrer et positionner le modèle plus bas sur la page
  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      position={position}
      scale={scale}
    />
  )
}

// Fonction pour convertir HSL en couleur Three.js
function hslToColor(h, s, l) {
  return new THREE.Color().setHSL(h / 360, s / 100, l / 100)
}

// Palette de couleurs marron/terre cuite/rouge/orange
function getTerracottaColor(time, index) {
  // Palette de tons: marron, terre cuite, rouge, orange
  // Variation autour de 0-30° (rouge-orange) et 15-45° (orange-terre cuite) et 0-20° avec saturation réduite (marron)
  const baseHue = 15 // Orange/terre cuite
  const hueVariation = 25 // Variation autour de l'orange/rouge
  const hue = ((time * 20 + index * 8) % (hueVariation * 2)) - hueVariation + baseHue
  
  // Saturations et luminosités pour créer les différents tons
  let saturation, lightness
  const variation = (time * 0.3 + index * 0.5) % 1
  
  if (variation < 0.25) {
    // Marron foncé
    saturation = 40 + variation * 20 // 40-60%
    lightness = 25 + variation * 10 // 25-35%
  } else if (variation < 0.5) {
    // Terre cuite
    saturation = 60 + variation * 20 // 60-75%
    lightness = 40 + variation * 10 // 40-50%
  } else if (variation < 0.75) {
    // Rouge
    saturation = 70 + variation * 15 // 70-85%
    lightness = 45 + variation * 10 // 45-55%
  } else {
    // Orange
    saturation = 80 + variation * 15 // 80-95%
    lightness = 50 + variation * 10 // 50-60%
  }
  
  // S'assurer que le hue reste dans la plage 0-360
  const finalHue = ((hue % 360) + 360) % 360
  return hslToColor(finalHue, saturation, lightness)
}

function RotatingLight({ index, colorIndex }) {
  const lightRef = useRef()

  useFrame((state) => {
    if (lightRef.current) {
      const time = state.clock.elapsedTime
      const radius = 4 // Distance des lumières de l'objet
      const speed = 0.5 // Vitesse de rotation
      const offset = (index % 2) * 0.5 // Décalage entre les 2 lumières de même couleur
      const angle = (time * speed) + (colorIndex * (Math.PI * 2) / 5) + offset
      
      // Position
      lightRef.current.position.x = Math.cos(angle) * radius
      lightRef.current.position.z = Math.sin(angle) * radius
      lightRef.current.position.y = Math.sin(time * 0.3 + index) * 0.8 // Légère variation en Y
      
      // Couleur marron/terre cuite/rouge/orange
      const color = getTerracottaColor(time, index)
      lightRef.current.color.copy(color)
    }
  })

  // Couleur initiale dans la palette terracotta
  const initialColor = getTerracottaColor(0, index)

  return (
    <pointLight
      ref={lightRef}
      color={initialColor}
      intensity={2}
      distance={12}
      decay={2}
      position={[
        Math.cos((colorIndex * Math.PI * 2) / 5 + (index % 2) * 0.5) * 4,
        0,
        Math.sin((colorIndex * Math.PI * 2) / 5 + (index % 2) * 0.5) * 4
      ]}
    />
  )
}

function RotatingLights() {
  return (
    <group>
      {/* Double chaque lumière - 10 lumières au total */}
      {Array.from({ length: 10 }).map((_, index) => {
        const colorIndex = Math.floor(index / 2)
        return (
          <RotatingLight
            key={index}
            index={index}
            colorIndex={colorIndex}
          />
        )
      })}
    </group>
  )
}

function StaticLight() {
  const lightRef = useRef()
  
  useFrame((state) => {
    if (lightRef.current) {
      // Couleur marron/terre cuite/rouge/orange qui change avec le temps
      const time = state.clock.elapsedTime
      const color = getTerracottaColor(time, 15) // Index fixe pour la lumière statique
      lightRef.current.color.copy(color)
    }
  })

  // Couleur initiale dans la palette terracotta
  const initialColor = getTerracottaColor(0, 15)

  return (
    <pointLight
      ref={lightRef}
      position={[0, 0, 8]}
      color={initialColor}
      intensity={5}
      distance={20}
      decay={1}
    />
  )
}

function RedLights() {
  const lightsGroupRef = useRef()

  useFrame((state) => {
    if (lightsGroupRef.current) {
      const time = state.clock.elapsedTime
      const radius = 5 // Distance des lumières rouges de l'objet
      const speed = 0.3 // Vitesse de rotation plus lente

      lightsGroupRef.current.children.forEach((light, index) => {
        const angle = (time * speed) + (index * (Math.PI * 2) / 5) // 5 lumières rouges
        light.position.x = Math.cos(angle) * radius
        light.position.z = Math.sin(angle) * radius
        light.position.y = Math.sin(time * 0.4 + index) * 1.2 // Variation en Y plus prononcée
      })
    }
  })

  return (
    <group ref={lightsGroupRef}>
      {/* 5 lumières rouges qui tournent autour de l'objet */}
      {Array.from({ length: 5 }).map((_, index) => (
        <pointLight
          key={`red-${index}`}
          color="#ff0000"
          intensity={3}
          distance={15}
          decay={2}
          position={[
            Math.cos((index * Math.PI * 2) / 5) * 5,
            0,
            Math.sin((index * Math.PI * 2) / 5) * 5
          ]}
        />
      ))}
    </group>
  )
}

function Studio3D() {
  return (
    <Suspense fallback={null}>
      {/* Très grosse lumière marron/terre cuite immobile face à l'objet */}
      <StaticLight />
      
      {/* Lumières marron/terre cuite/rouge/orange qui tournent autour de l'objet */}
      <RotatingLights />
      
      {/* Lumières rouges supplémentaires */}
      <RedLights />
      
      <Model />
    </Suspense>
  )
}

// Précharger le modèle seulement côté client pour éviter les erreurs SSR
if (typeof window !== 'undefined') {
  useGLTF.preload('/3D/Studio.glb')
}

export default Studio3D
