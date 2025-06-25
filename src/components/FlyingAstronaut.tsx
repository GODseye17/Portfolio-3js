// src/components/FlyingAstronaut.tsx
import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface FlyingAstronautProps {
  currentSection: number;
  isTransitioning: boolean;
}

const FlyingAstronaut: React.FC<FlyingAstronautProps> = ({ currentSection, isTransitioning }) => {
  const { camera } = useThree();
  const astronautRef = useRef<THREE.Group>(null);
  const jetpackRef = useRef<THREE.Group>(null);
  const trailRef = useRef<THREE.Points>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Jetpack particle trail
  const particleCount = 50;
  const positions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = 0;
    positions[i + 1] = 0;
    positions[i + 2] = 0;
    velocities[i] = (Math.random() - 0.5) * 0.1;
    velocities[i + 1] = (Math.random() - 0.5) * 0.1;
    velocities[i + 2] = -Math.random() * 0.3;
    
    // Blue-white flame colors
    const color = new THREE.Color().setHSL(0.6 + Math.random() * 0.1, 0.8, 0.7);
    colors[i] = color.r;
    colors[i + 1] = color.g;
    colors[i + 2] = color.b;
    
    sizes[i / 3] = Math.random() * 0.8 + 0.2;
  }

  // Track mouse for astronaut to follow
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!astronautRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Get camera direction
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    
    // Position astronaut relative to camera
    const offset = new THREE.Vector3(
      4 + Math.sin(time * 0.5) * 0.5 + mousePosition.x * 2,
      1 + Math.cos(time * 0.7) * 0.3 + mousePosition.y * 1,
      6
    );
    
    // Apply camera rotation to offset
    offset.applyQuaternion(camera.quaternion);
    
    // Target position
    const targetPosition = camera.position.clone().add(offset);
    
    // Smooth movement
    astronautRef.current.position.lerp(targetPosition, 0.08);
    
    // Look at camera with body tilt
    const lookAtPosition = camera.position.clone();
    astronautRef.current.lookAt(lookAtPosition);
    
    // Add floating animation
    astronautRef.current.position.y += Math.sin(time * 2) * 0.02;
    
    // Body rotations based on movement
    const velocity = new THREE.Vector3().subVectors(astronautRef.current.position, targetPosition);
    astronautRef.current.rotation.z = velocity.x * 0.3;
    astronautRef.current.rotation.x += Math.sin(time * 3) * 0.01;
    
    // Animate jetpack flames during transitions
    if (jetpackRef.current) {
      const flameScale = isTransitioning ? 1.5 : 0.8;
      jetpackRef.current.scale.setScalar(flameScale);
      
      // Jetpack glow
      const jetpackFlames = jetpackRef.current.children;
      jetpackFlames.forEach((flame, index) => {
        if (flame instanceof THREE.Mesh) {
          const material = flame.material as THREE.MeshBasicMaterial;
          material.opacity = isTransitioning 
            ? 0.9 + Math.sin(time * 10 + index) * 0.1
            : 0.6 + Math.sin(time * 5 + index) * 0.2;
        }
      });
    }
    
    // Update particle trail
    if (trailRef.current) {
      const positions = trailRef.current.geometry.attributes.position.array as Float32Array;
      const trailSizes = trailRef.current.geometry.attributes.size.array as Float32Array;
      
      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] += velocities[i];
        positions[i + 1] += velocities[i + 1];
        positions[i + 2] += velocities[i + 2];
        
        // Fade out particles
        const particleIndex = i / 3;
        trailSizes[particleIndex] *= 0.98;
        
        // Reset particles
        if (positions[i + 2] < -5 || trailSizes[particleIndex] < 0.01) {
          positions[i] = astronautRef.current.position.x + (Math.random() - 0.5) * 0.2;
          positions[i + 1] = astronautRef.current.position.y - 0.5;
          positions[i + 2] = astronautRef.current.position.z - 0.3;
          trailSizes[particleIndex] = Math.random() * 0.8 + 0.2;
        }
      }
      
      trailRef.current.geometry.attributes.position.needsUpdate = true;
      trailRef.current.geometry.attributes.size.needsUpdate = true;
    }
  });

  // Reaction animations based on section
  useEffect(() => {
    if (astronautRef.current && isTransitioning) {
      // Excited spin during transitions
      gsap.to(astronautRef.current.rotation, {
        y: astronautRef.current.rotation.y + Math.PI * 4,
        duration: 1.5,
        ease: "power2.inOut"
      });
      
      // Boost effect
      gsap.to(astronautRef.current.scale, {
        x: 1.2,
        y: 1.2,
        z: 1.2,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: "elastic.out(1, 0.5)"
      });
    }
  }, [isTransitioning, currentSection]);

  return (
    <group ref={astronautRef}>
      {/* Astronaut Body */}
      <mesh castShadow>
        <capsuleGeometry args={[0.3, 0.6, 4, 8]} />
        <meshStandardMaterial 
          color="#f0f0f0" 
          metalness={0.2} 
          roughness={0.8}
          emissive="#ffffff"
          emissiveIntensity={0.05}
        />
      </mesh>
      
      {/* Helmet */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.9} 
          metalness={0.9} 
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0}
          transmission={0.5}
          thickness={0.2}
        />
      </mesh>
      
      {/* Helmet Visor with reflection */}
      <mesh position={[0, 0.4, 0.08]}>
        <sphereGeometry args={[0.23, 32, 32]} />
        <meshPhysicalMaterial 
          color="#001a33" 
          transparent 
          opacity={0.8} 
          metalness={1} 
          roughness={0}
          envMapIntensity={2}
        />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.3, 0.1, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
        <capsuleGeometry args={[0.08, 0.3, 4, 8]} />
        <meshStandardMaterial color="#f0f0f0" metalness={0.2} roughness={0.8} />
      </mesh>
      <mesh position={[0.3, 0.1, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
        <capsuleGeometry args={[0.08, 0.3, 4, 8]} />
        <meshStandardMaterial color="#f0f0f0" metalness={0.2} roughness={0.8} />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.1, -0.5, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.35, 4, 8]} />
        <meshStandardMaterial color="#f0f0f0" metalness={0.2} roughness={0.8} />
      </mesh>
      <mesh position={[0.1, -0.5, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.35, 4, 8]} />
        <meshStandardMaterial color="#f0f0f0" metalness={0.2} roughness={0.8} />
      </mesh>
      
      {/* Jetpack */}
      <group ref={jetpackRef} position={[0, 0, -0.25]}>
        <mesh castShadow>
          <boxGeometry args={[0.25, 0.35, 0.12]} />
          <meshStandardMaterial 
            color="#333333" 
            metalness={0.8} 
            roughness={0.2}
            emissive="#000033"
            emissiveIntensity={0.2}
          />
        </mesh>
        
        {/* Jetpack thrusters */}
        <mesh position={[-0.08, -0.25, -0.06]}>
          <cylinderGeometry args={[0.04, 0.04, 0.15, 8]} />
          <meshStandardMaterial color="#666666" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0.08, -0.25, -0.06]}>
          <cylinderGeometry args={[0.04, 0.04, 0.15, 8]} />
          <meshStandardMaterial color="#666666" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Dynamic jetpack flames */}
        <mesh position={[-0.08, -0.4, -0.06]}>
          <coneGeometry args={[0.06, 0.25, 8]} />
          <meshBasicMaterial color="#4facfe" transparent opacity={0.8} />
        </mesh>
        <mesh position={[0.08, -0.4, -0.06]}>
          <coneGeometry args={[0.06, 0.25, 8]} />
          <meshBasicMaterial color="#4facfe" transparent opacity={0.8} />
        </mesh>
        
        {/* Inner flame cores */}
        <mesh position={[-0.08, -0.4, -0.06]} scale={[0.7, 1.3, 0.7]}>
          <coneGeometry args={[0.06, 0.25, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
        </mesh>
        <mesh position={[0.08, -0.4, -0.06]} scale={[0.7, 1.3, 0.7]}>
          <coneGeometry args={[0.06, 0.25, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
        </mesh>
      </group>
      
      {/* Particle Trail */}
      <points ref={trailRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={particleCount}
            array={sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.5}
          transparent
          opacity={0.8}
          sizeAttenuation
          vertexColors
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      
      {/* Soft glow around astronaut */}
      <mesh>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial 
          color="#4facfe" 
          transparent 
          opacity={0.08} 
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Antenna with blinking light */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.12, 8]} />
        <meshStandardMaterial color="#ff6b6b" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#ff6b6b">
          <primitive attach="opacity" value={0.5 + Math.sin(Date.now() * 0.005) * 0.5} />
        </meshBasicMaterial>
      </mesh>
      
      {/* Navigation lights */}
      <mesh position={[-0.2, 0.2, 0.2]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>
      <mesh position={[0.2, 0.2, 0.2]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
    </group>
  );
};

export default FlyingAstronaut;