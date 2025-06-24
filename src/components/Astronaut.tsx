import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion-3d';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface AstronautProps {
  position: { x: number; y: number };
  isTransitioning: boolean;
  targetSection: number;
}

const Astronaut: React.FC<AstronautProps> = ({ position, isTransitioning, targetSection }) => {
  const astronautRef = useRef<THREE.Group>(null);
  const jetpackRef = useRef<THREE.Group>(null);
  const trailRef = useRef<THREE.Points>(null);
  
  // Create particle trail
  const particleCount = 50;
  const positions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = 0;
    positions[i + 1] = 0;
    positions[i + 2] = 0;
    velocities[i] = (Math.random() - 0.5) * 0.1;
    velocities[i + 1] = (Math.random() - 0.5) * 0.1;
    velocities[i + 2] = -Math.random() * 0.2;
  }

  useFrame((state) => {
    if (astronautRef.current) {
      // Floating animation
      astronautRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.01;
      astronautRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
      
      // Smooth movement to target position
      astronautRef.current.position.x += (position.x * 0.1 - astronautRef.current.position.x) * 0.05;
      astronautRef.current.position.y += (position.y * 0.1 - astronautRef.current.position.y) * 0.05;
    }

    // Update particle trail
    if (trailRef.current && isTransitioning) {
      const positions = trailRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] += velocities[i];
        positions[i + 1] += velocities[i + 1];
        positions[i + 2] += velocities[i + 2];
        
        // Reset particles that go too far
        if (positions[i + 2] < -5) {
          positions[i] = astronautRef.current?.position.x || 0;
          positions[i + 1] = astronautRef.current?.position.y || 0;
          positions[i + 2] = astronautRef.current?.position.z || 0;
        }
      }
      
      trailRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  useEffect(() => {
    if (isTransitioning && astronautRef.current) {
      // Jetpack boost animation
      gsap.to(astronautRef.current.scale, {
        x: 1.2,
        y: 1.2,
        z: 1.2,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
      
      // Rotation during travel
      gsap.to(astronautRef.current.rotation, {
        y: astronautRef.current.rotation.y + Math.PI * 2,
        duration: 1.5,
        ease: "power2.inOut"
      });
    }
  }, [isTransitioning, targetSection]);

  return (
    <group ref={astronautRef} position={[0, 0, 5]}>
      {/* Astronaut Body */}
      <mesh>
        <capsuleGeometry args={[0.8, 1.6, 4, 8]} />
        <meshStandardMaterial color="#f0f0f0" metalness={0.3} roughness={0.7} />
      </mesh>
      
      {/* Helmet */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.8} 
          metalness={0.9} 
          roughness={0.1} 
        />
      </mesh>
      
      {/* Helmet Visor */}
      <mesh position={[0, 1.2, 0.3]}>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshStandardMaterial 
          color="#001122" 
          transparent 
          opacity={0.7} 
          metalness={1} 
          roughness={0} 
        />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.8, 0.3, 0]} rotation={[0, 0, Math.PI / 6]}>
        <capsuleGeometry args={[0.2, 1, 4, 8]} />
        <meshStandardMaterial color="#f0f0f0" metalness={0.3} roughness={0.7} />
      </mesh>
      <mesh position={[0.8, 0.3, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <capsuleGeometry args={[0.2, 1, 4, 8]} />
        <meshStandardMaterial color="#f0f0f0" metalness={0.3} roughness={0.7} />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.3, -1.5, 0]}>
        <capsuleGeometry args={[0.25, 1.2, 4, 8]} />
        <meshStandardMaterial color="#f0f0f0" metalness={0.3} roughness={0.7} />
      </mesh>
      <mesh position={[0.3, -1.5, 0]}>
        <capsuleGeometry args={[0.25, 1.2, 4, 8]} />
        <meshStandardMaterial color="#f0f0f0" metalness={0.3} roughness={0.7} />
      </mesh>
      
      {/* Jetpack */}
      <group ref={jetpackRef} position={[0, 0, -0.8]}>
        <mesh>
          <boxGeometry args={[0.8, 1.2, 0.4]} />
          <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Jetpack Flames (visible during transition) */}
        {isTransitioning && (
          <>
            <mesh position={[0, -0.8, -0.3]}>
              <coneGeometry args={[0.2, 0.8, 8]} />
              <meshBasicMaterial color="#ff4444" transparent opacity={0.8} />
            </mesh>
            <mesh position={[0, -0.8, -0.3]} scale={[0.7, 1.2, 0.7]}>
              <coneGeometry args={[0.2, 0.8, 8]} />
              <meshBasicMaterial color="#ffaa00" transparent opacity={0.6} />
            </mesh>
            <mesh position={[0, -0.8, -0.3]} scale={[0.4, 1.5, 0.4]}>
              <coneGeometry args={[0.2, 0.8, 8]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
            </mesh>
          </>
        )}
      </group>
      
      {/* Particle Trail */}
      {isTransitioning && (
        <points ref={trailRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particleCount}
              array={positions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.1}
            color="#4facfe"
            transparent
            opacity={0.6}
            sizeAttenuation
          />
        </points>
      )}
      
      {/* Ambient glow */}
      <mesh>
        <sphereGeometry args={[2, 16, 16]} />
        <meshBasicMaterial 
          color="#4facfe" 
          transparent 
          opacity={0.1} 
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

export default Astronaut;