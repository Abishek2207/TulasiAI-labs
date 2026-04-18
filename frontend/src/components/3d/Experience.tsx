'use client'

import { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, Environment, Float, Preload, Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Advanced Neural Brain AI Sphere Component
const NeuralSphere = () => {
  const outerMeshRef = useRef<THREE.Mesh>(null)
  const innerMeshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (outerMeshRef.current && innerMeshRef.current) {
      outerMeshRef.current.rotation.y = state.clock.elapsedTime * 0.2
      outerMeshRef.current.rotation.x = state.clock.elapsedTime * 0.1
      innerMeshRef.current.rotation.y = -state.clock.elapsedTime * 0.3
      innerMeshRef.current.rotation.z = state.clock.elapsedTime * 0.15
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={outerMeshRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[3, 2]} />
        <meshStandardMaterial 
          color="#8b5cf6"
          wireframe
          transparent
          opacity={0.3}
          emissive="#8b5cf6"
          emissiveIntensity={1}
        />
      </mesh>
      <mesh ref={innerMeshRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[2.5, 3]} />
        <meshStandardMaterial 
          color="#3b82f6"
          wireframe
          transparent
          opacity={0.6}
          emissive="#3b82f6"
          emissiveIntensity={1.5}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </Float>
  )
}

// Intense Background Neural Particles
const NeuralParticles = () => {
  const pointsRef = useRef<THREE.Points>(null)
  
  const particleCount = 1000
  const positions = new Float32Array(particleCount * 3)
  for(let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 60
  }

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#a855f7" size={0.1} sizeAttenuation={true} depthWrite={false} />
    </Points>
  )
}

const ContentEngine = () => {
  const { camera, size } = useThree()
  
  useFrame((state) => {
    const targetX = (state.pointer.x * 3)
    const targetY = (state.pointer.y * 3)
    camera.position.x += (targetX - camera.position.x) * 0.05
    camera.position.y += (targetY - camera.position.y) * 0.05
    camera.lookAt(0, 0, 0)
  })

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
      <ambientLight intensity={1} />
      <directionalLight position={[10, 10, 5]} intensity={2.5} color="#3b82f6" />
      <directionalLight position={[-10, -10, -5]} intensity={2} color="#a855f7" />
      <pointLight position={[0, 0, 0]} intensity={2} color="#6366f1" />
      
      <NeuralSphere />
      <NeuralParticles />
    </>
  )
}

// Ensure the container spans exactly the window using absolute styling
export default function Experience() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-0 pointer-events-none opacity-80" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}>
      <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <ContentEngine />
        <Preload all />
      </Canvas>
    </div>
  )
}
