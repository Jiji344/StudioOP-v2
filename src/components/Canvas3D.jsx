import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import Studio3D from './Studio3D'

const Canvas3D = ({ fov }) => {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: fov }}>
      <Suspense fallback={null}>
        <Studio3D />
      </Suspense>
    </Canvas>
  )
}

export default Canvas3D

