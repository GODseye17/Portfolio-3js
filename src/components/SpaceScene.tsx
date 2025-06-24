import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { gsap } from 'gsap';
import * as THREE from 'three';

// Planet positions in 3D space
const PLANET_POSITIONS = [
  new Vector3(0, 0, 0),       // Home
  new Vector3(-25, 8, -15),   // About (Earth)
  new Vector3(30, -10, -20),  // Experience (Mars)
  new Vector3(-20, -15, -30), // Skills (Jupiter)
  new Vector3(25, 18, -25),   // Projects (Saturn)
  new Vector3(0, 0, -45)      // Contact (Neptune)
];

// Planet colors and properties
const PLANET_DATA = [
  { color: 0x6B93D6, size: 8, name: "Home", emoji: "🌍" },
  { color: 0x6B93D6, size: 12, name: "Earth", emoji: "🌍" },
  { color: 0xCD5C5C, size: 10, name: "Mars", emoji: "🔴" },
  { color: 0xD8CA9D, size: 16, name: "Jupiter", emoji: "🪐" },
  { color: 0x9C88FF, size: 14, name: "Saturn", emoji: "🪐" },
  { color: 0x4B70DD, size: 12, name: "Neptune", emoji: "🔵" }
];

interface PlanetProps {
  position: Vector3;
  color: number;
  size: number;
  name: string;
  isActive: boolean;
  rings?: boolean;
  moons?: number;
}

const Planet: React.FC<PlanetProps> = ({ 
  position, 
  color, 
  size, 
  name, 
  isActive, 
  rings = false, 
  moons = 0 
}) => {
  const planetRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Mesh>(null);
  const moonsGroup = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.008;
    }
    
    if (ringsRef.current) {
      ringsRef.current.rotation.z += 0.003;
    }
    
    if (moonsGroup.current) {
      moonsGroup.current.rotation.y += 0.015;
    }
  });
  
  useEffect(() => {
    if (isActive && groupRef.current) {
      // Scale up animation from small to full size with rotation
      gsap.fromTo(groupRef.current.scale, 
        { x: 0.1, y: 0.1, z: 0.1 },
        { 
          x: 1, 
          y: 1, 
          z: 1, 
          duration: 2,
          ease: "elastic.out(1, 0.5)"
        }
      );
      
      // Rotation during scale up
      gsap.fromTo(groupRef.current.rotation,
        { y: -Math.PI * 2 },
        {
          y: 0,
          duration: 2,
          ease: "power2.out"
        }
      );
      
      // Enhanced glow effect
      if (atmosphereRef.current) {
        gsap.to(atmosphereRef.current.scale, {
          x: 1.3,
          y: 1.3,
          z: 1.3,
          duration: 1.5,
          ease: "elastic.out(1, 0.5)"
        });
        
        gsap.to(atmosphereRef.current.material, {
          opacity: 0.6,
          duration: 1,
          ease: "power2.out"
        });
      }
      
      if (planetRef.current) {
        gsap.to(planetRef.current.scale, {
          x: 1.1,
          y: 1.1,
          z: 1.1,
          duration: 1,
          ease: "back.out(1.7)"
        });
      }
    } else {
      // Scale down when not active
      if (groupRef.current) {
        gsap.to(groupRef.current.scale, {
          x: 0.7,
          y: 0.7,
          z: 0.7,
          duration: 0.8,
          ease: "power2.inOut"
        });
      }
      
      if (atmosphereRef.current) {
        gsap.to(atmosphereRef.current.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.5,
          ease: "power2.inOut"
        });
        
        gsap.to(atmosphereRef.current.material, {
          opacity: 0.2,
          duration: 0.5,
          ease: "power2.inOut"
        });
      }
      
      if (planetRef.current) {
        gsap.to(planetRef.current.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.5,
          ease: "power2.inOut"
        });
      }
    }
  }, [isActive]);

  return (
    <group ref={groupRef} position={position}>
      {/* Planet Core */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial 
          color={color}
          metalness={0.1}
          roughness={0.8}
          emissive={new THREE.Color(color).multiplyScalar(0.1)}
        />
      </mesh>
      
      {/* Atmosphere Glow */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[size * 1.08, 32, 32]} />
        <meshBasicMaterial 
          color={color} 
          transparent={true} 
          opacity={isActive ? 0.4 : 0.2} 
          side={THREE.BackSide} 
        />
      </mesh>
      
      {/* Surface Details */}
      <mesh>
        <sphereGeometry args={[size * 1.01, 32, 32]} />
        <meshStandardMaterial 
          color={new THREE.Color(color).multiplyScalar(0.8)}
          transparent
          opacity={0.3}
          metalness={0.2}
          roughness={0.9}
        />
      </mesh>
      
      {/* Rings for Saturn and Jupiter */}
      {rings && (
        <mesh ref={ringsRef}>
          <ringGeometry args={[size * 1.4, size * 2.2, 64]} />
          <meshBasicMaterial 
            color={color} 
            transparent={true} 
            opacity={0.7} 
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      
      {/* Moons */}
      {moons > 0 && (
        <group ref={moonsGroup}>
          {Array.from({ length: moons }).map((_, index) => {
            const angle = (index / moons) * Math.PI * 2;
            const distance = size * 2.8;
            const x = Math.cos(angle) * distance;
            const z = Math.sin(angle) * distance;
            const moonSize = size * 0.12;
            
            return (
              <mesh 
                key={index}
                position={[x, 0, z]}
              >
                <sphereGeometry args={[moonSize, 16, 16]} />
                <meshStandardMaterial color="#cccccc" />
              </mesh>
            );
          })}
        </group>
      )}
      
      {/* Enhanced glow effect for active planet */}
      {isActive && (
        <>
          <mesh>
            <sphereGeometry args={[size * 2, 32, 32]} />
            <meshBasicMaterial 
              color={color} 
              transparent 
              opacity={0.08} 
              side={THREE.BackSide}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[size * 2.5, 32, 32]} />
            <meshBasicMaterial 
              color={color} 
              transparent 
              opacity={0.04} 
              side={THREE.BackSide}
            />
          </mesh>
        </>
      )}
    </group>
  );
};

interface SpaceSceneProps {
  currentPlanet: number;
}

const SpaceScene: React.FC<SpaceSceneProps> = ({ currentPlanet }) => {
  const { camera } = useThree();
  const sceneRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    const targetPosition = PLANET_POSITIONS[currentPlanet];
    const offset = currentPlanet % 2 === 0 ? 25 : -25; // Alternate camera sides
    
    gsap.to(camera.position, {
      x: targetPosition.x + offset,
      y: targetPosition.y + 12,
      z: targetPosition.z + 30,
      duration: 2.5,
      ease: "power3.inOut",
      onUpdate: () => {
        camera.lookAt(targetPosition);
      }
    });
  }, [currentPlanet, camera]);
  
  return (
    <group ref={sceneRef}>
      {PLANET_DATA.map((planet, index) => (
        <Planet
          key={index}
          position={PLANET_POSITIONS[index]}
          color={planet.color}
          size={planet.size}
          name={planet.name}
          isActive={currentPlanet === index}
          rings={index === 4 || index === 3} // Saturn and Jupiter have rings
          moons={index === 3 ? 4 : index === 0 ? 1 : index === 4 ? 2 : 0} // Jupiter has 4 moons, Earth has 1, Saturn has 2
        />
      ))}
      
      {/* Enhanced distant nebula effects */}
      <mesh position={[100, 50, -150]}>
        <sphereGeometry args={[30, 16, 16]} />
        <meshBasicMaterial color="#ff9ff3" transparent opacity={0.15} />
      </mesh>
      
      <mesh position={[-120, -60, -180]}>
        <sphereGeometry args={[40, 16, 16]} />
        <meshBasicMaterial color="#0abde3" transparent opacity={0.12} />
      </mesh>
      
      <mesh position={[80, -40, -120]}>
        <sphereGeometry args={[25, 16, 16]} />
        <meshBasicMaterial color="#9c88ff" transparent opacity={0.18} />
      </mesh>
      
      {/* Additional cosmic background elements */}
      <mesh position={[200, 100, -200]}>
        <sphereGeometry args={[50, 16, 16]} />
        <meshBasicMaterial color="#4facfe" transparent opacity={0.08} />
      </mesh>
      
      <mesh position={[-150, -100, -250]}>
        <sphereGeometry args={[35, 16, 16]} />
        <meshBasicMaterial color="#ff6b6b" transparent opacity={0.1} />
      </mesh>
    </group>
  );
};

export default SpaceScene;