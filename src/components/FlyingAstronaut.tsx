import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface FlyingAstronautProps {
  currentSection: number;
  isTransitioning: boolean;
}

const FlyingAstronaut: React.FC<FlyingAstronautProps> = ({ currentSection, isTransitioning }) => {
  const astronautRef = useRef<THREE.Group>(null);
  const jetpackRef = useRef<THREE.Group>(null);
  const trailRef = useRef<THREE.Points>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0, z: 5 });
  const [hasAppeared, setHasAppeared] = useState(false);
  
  // Create particle trail for jetpack - smaller count
  const particleCount = 20;
  const positions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = 0;
    positions[i + 1] = 0;
    positions[i + 2] = 0;
    velocities[i] = (Math.random() - 0.5) * 0.02;
    velocities[i + 1] = (Math.random() - 0.5) * 0.02;
    velocities[i + 2] = -Math.random() * 0.05;
    
    // Blue-white trail colors
    const color = new THREE.Color().setHSL(0.6 + Math.random() * 0.1, 0.8, 0.7);
    colors[i] = color.r;
    colors[i + 1] = color.g;
    colors[i + 2] = color.b;
  }

  // Initial appearance animation on page load
  useEffect(() => {
    if (astronautRef.current && !hasAppeared) {
      // Start from off-screen left
      astronautRef.current.position.set(-15, 3, 8);
      astronautRef.current.scale.set(0.1, 0.1, 0.1);
      astronautRef.current.rotation.set(0, 0, -Math.PI / 4);
      
      // Dramatic entrance animation after page loads
      setTimeout(() => {
        if (astronautRef.current) {
          // Fly in from left with spinning
          gsap.to(astronautRef.current.position, {
            x: 0,
            y: 0,
            z: 5,
            duration: 3,
            ease: "power2.out"
          });
          
          // Scale up with bounce
          gsap.to(astronautRef.current.scale, {
            x: 0.6,
            y: 0.6,
            z: 0.6,
            duration: 2.5,
            ease: "back.out(1.7)",
            delay: 0.5
          });
          
          // Spinning entrance
          gsap.to(astronautRef.current.rotation, {
            y: Math.PI * 6,
            z: 0,
            duration: 3,
            ease: "power2.out"
          });
          
          setHasAppeared(true);
        }
      }, 2000); // Wait 2 seconds after page load
    }
  }, [hasAppeared]);

  // Track mouse position for astronaut to follow
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      });
    };

    const handleScroll = () => {
      const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      
      // Create paths for astronaut to follow through all sections
      const sectionPositions = [
        { x: 0, y: 0, z: 5 },         // Hero - center, welcoming
        { x: -3, y: 2, z: 4 },        // About - left side  
        { x: 3.5, y: -1, z: 5 },      // Experience - right side
        { x: -2.5, y: 2.5, z: 4.5 }, // Skills - left side
        { x: 3, y: -2, z: 5.5 },      // Projects - right side
        { x: 0, y: 1, z: 6 }          // Contact - center, farewell
      ];
      
      const currentPos = sectionPositions[currentSection] || sectionPositions[0];
      
      // Add scroll-based orbital movement
      const scrollOffset = scrollProgress * 0.3;
      const orbitRadius = 0.4;
      const orbitSpeed = scrollProgress * Math.PI * 3;
      
      setTargetPosition({
        x: currentPos.x + Math.sin(orbitSpeed) * orbitRadius,
        y: currentPos.y + Math.cos(orbitSpeed) * orbitRadius * 0.6,
        z: currentPos.z + scrollOffset
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentSection]);

  useFrame((state) => {
    if (astronautRef.current && hasAppeared) {
      const time = state.clock.elapsedTime;
      
      // Smooth movement towards target position with mouse influence
      const mouseInfluence = 0.1;
      const targetX = targetPosition.x + mousePosition.x * mouseInfluence;
      const targetY = targetPosition.y + mousePosition.y * mouseInfluence;
      const targetZ = targetPosition.z;
      
      // Smooth interpolation
      astronautRef.current.position.x += (targetX - astronautRef.current.position.x) * 0.05;
      astronautRef.current.position.y += (targetY - astronautRef.current.position.y) * 0.05;
      astronautRef.current.position.z += (targetZ - astronautRef.current.position.z) * 0.05;
      
      // Floating animation
      astronautRef.current.position.y += Math.sin(time * 2) * 0.005;
      astronautRef.current.position.x += Math.cos(time * 1.5) * 0.003;
      
      // Gentle rotation based on movement
      const rotationX = (targetY - astronautRef.current.position.y) * 0.3;
      const rotationZ = -(targetX - astronautRef.current.position.x) * 0.2;
      
      astronautRef.current.rotation.x += (rotationX - astronautRef.current.rotation.x) * 0.1;
      astronautRef.current.rotation.z += (rotationZ - astronautRef.current.rotation.z) * 0.1;
      astronautRef.current.rotation.y += Math.sin(time * 0.5) * 0.002;
      
      // Scale breathing effect
      const breathingScale = 0.6 + Math.sin(time * 3) * 0.02;
      astronautRef.current.scale.setScalar(breathingScale);
    }

    // Animate jetpack particles
    if (trailRef.current && hasAppeared) {
      const positions = trailRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] += velocities[i];
        positions[i + 1] += velocities[i + 1];
        positions[i + 2] += velocities[i + 2];
        
        // Reset particles that go too far
        if (positions[i + 2] < -2) {
          positions[i] = astronautRef.current?.position.x || 0;
          positions[i + 1] = (astronautRef.current?.position.y || 0) - 0.4;
          positions[i + 2] = (astronautRef.current?.position.z || 0) - 0.2;
        }
      }
      
      trailRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  // Animate during section transitions
  useEffect(() => {
    if (isTransitioning && astronautRef.current && hasAppeared) {
      // Excited spinning during transitions
      gsap.to(astronautRef.current.rotation, {
        y: astronautRef.current.rotation.y + Math.PI * 2,
        duration: 1.5,
        ease: "power2.inOut"
      });
      
      // Boost effect
      gsap.to(astronautRef.current.scale, {
        x: 0.75,
        y: 0.75,
        z: 0.75,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    }
  }, [isTransitioning, currentSection, hasAppeared]);

  return (
    <group ref={astronautRef} position={[-15, 3, 8]} scale={[0.1, 0.1, 0.1]}>
      {/* Astronaut Body */}
      <mesh>
        <capsuleGeometry args={[0.25, 0.5, 4, 8]} />
        <meshStandardMaterial color="#f0f0f0" metalness={0.1} roughness={0.8} />
      </mesh>
      
      {/* Helmet */}
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.9} 
          metalness={0.8} 
          roughness={0.1} 
        />
      </mesh>
      
      {/* Helmet Visor */}
      <mesh position={[0, 0.35, 0.1]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial 
          color="#001122" 
          transparent 
          opacity={0.8} 
          metalness={1} 
          roughness={0} 
        />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.25, 0.1, 0]} rotation={[0, 0, Math.PI / 8]}>
        <capsuleGeometry args={[0.08, 0.3, 4, 8]} />
        <meshStandardMaterial color="#f0f0f0" metalness={0.1} roughness={0.8} />
      </mesh>
      <mesh position={[0.25, 0.1, 0]} rotation={[0, 0, -Math.PI / 8]}>
        <capsuleGeometry args={[0.08, 0.3, 4, 8]} />
        <meshStandardMaterial color="#f0f0f0" metalness={0.1} roughness={0.8} />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.1, -0.4, 0]}>
        <capsuleGeometry args={[0.08, 0.35, 4, 8]} />
        <meshStandardMaterial color="#f0f0f0" metalness={0.1} roughness={0.8} />
      </mesh>
      <mesh position={[0.1, -0.4, 0]}>
        <capsuleGeometry args={[0.08, 0.35, 4, 8]} />
        <meshStandardMaterial color="#f0f0f0" metalness={0.1} roughness={0.8} />
      </mesh>
      
      {/* Jetpack */}
      <group ref={jetpackRef} position={[0, 0, -0.25]}>
        <mesh>
          <boxGeometry args={[0.25, 0.35, 0.12]} />
          <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.3} />
        </mesh>
        
        {/* Jetpack thrusters */}
        <mesh position={[-0.06, -0.25, -0.06]}>
          <cylinderGeometry args={[0.03, 0.03, 0.12, 8]} />
          <meshStandardMaterial color="#666666" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.06, -0.25, -0.06]}>
          <cylinderGeometry args={[0.03, 0.03, 0.12, 8]} />
          <meshStandardMaterial color="#666666" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Jetpack flames */}
        <mesh position={[-0.06, -0.35, -0.06]}>
          <coneGeometry args={[0.05, 0.18, 8]} />
          <meshBasicMaterial color="#4facfe" transparent opacity={0.7} />
        </mesh>
        <mesh position={[0.06, -0.35, -0.06]}>
          <coneGeometry args={[0.05, 0.18, 8]} />
          <meshBasicMaterial color="#4facfe" transparent opacity={0.7} />
        </mesh>
        
        {/* Inner flame cores */}
        <mesh position={[-0.06, -0.35, -0.06]} scale={[0.6, 1.2, 0.6]}>
          <coneGeometry args={[0.05, 0.18, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
        </mesh>
        <mesh position={[0.06, -0.35, -0.06]} scale={[0.6, 1.2, 0.6]}>
          <coneGeometry args={[0.05, 0.18, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
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
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          transparent
          opacity={0.6}
          sizeAttenuation
          vertexColors
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      
      {/* Ambient glow around astronaut */}
      <mesh>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial 
          color="#4facfe" 
          transparent 
          opacity={0.05} 
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Cute antenna on helmet */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.12, 8]} />
        <meshStandardMaterial color="#ff6b6b" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color="#ff6b6b" />
      </mesh>
      
      {/* Navigation lights */}
      <mesh position={[-0.18, 0.15, 0.18]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>
      <mesh position={[0.18, 0.15, 0.18]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
    </group>
  );
};

export default FlyingAstronaut;