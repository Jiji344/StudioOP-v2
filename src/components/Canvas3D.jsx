import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import Studio3D from './Studio3D'

const Canvas3D = ({ fov, onModelLoaded }) => {
  return (
    <Canvas 
      camera={{ position: [0, 0, 5], fov: fov }}
      gl={{ preserveDrawingBuffer: false }}
      style={{ pointerEvents: 'none' }}
    >
      <Suspense fallback={null}>
        <Studio3D onModelLoaded={onModelLoaded} />
      </Suspense>
    </Canvas>
  )
}

export default Canvas3D


