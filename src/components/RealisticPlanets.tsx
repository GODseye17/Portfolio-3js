import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface RealisticPlanetsProps {
  currentSection: number;
}

const RealisticPlanets: React.FC<RealisticPlanetsProps> = ({ currentSection }) => {
  const planetsRef = useRef<THREE.Group>(null);
  const bluePlanetRef = useRef<THREE.Group>(null);
  const redPlanetRef = useRef<THREE.Group>(null);
  const greenPlanetRef = useRef<THREE.Group>(null);
  const yellowPlanetRef = useRef<THREE.Group>(null);
  const purplePlanetRef = useRef<THREE.Group>(null);

  // Planet configurations - positioned to be ALWAYS VISIBLE on screen
  const planets = [
    { 
      ref: bluePlanetRef, 
      color: '#4169E1', // Royal blue
      position: [12, 6, -15], // Always visible position
      section: 0, // Hero
      glowColor: '#87CEEB',
      size: 2.5,
      rings: false,
      name: "Terra Prime"
    },
    { 
      ref: redPlanetRef, 
      color: '#CD5C5C', // Mars red
      position: [-10, 4, -12], // Always visible position
      section: 1, // About
      glowColor: '#FF6B6B',
      size: 2,
      rings: false,
      name: "Crimson World"
    },
    { 
      ref: greenPlanetRef, 
      color: '#228B22', // Forest green
      position: [14, -6, -18], // Always visible position
      section: 2, // Experience
      glowColor: '#32CD32',
      size: 3,
      rings: false,
      name: "Verdant Sphere"
    },
    { 
      ref: yellowPlanetRef, 
      color: '#FFD700', // Gold yellow
      position: [-12, -8, -16], // Always visible position
      section: 3, // Skills
      glowColor: '#FFFF99',
      size: 2.5,
      rings: true, // Saturn-like rings
      name: "Golden Titan"
    },
    { 
      ref: purplePlanetRef, 
      color: '#9370DB', // Medium purple
      position: [16, 8, -20], // Always visible position
      section: 4, // Projects
      glowColor: '#DDA0DD',
      size: 2.2,
      rings: false,
      name: "Mystic Orb"
    }
  ];

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Get scroll progress for subtle movement
    const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    
    planets.forEach((planet, index) => {
      if (planet.ref.current) {
        // Continuous planetary rotation - always visible and smooth
        planet.ref.current.rotation.y += 0.008 + index * 0.002;
        planet.ref.current.rotation.x += 0.003;
        
        // Gentle orbital movement - keeps planets visible but adds life
        const orbitRadius = 1.5;
        const orbitSpeed = time * (0.08 + index * 0.03);
        
        planet.ref.current.position.x = planet.position[0] + Math.sin(orbitSpeed) * orbitRadius;
        planet.ref.current.position.y = planet.position[1] + Math.cos(orbitSpeed) * orbitRadius * 0.4;
        
        // Very subtle scroll-based movement - keeps them on screen
        planet.ref.current.position.z = planet.position[2] + Math.sin(scrollProgress * Math.PI + index) * 2;
      }
    });
  });

  useEffect(() => {
    planets.forEach((planet) => {
      if (planet.ref.current) {
        const isActive = currentSection === planet.section;
        
        if (isActive) {
          // Enhanced glow for active planet - but keep others visible
          gsap.to(planet.ref.current.scale, {
            x: 1.4,
            y: 1.4,
            z: 1.4,
            duration: 1.5,
            ease: "back.out(1.7)"
          });
          
          // Brighter glow for active
          gsap.to(planet.ref.current, {
            opacity: 1,
            duration: 1,
            ease: "power2.out"
          });
          
          // Gentle pulsing for active planet
          gsap.to(planet.ref.current.scale, {
            x: 1.5,
            y: 1.5,
            z: 1.5,
            duration: 3,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
          });
        } else {
          // Keep inactive planets FULLY VISIBLE - just normal size
          gsap.to(planet.ref.current.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 1,
            ease: "power2.in"
          });
          
          // Keep them fully visible - no dimming
          gsap.to(planet.ref.current, {
            opacity: 1, // Always fully visible
            duration: 0.8,
            ease: "power2.in"
          });
        }
      }
    });
  }, [currentSection]);

  const createRealisticPlanet = (color: string, glowColor: string, size: number, hasRings: boolean = false) => (
    <>
      {/* Main planet sphere with realistic surface */}
      <mesh>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial 
          color={color}
          metalness={0.1}
          roughness={0.9}
          emissive={color}
          emissiveIntensity={0.15}
        />
      </mesh>
      
      {/* Surface texture layer */}
      <mesh>
        <sphereGeometry args={[size * 1.02, 24, 24]} />
        <meshStandardMaterial 
          color={new THREE.Color(color).multiplyScalar(0.7)}
          transparent
          opacity={0.4}
          metalness={0.0}
          roughness={1.0}
        />
      </mesh>
      
      {/* Atmospheric glow - always visible */}
      <mesh>
        <sphereGeometry args={[size * 1.15, 16, 16]} />
        <meshBasicMaterial 
          color={glowColor} 
          transparent 
          opacity={0.4} 
          side={THREE.BackSide} 
        />
      </mesh>
      
      {/* Outer atmospheric layer - always visible */}
      <mesh>
        <sphereGeometry args={[size * 1.3, 12, 12]} />
        <meshBasicMaterial 
          color={glowColor} 
          transparent 
          opacity={0.25} 
          side={THREE.BackSide} 
        />
      </mesh>
      
      {/* Enhanced planetary rings for yellow planet */}
      {hasRings && (
        <>
          <mesh rotation={[Math.PI / 6, 0, 0]}>
            <ringGeometry args={[size * 1.4, size * 1.8, 32]} />
            <meshBasicMaterial 
              color={new THREE.Color(color).multiplyScalar(0.8)}
              transparent 
              opacity={0.8} 
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh rotation={[Math.PI / 6, 0, 0]}>
            <ringGeometry args={[size * 2.0, size * 2.3, 32]} />
            <meshBasicMaterial 
              color={new THREE.Color(color).multiplyScalar(0.6)}
              transparent 
              opacity={0.6} 
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh rotation={[Math.PI / 6, 0, 0]}>
            <ringGeometry args={[size * 2.5, size * 2.7, 32]} />
            <meshBasicMaterial 
              color={new THREE.Color(color).multiplyScalar(0.4)}
              transparent 
              opacity={0.4} 
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      )}
      
      {/* Enhanced glow effect for visibility */}
      <mesh>
        <sphereGeometry args={[size * 1.6, 12, 12]} />
        <meshBasicMaterial 
          color={glowColor} 
          transparent 
          opacity={0.12} 
          side={THREE.BackSide}
        />
      </mesh>
    </>
  );

  return (
    <group ref={planetsRef}>
      {/* Blue Planet - Terra Prime (Hero) - ALWAYS VISIBLE */}
      <group 
        ref={bluePlanetRef} 
        position={planets[0].position}
      >
        {createRealisticPlanet(planets[0].color, planets[0].glowColor, planets[0].size, planets[0].rings)}
      </group>
      
      {/* Red Planet - Crimson World (About) - ALWAYS VISIBLE */}
      <group 
        ref={redPlanetRef} 
        position={planets[1].position}
      >
        {createRealisticPlanet(planets[1].color, planets[1].glowColor, planets[1].size, planets[1].rings)}
      </group>
      
      {/* Green Planet - Verdant Sphere (Experience) - ALWAYS VISIBLE */}
      <group 
        ref={greenPlanetRef} 
        position={planets[2].position}
      >
        {createRealisticPlanet(planets[2].color, planets[2].glowColor, planets[2].size, planets[2].rings)}
      </group>
      
      {/* Yellow Planet - Golden Titan (Skills) - ALWAYS VISIBLE */}
      <group 
        ref={yellowPlanetRef} 
        position={planets[3].position}
      >
        {createRealisticPlanet(planets[3].color, planets[3].glowColor, planets[3].size, planets[3].rings)}
      </group>
      
      {/* Purple Planet - Mystic Orb (Projects) - ALWAYS VISIBLE */}
      <group 
        ref={purplePlanetRef} 
        position={planets[4].position}
      >
        {createRealisticPlanet(planets[4].color, planets[4].glowColor, planets[4].size, planets[4].rings)}
      </group>
    </group>
  );
};

export default RealisticPlanets;