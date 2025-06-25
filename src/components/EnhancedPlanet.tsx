// src/components/EnhancedPlanets.tsx
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface EnhancedPlanetsProps {
  currentSection: number;
  isTransitioning: boolean;
}

const EnhancedPlanets: React.FC<EnhancedPlanetsProps> = ({ currentSection, isTransitioning }) => {
  const planetsRef = useRef<THREE.Group>(null);
  const planetRefs = useRef<(THREE.Group | null)[]>([]);

  // Planet configurations with enhanced visuals
  const planets = [
    { 
      // Hero - Central blue planet
      color: '#4169E1',
      emissive: '#1e3a8a',
      position: [0, 0, 0],
      size: 3,
      rotationSpeed: 0.008,
      orbitRadius: 0,
      hasRings: false,
      hasClouds: true,
      name: "Terra Prime"
    },
    { 
      // About - Blue Earth
      color: '#4facfe',
      emissive: '#2563eb',
      position: [30, 15, -20],
      size: 2.5,
      rotationSpeed: 0.01,
      orbitRadius: 3,
      hasRings: false,
      hasClouds: true,
      name: "Earth"
    },
    { 
      // Experience - Red Mars
      color: '#CD5C5C',
      emissive: '#7f1d1d',
      position: [-25, -10, -30],
      size: 2.2,
      rotationSpeed: 0.009,
      orbitRadius: 2.5,
      hasRings: false,
      hasClouds: false,
      name: "Mars"
    },
    { 
      // Skills - Green forest planet
      color: '#228B22',
      emissive: '#14532d',
      position: [35, -20, -40],
      size: 2.8,
      rotationSpeed: 0.007,
      orbitRadius: 4,
      hasRings: false,
      hasClouds: true,
      name: "Verdant"
    },
    { 
      // Projects - Yellow Saturn
      color: '#FFD700',
      emissive: '#a16207',
      position: [-30, 25, -50],
      size: 2.5,
      rotationSpeed: 0.006,
      orbitRadius: 3.5,
      hasRings: true,
      hasClouds: false,
      name: "Saturn"
    },
    { 
      // Contact - Purple mystical planet
      color: '#9370DB',
      emissive: '#581c87',
      position: [0, -15, -60],
      size: 2.3,
      rotationSpeed: 0.011,
      orbitRadius: 2,
      hasRings: false,
      hasClouds: true,
      name: "Mystic"
    }
  ];

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    planets.forEach((planet, index) => {
      const planetGroup = planetRefs.current[index];
      if (!planetGroup) return;
      
      // Planet rotation
      planetGroup.rotation.y += planet.rotationSpeed;
      
      // Orbital movement
      if (planet.orbitRadius > 0) {
        const orbitSpeed = time * 0.1 + index;
        planetGroup.position.x = planet.position[0] + Math.sin(orbitSpeed) * planet.orbitRadius;
        planetGroup.position.y = planet.position[1] + Math.cos(orbitSpeed * 0.5) * planet.orbitRadius * 0.3;
        planetGroup.position.z = planet.position[2] + Math.cos(orbitSpeed) * planet.orbitRadius * 0.5;
      }
      
      // Enhanced glow effect for active planet
      const isActive = currentSection === index;
      const planetMesh = planetGroup.children[0] as THREE.Mesh;
      if (planetMesh && planetMesh.material) {
        const material = planetMesh.material as THREE.MeshStandardMaterial;
        material.emissiveIntensity = isActive ? 0.5 : 0.2;
      }
      
      // Atmosphere pulsing
      const atmosphere = planetGroup.children.find(child => child.name === 'atmosphere') as THREE.Mesh;
      if (atmosphere && atmosphere.material) {
        const atmosphereMaterial = atmosphere.material as THREE.MeshBasicMaterial;
        atmosphereMaterial.opacity = isActive 
          ? 0.4 + Math.sin(time * 2) * 0.1 
          : 0.2 + Math.sin(time) * 0.05;
      }
    });
  });

  useEffect(() => {
    // Animate active planet
    planets.forEach((planet, index) => {
      const planetGroup = planetRefs.current[index];
      if (!planetGroup) return;
      
      const isActive = currentSection === index;
      
      if (isActive) {
        gsap.to(planetGroup.scale, {
          x: 1.3,
          y: 1.3,
          z: 1.3,
          duration: 1.5,
          ease: "elastic.out(1, 0.5)"
        });
        
        // Add spinning animation
        gsap.to(planetGroup.rotation, {
          x: planetGroup.rotation.x + Math.PI * 0.5,
          duration: 1.5,
          ease: "power2.inOut"
        });
      } else {
        gsap.to(planetGroup.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 1,
          ease: "power2.out"
        });
      }
    });
  }, [currentSection]);

  const createPlanet = (config: typeof planets[0], index: number) => {
    return (
      <group 
        key={index}
        ref={(el) => planetRefs.current[index] = el}
        position={config.position}
      >
        {/* Main planet */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[config.size, 64, 64]} />
          <meshStandardMaterial
            color={config.color}
            emissive={config.emissive}
            emissiveIntensity={0.2}
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>
        
        {/* Surface details */}
        <mesh>
          <sphereGeometry args={[config.size * 1.01, 32, 32]} />
          <meshStandardMaterial
            color={config.color}
            transparent
            opacity={0.3}
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
        
        {/* Atmosphere */}
        <mesh name="atmosphere">
          <sphereGeometry args={[config.size * 1.15, 32, 32]} />
          <meshBasicMaterial
            color={config.color}
            transparent
            opacity={0.2}
            side={THREE.BackSide}
          />
        </mesh>
        
        {/* Outer glow */}
        <mesh>
          <sphereGeometry args={[config.size * 1.3, 16, 16]} />
          <meshBasicMaterial
            color={config.color}
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </mesh>
        
        {/* Saturn's rings */}
        {config.hasRings && (
          <>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[config.size * 1.5, config.size * 2.2, 64]} />
              <meshBasicMaterial
                color={config.color}
                side={THREE.DoubleSide}
                transparent
                opacity={0.8}
              />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[config.size * 2.3, config.size * 2.8, 64]} />
              <meshBasicMaterial
                color={config.color}
                side={THREE.DoubleSide}
                transparent
                opacity={0.5}
              />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[config.size * 2.9, config.size * 3.2, 64]} />
              <meshBasicMaterial
                color={config.color}
                side={THREE.DoubleSide}
                transparent
                opacity={0.3}
              />
            </mesh>
          </>
        )}
        
        {/* Clouds for some planets */}
        {config.hasClouds && (
          <mesh>
            <sphereGeometry args={[config.size * 1.05, 32, 32]} />
            <meshStandardMaterial
              color="#ffffff"
              transparent
              opacity={0.2}
              metalness={0}
              roughness={1}
            />
          </mesh>
        )}
        
        {/* Planet label (appears on hover/active) */}
        {currentSection === index && (
          <sprite position={[0, config.size + 1, 0]}>
            <spriteMaterial color="#ffffff" opacity={0.8} />
          </sprite>
        )}
      </group>
    );
  };

  return (
    <group ref={planetsRef}>
      {planets.map((planet, index) => createPlanet(planet, index))}
      
      {/* Additional space decorations */}
      {/* Asteroid belt between Mars and Jupiter */}
      <group position={[5, -15, -35]}>
        {Array.from({ length: 30 }).map((_, i) => {
          const angle = (i / 30) * Math.PI * 2;
          const radius = 8 + Math.random() * 3;
          return (
            <mesh
              key={`asteroid-${i}`}
              position={[
                Math.cos(angle) * radius,
                (Math.random() - 0.5) * 2,
                Math.sin(angle) * radius
              ]}
            >
              <dodecahedronGeometry args={[0.2 + Math.random() * 0.3, 0]} />
              <meshStandardMaterial color="#8B7355" roughness={0.9} metalness={0.1} />
            </mesh>
          );
        })}
      </group>
      
      {/* Moons for some planets */}
      {/* Earth's moon */}
      <mesh position={[33, 17, -18]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#cccccc" roughness={0.9} />
      </mesh>
      
      {/* Jupiter's moons */}
      <mesh position={[38, -18, -38]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#e6daa6" />
      </mesh>
      <mesh position={[40, -22, -42]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#8b7d6b" />
      </mesh>
    </group>
  );
};

export default EnhancedPlanets;