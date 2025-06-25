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
      size: 3.5,
      rotationSpeed: 0.008,
      orbitRadius: 0,
      hasRings: false,
      hasClouds: true,
      hasAtmosphere: true,
      name: "Terra Prime"
    },
    { 
      // About - Blue Earth
      color: '#4facfe',
      emissive: '#2563eb',
      position: [30, 15, -20],
      size: 3,
      rotationSpeed: 0.01,
      orbitRadius: 3,
      hasRings: false,
      hasClouds: true,
      hasAtmosphere: true,
      name: "Earth"
    },
    { 
      // Experience - Red Mars
      color: '#CD5C5C',
      emissive: '#7f1d1d',
      position: [-25, -10, -30],
      size: 2.8,
      rotationSpeed: 0.009,
      orbitRadius: 2.5,
      hasRings: false,
      hasClouds: false,
      hasAtmosphere: true,
      name: "Mars"
    },
    { 
      // Skills - Green forest planet
      color: '#228B22',
      emissive: '#14532d',
      position: [35, -20, -40],
      size: 3.2,
      rotationSpeed: 0.007,
      orbitRadius: 4,
      hasRings: false,
      hasClouds: true,
      hasAtmosphere: true,
      name: "Verdant"
    },
    { 
      // Projects - Yellow Saturn
      color: '#FFD700',
      emissive: '#a16207',
      position: [-30, 25, -50],
      size: 3,
      rotationSpeed: 0.006,
      orbitRadius: 3.5,
      hasRings: true,
      hasClouds: false,
      hasAtmosphere: true,
      name: "Saturn"
    },
    { 
      // Contact - Purple mystical planet
      color: '#9370DB',
      emissive: '#581c87',
      position: [0, -15, -60],
      size: 2.8,
      rotationSpeed: 0.011,
      orbitRadius: 2,
      hasRings: false,
      hasClouds: true,
      hasAtmosphere: true,
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
        material.emissiveIntensity = isActive ? 0.8 : 0.3;
      }
      
      // Atmosphere pulsing
      const atmosphere = planetGroup.children.find(child => child.name === 'atmosphere') as THREE.Mesh;
      if (atmosphere && atmosphere.material) {
        const atmosphereMaterial = atmosphere.material as THREE.MeshBasicMaterial;
        atmosphereMaterial.opacity = isActive 
          ? 0.6 + Math.sin(time * 2) * 0.2 
          : 0.3 + Math.sin(time) * 0.1;
      }
      
      // Enhanced outer glow for active planet
      const outerGlow = planetGroup.children.find(child => child.name === 'outerGlow') as THREE.Mesh;
      if (outerGlow && outerGlow.material) {
        const glowMaterial = outerGlow.material as THREE.MeshBasicMaterial;
        glowMaterial.opacity = isActive 
          ? 0.3 + Math.sin(time * 1.5) * 0.15 
          : 0.1 + Math.sin(time * 0.8) * 0.05;
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
          x: 1.4,
          y: 1.4,
          z: 1.4,
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
        {/* Main planet with clean materials - NO WHITE PIXELS */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[config.size, 64, 64]} />
          <meshStandardMaterial
            color={config.color}
            emissive={config.emissive}
            emissiveIntensity={0.3}
            metalness={0.4}
            roughness={0.6}
            envMapIntensity={1.5}
          />
        </mesh>
        
        {/* Enhanced atmosphere */}
        {config.hasAtmosphere && (
          <mesh name="atmosphere">
            <sphereGeometry args={[config.size * 1.2, 32, 32]} />
            <meshBasicMaterial
              color={config.color}
              transparent
              opacity={0.3}
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}
        
        {/* Enhanced outer glow */}
        <mesh name="outerGlow">
          <sphereGeometry args={[config.size * 1.4, 16, 16]} />
          <meshBasicMaterial
            color={config.color}
            transparent
            opacity={0.1}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        
        {/* Far outer glow for dramatic effect */}
        <mesh name="farGlow">
          <sphereGeometry args={[config.size * 1.8, 12, 12]} />
          <meshBasicMaterial
            color={config.color}
            transparent
            opacity={0.05}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        
        {/* Enhanced Saturn's rings */}
        {config.hasRings && (
          <>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[config.size * 1.6, config.size * 2.4, 64]} />
              <meshBasicMaterial
                color={config.color}
                side={THREE.DoubleSide}
                transparent
                opacity={0.9}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[config.size * 2.5, config.size * 3.0, 64]} />
              <meshBasicMaterial
                color={config.color}
                side={THREE.DoubleSide}
                transparent
                opacity={0.6}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[config.size * 3.1, config.size * 3.6, 64]} />
              <meshBasicMaterial
                color={config.color}
                side={THREE.DoubleSide}
                transparent
                opacity={0.4}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </>
        )}
        
        {/* Enhanced clouds for some planets - Using planet colors instead of white */}
        {config.hasClouds && (
          <>
            <mesh>
              <sphereGeometry args={[config.size * 1.08, 32, 32]} />
              <meshStandardMaterial
                color={new THREE.Color(config.color).lerp(new THREE.Color('#ffffff'), 0.7)}
                transparent
                opacity={0.2}
                metalness={0}
                roughness={1}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
            {/* Secondary cloud layer */}
            <mesh rotation={[0, Math.PI / 4, 0]}>
              <sphereGeometry args={[config.size * 1.06, 24, 24]} />
              <meshStandardMaterial
                color={new THREE.Color(config.color).lerp(new THREE.Color('#ffffff'), 0.8)}
                transparent
                opacity={0.15}
                metalness={0}
                roughness={1}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </>
        )}
      </group>
    );
  };

  return (
    <group ref={planetsRef}>
      {planets.map((planet, index) => createPlanet(planet, index))}
      
      {/* Enhanced space decorations */}
      {/* Asteroid belt between Mars and Jupiter */}
      <group position={[5, -15, -35]}>
        {Array.from({ length: 40 }).map((_, i) => {
          const angle = (i / 40) * Math.PI * 2;
          const radius = 8 + Math.random() * 4;
          return (
            <mesh
              key={`asteroid-${i}`}
              position={[
                Math.cos(angle) * radius,
                (Math.random() - 0.5) * 3,
                Math.sin(angle) * radius
              ]}
            >
              <dodecahedronGeometry args={[0.3 + Math.random() * 0.4, 0]} />
              <meshStandardMaterial 
                color="#8B7355" 
                roughness={0.9} 
                metalness={0.1}
                emissive="#4a3728"
                emissiveIntensity={0.1}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* Enhanced moons for some planets */}
      {/* Earth's moon */}
      <mesh position={[33, 17, -18]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial 
          color="#cccccc" 
          roughness={0.9}
          emissive="#666666"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Jupiter's moons */}
      <mesh position={[38, -18, -38]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial 
          color="#e6daa6"
          emissive="#8b7d6b"
          emissiveIntensity={0.1}
        />
      </mesh>
      <mesh position={[40, -22, -42]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial 
          color="#8b7d6b"
          emissive="#4a3728"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Additional cosmic phenomena */}
      {/* Space station */}
      <group position={[15, 8, -15]}>
        <mesh>
          <cylinderGeometry args={[0.3, 0.3, 2, 8]} />
          <meshStandardMaterial 
            color="#cccccc" 
            metalness={0.9} 
            roughness={0.1}
            emissive="#4facfe"
            emissiveIntensity={0.2}
          />
        </mesh>
        <mesh position={[0, 0, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 0.2, 8]} />
          <meshStandardMaterial 
            color="#999999" 
            metalness={0.8} 
            roughness={0.2}
          />
        </mesh>
      </group>
    </group>
  );
};

export default EnhancedPlanets;