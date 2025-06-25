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

  // Enhanced planet configurations with better materials and effects
  const planets = [
    { 
      // Hero - Central Earth-like planet with enhanced details
      color: '#4169E1',
      emissive: '#1e3a8a',
      position: [0, 0, 0],
      size: 4,
      rotationSpeed: 0.008,
      orbitRadius: 0,
      hasRings: false,
      hasClouds: true,
      hasAtmosphere: true,
      surfaceDetails: true,
      name: "Terra Prime"
    },
    { 
      // About - Beautiful blue ocean planet
      color: '#4facfe',
      emissive: '#2563eb',
      position: [30, 15, -20],
      size: 3.5,
      rotationSpeed: 0.01,
      orbitRadius: 3,
      hasRings: false,
      hasClouds: true,
      hasAtmosphere: true,
      surfaceDetails: true,
      name: "Aqua"
    },
    { 
      // Experience - Mars-like red planet with enhanced surface
      color: '#CD5C5C',
      emissive: '#7f1d1d',
      position: [-25, -10, -30],
      size: 3.2,
      rotationSpeed: 0.009,
      orbitRadius: 2.5,
      hasRings: false,
      hasClouds: false,
      hasAtmosphere: true,
      surfaceDetails: true,
      name: "Crimson"
    },
    { 
      // Skills - Lush green forest planet
      color: '#228B22',
      emissive: '#14532d',
      position: [35, -20, -40],
      size: 3.8,
      rotationSpeed: 0.007,
      orbitRadius: 4,
      hasRings: false,
      hasClouds: true,
      hasAtmosphere: true,
      surfaceDetails: true,
      name: "Verdania"
    },
    { 
      // Projects - Magnificent Saturn with enhanced rings
      color: '#FFD700',
      emissive: '#a16207',
      position: [-30, 25, -50],
      size: 3.5,
      rotationSpeed: 0.006,
      orbitRadius: 3.5,
      hasRings: true,
      hasClouds: false,
      hasAtmosphere: true,
      surfaceDetails: true,
      name: "Aurelius"
    },
    { 
      // Contact - Mystical purple planet with ethereal glow
      color: '#9370DB',
      emissive: '#581c87',
      position: [0, -15, -60],
      size: 3.3,
      rotationSpeed: 0.011,
      orbitRadius: 2,
      hasRings: false,
      hasClouds: true,
      hasAtmosphere: true,
      surfaceDetails: true,
      name: "Mystara"
    }
  ];

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    planets.forEach((planet, index) => {
      const planetGroup = planetRefs.current[index];
      if (!planetGroup) return;
      
      // Enhanced planet rotation with slight wobble
      planetGroup.rotation.y += planet.rotationSpeed;
      planetGroup.rotation.x += planet.rotationSpeed * 0.1;
      
      // Enhanced orbital movement with elliptical paths
      if (planet.orbitRadius > 0) {
        const orbitSpeed = time * 0.08 + index;
        const ellipseA = planet.orbitRadius;
        const ellipseB = planet.orbitRadius * 0.7;
        
        planetGroup.position.x = planet.position[0] + Math.sin(orbitSpeed) * ellipseA;
        planetGroup.position.y = planet.position[1] + Math.cos(orbitSpeed * 0.6) * ellipseB * 0.4;
        planetGroup.position.z = planet.position[2] + Math.cos(orbitSpeed) * ellipseB;
      }
      
      // Enhanced glow and pulsing effects for active planet with debugging
      const isActive = currentSection === index;
      const planetMesh = planetGroup.children[0] as THREE.Mesh;
      
      // DEBUG: Check planetMesh and its material
      if (planetMesh) {
        if (!planetMesh.material) {
          console.warn(`Planet ${index} (${planet.name}): planetMesh.material is null/undefined`);
        } else {
          const material = planetMesh.material as THREE.MeshStandardMaterial;
          
          // DEBUG: Check if material has uniforms property
          if ('uniforms' in material) {
            console.log(`Planet ${index} (${planet.name}): Material has uniforms:`, material.uniforms);
            
            // Check each uniform for undefined values
            if (material.uniforms) {
              Object.keys(material.uniforms).forEach(uniformName => {
                const uniform = material.uniforms[uniformName];
                if (!uniform) {
                  console.error(`Planet ${index} (${planet.name}): Uniform '${uniformName}' is undefined`);
                } else if (uniform.value === undefined) {
                  console.error(`Planet ${index} (${planet.name}): Uniform '${uniformName}'.value is undefined`);
                }
              });
            }
          }
          
          // Safely set emissiveIntensity
          try {
            if ('emissiveIntensity' in material) {
              material.emissiveIntensity = isActive ? 1.2 + Math.sin(time * 2) * 0.3 : 0.4;
            }
          } catch (error) {
            console.error(`Planet ${index} (${planet.name}): Error setting emissiveIntensity:`, error);
          }
        }
      } else {
        console.warn(`Planet ${index} (${planet.name}): planetMesh is null/undefined`);
      }
      
      // Enhanced atmosphere effects with debugging
      const atmosphere = planetGroup.children.find(child => child.name === 'atmosphere') as THREE.Mesh;
      if (atmosphere) {
        if (!atmosphere.material) {
          console.warn(`Planet ${index} (${planet.name}): atmosphere.material is null/undefined`);
        } else {
          const atmosphereMaterial = atmosphere.material as THREE.MeshBasicMaterial;
          
          // DEBUG: Check atmosphere material uniforms
          if ('uniforms' in atmosphereMaterial) {
            console.log(`Planet ${index} (${planet.name}): Atmosphere material has uniforms:`, atmosphereMaterial.uniforms);
            
            if (atmosphereMaterial.uniforms) {
              Object.keys(atmosphereMaterial.uniforms).forEach(uniformName => {
                const uniform = atmosphereMaterial.uniforms[uniformName];
                if (!uniform) {
                  console.error(`Planet ${index} (${planet.name}): Atmosphere uniform '${uniformName}' is undefined`);
                } else if (uniform.value === undefined) {
                  console.error(`Planet ${index} (${planet.name}): Atmosphere uniform '${uniformName}'.value is undefined`);
                }
              });
            }
          }
          
          // Safely set opacity
          try {
            if ('opacity' in atmosphereMaterial) {
              atmosphereMaterial.opacity = isActive 
                ? 0.7 + Math.sin(time * 2.5) * 0.2 
                : 0.4 + Math.sin(time * 1.2) * 0.1;
            }
          } catch (error) {
            console.error(`Planet ${index} (${planet.name}): Error setting atmosphere opacity:`, error);
          }
        }
      }
      
      // Enhanced multi-layer glow system with debugging
      const glowLayers = ['outerGlow', 'farGlow', 'ultraGlow'];
      glowLayers.forEach((glowName, glowIndex) => {
        const glow = planetGroup.children.find(child => child.name === glowName) as THREE.Mesh;
        if (glow) {
          if (!glow.material) {
            console.warn(`Planet ${index} (${planet.name}): ${glowName}.material is null/undefined`);
          } else {
            const glowMaterial = glow.material as THREE.MeshBasicMaterial;
            
            // DEBUG: Check glow material uniforms
            if ('uniforms' in glowMaterial) {
              console.log(`Planet ${index} (${planet.name}): ${glowName} material has uniforms:`, glowMaterial.uniforms);
              
              if (glowMaterial.uniforms) {
                Object.keys(glowMaterial.uniforms).forEach(uniformName => {
                  const uniform = glowMaterial.uniforms[uniformName];
                  if (!uniform) {
                    console.error(`Planet ${index} (${planet.name}): ${glowName} uniform '${uniformName}' is undefined`);
                  } else if (uniform.value === undefined) {
                    console.error(`Planet ${index} (${planet.name}): ${glowName} uniform '${uniformName}'.value is undefined`);
                  }
                });
              }
            }
            
            // Safely set opacity
            try {
              if ('opacity' in glowMaterial) {
                const baseOpacity = isActive ? 0.4 : 0.15;
                const pulseIntensity = isActive ? 0.2 : 0.08;
                glowMaterial.opacity = baseOpacity + Math.sin(time * (1.8 - glowIndex * 0.3)) * pulseIntensity;
              }
            } catch (error) {
              console.error(`Planet ${index} (${planet.name}): Error setting ${glowName} opacity:`, error);
            }
          }
        }
      });
    });
  });

  useEffect(() => {
    // Enhanced planet activation animations
    planets.forEach((planet, index) => {
      const planetGroup = planetRefs.current[index];
      if (!planetGroup) return;
      
      const isActive = currentSection === index;
      
      if (isActive) {
        // More dramatic scale and rotation animation
        gsap.to(planetGroup.scale, {
          x: 1.6,
          y: 1.6,
          z: 1.6,
          duration: 2,
          ease: "elastic.out(1, 0.4)"
        });
        
        // Enhanced spinning with multiple axis rotation
        gsap.to(planetGroup.rotation, {
          x: planetGroup.rotation.x + Math.PI * 0.3,
          z: planetGroup.rotation.z + Math.PI * 0.2,
          duration: 2,
          ease: "power2.inOut"
        });
      } else {
        gsap.to(planetGroup.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 1.5,
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
        {/* Main planet with enhanced PBR materials */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[config.size, 128, 128]} />
          <meshStandardMaterial
            color={config.color}
            emissive={config.emissive}
            emissiveIntensity={0.4}
            metalness={0.2}
            roughness={0.8}
            envMapIntensity={2}
          />
        </mesh>
        
        {/* Enhanced surface details with multiple layers */}
        {config.surfaceDetails && (
          <>
            <mesh>
              <sphereGeometry args={[config.size * 1.002, 64, 64]} />
              <meshStandardMaterial
                color={new THREE.Color(config.color).multiplyScalar(0.8)}
                transparent
                opacity={0.6}
                metalness={0.1}
                roughness={0.9}
                emissive={config.emissive}
                emissiveIntensity={0.1}
              />
            </mesh>
            
            {/* Surface texture layer */}
            <mesh>
              <sphereGeometry args={[config.size * 1.004, 32, 32]} />
              <meshStandardMaterial
                color={new THREE.Color(config.color).multiplyScalar(1.2)}
                transparent
                opacity={0.3}
                metalness={0.05}
                roughness={0.95}
              />
            </mesh>
          </>
        )}
        
        {/* Enhanced multi-layer atmosphere */}
        {config.hasAtmosphere && (
          <>
            <mesh name="atmosphere">
              <sphereGeometry args={[config.size * 1.15, 32, 32]} />
              <meshBasicMaterial
                color={config.color}
                transparent
                opacity={0.4}
                side={THREE.BackSide}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
            
            {/* Secondary atmosphere layer */}
            <mesh name="atmosphere2">
              <sphereGeometry args={[config.size * 1.25, 24, 24]} />
              <meshBasicMaterial
                color={new THREE.Color(config.color).multiplyScalar(1.3)}
                transparent
                opacity={0.2}
                side={THREE.BackSide}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </>
        )}
        
        {/* Enhanced multi-layer glow system */}
        <mesh name="outerGlow">
          <sphereGeometry args={[config.size * 1.4, 16, 16]} />
          <meshBasicMaterial
            color={config.color}
            transparent
            opacity={0.15}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        
        <mesh name="farGlow">
          <sphereGeometry args={[config.size * 1.8, 12, 12]} />
          <meshBasicMaterial
            color={config.color}
            transparent
            opacity={0.08}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        
        <mesh name="ultraGlow">
          <sphereGeometry args={[config.size * 2.2, 8, 8]} />
          <meshBasicMaterial
            color={config.color}
            transparent
            opacity={0.04}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        
        {/* Enhanced Saturn's rings with multiple layers */}
        {config.hasRings && (
          <>
            {/* Main ring system */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[config.size * 1.6, config.size * 2.8, 128]} />
              <meshBasicMaterial
                color={config.color}
                side={THREE.DoubleSide}
                transparent
                opacity={0.9}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
            
            {/* Secondary ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[config.size * 3.0, config.size * 3.8, 128]} />
              <meshBasicMaterial
                color={new THREE.Color(config.color).multiplyScalar(0.8)}
                side={THREE.DoubleSide}
                transparent
                opacity={0.7}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
            
            {/* Outer ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[config.size * 4.0, config.size * 4.5, 64]} />
              <meshBasicMaterial
                color={new THREE.Color(config.color).multiplyScalar(0.6)}
                side={THREE.DoubleSide}
                transparent
                opacity={0.5}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
            
            {/* Ring particles */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[config.size * 4.6, config.size * 5.0, 32]} />
              <meshBasicMaterial
                color={new THREE.Color(config.color).multiplyScalar(0.4)}
                side={THREE.DoubleSide}
                transparent
                opacity={0.3}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </>
        )}
        
        {/* Enhanced volumetric clouds */}
        {config.hasClouds && (
          <>
            {/* Primary cloud layer */}
            <mesh>
              <sphereGeometry args={[config.size * 1.08, 32, 32]} />
              <meshStandardMaterial
                color="#ffffff"
                transparent
                opacity={0.4}
                metalness={0}
                roughness={1}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
            
            {/* Secondary cloud layer */}
            <mesh rotation={[0, Math.PI / 3, 0]}>
              <sphereGeometry args={[config.size * 1.06, 24, 24]} />
              <meshStandardMaterial
                color="#f0f8ff"
                transparent
                opacity={0.25}
                metalness={0}
                roughness={1}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
            
            {/* Wispy high-altitude clouds */}
            <mesh rotation={[0, Math.PI / 6, 0]}>
              <sphereGeometry args={[config.size * 1.1, 16, 16]} />
              <meshStandardMaterial
                color="#ffffff"
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
      
      {/* Enhanced space environment */}
      {/* Improved asteroid belt */}
      <group position={[5, -15, -35]}>
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = (i / 60) * Math.PI * 2;
          const radius = 8 + Math.random() * 6;
          const height = (Math.random() - 0.5) * 4;
          return (
            <mesh
              key={`asteroid-${i}`}
              position={[
                Math.cos(angle) * radius,
                height,
                Math.sin(angle) * radius
              ]}
            >
              <dodecahedronGeometry args={[0.2 + Math.random() * 0.5, 1]} />
              <meshStandardMaterial 
                color="#8B7355" 
                roughness={0.95} 
                metalness={0.05}
                emissive="#2a1f1a"
                emissiveIntensity={0.1}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* Enhanced planetary moons */}
      {/* Earth's moon with enhanced detail */}
      <mesh position={[33, 17, -18]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial 
          color="#c0c0c0" 
          roughness={0.95}
          metalness={0.05}
          emissive="#404040"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Jupiter's major moons */}
      <mesh position={[38, -18, -38]}>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshStandardMaterial 
          color="#e6daa6"
          roughness={0.9}
          emissive="#8b7d6b"
          emissiveIntensity={0.1}
        />
      </mesh>
      <mesh position={[40, -22, -42]}>
        <sphereGeometry args={[0.4, 20, 20]} />
        <meshStandardMaterial 
          color="#8b7d6b"
          roughness={0.95}
          emissive="#4a3728"
          emissiveIntensity={0.1}
        />
      </mesh>
      <mesh position={[36, -24, -44]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial 
          color="#a0522d"
          roughness={0.9}
          emissive="#654321"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Enhanced space station */}
      <group position={[15, 8, -15]}>
        <mesh>
          <cylinderGeometry args={[0.4, 0.4, 2.5, 12]} />
          <meshStandardMaterial 
            color="#e8e8e8" 
            metalness={0.95} 
            roughness={0.05}
            emissive="#4facfe"
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh position={[0, 0, 2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1, 1, 0.3, 16]} />
          <meshStandardMaterial 
            color="#b8b8b8" 
            metalness={0.9} 
            roughness={0.1}
          />
        </mesh>
        {/* Solar panels */}
        <mesh position={[2.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.1, 3, 1.5]} />
          <meshStandardMaterial 
            color="#1a1a2e" 
            metalness={0.8} 
            roughness={0.2}
            emissive="#0066cc"
            emissiveIntensity={0.2}
          />
        </mesh>
        <mesh position={[-2.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.1, 3, 1.5]} />
          <meshStandardMaterial 
            color="#1a1a2e" 
            metalness={0.8} 
            roughness={0.2}
            emissive="#0066cc"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>
    </group>
  );
};

export default EnhancedPlanets;