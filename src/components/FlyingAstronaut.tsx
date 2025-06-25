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
  const antennaLightMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Jetpack particle trail
  const particleCount = 80;
  const positions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = 0;
    positions[i + 1] = 0;
    positions[i + 2] = 0;
    velocities[i] = (Math.random() - 0.5) * 0.15;
    velocities[i + 1] = (Math.random() - 0.5) * 0.15;
    velocities[i + 2] = -Math.random() * 0.4;
    
    // Enhanced blue-white flame colors
    const color = new THREE.Color().setHSL(0.6 + Math.random() * 0.1, 0.9, 0.8);
    colors[i] = color.r;
    colors[i + 1] = color.g;
    colors[i + 2] = color.b;
    
    sizes[i / 3] = Math.random() * 1.2 + 0.3;
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
    
    // Update antenna light blinking effect with debugging
    if (antennaLightMaterialRef.current) {
      // DEBUG: Check antenna light material
      const antennaLightMaterial = antennaLightMaterialRef.current;
      
      if ('uniforms' in antennaLightMaterial) {
        console.log('Antenna light material has uniforms:', antennaLightMaterial.uniforms);
        
        if (antennaLightMaterial.uniforms) {
          Object.keys(antennaLightMaterial.uniforms).forEach(uniformName => {
            const uniform = antennaLightMaterial.uniforms[uniformName];
            if (!uniform) {
              console.error(`Antenna light uniform '${uniformName}' is undefined`);
            } else if (uniform.value === undefined) {
              console.error(`Antenna light uniform '${uniformName}'.value is undefined`);
            }
          });
        }
      }
      
      // Safely set opacity
      try {
        if ('opacity' in antennaLightMaterial) {
          antennaLightMaterial.opacity = 0.5 + Math.sin(time * 5) * 0.5;
        }
      } catch (error) {
        console.error('Error setting antenna light opacity:', error);
      }
    } else {
      console.warn('antennaLightMaterialRef.current is null/undefined');
    }
    
    // Get camera direction
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    
    // Enhanced position astronaut relative to camera - more visible
    const offset = new THREE.Vector3(
      6 + Math.sin(time * 0.6) * 0.8 + mousePosition.x * 3,
      2 + Math.cos(time * 0.8) * 0.5 + mousePosition.y * 2,
      8
    );
    
    // Apply camera rotation to offset
    offset.applyQuaternion(camera.quaternion);
    
    // Target position
    const targetPosition = camera.position.clone().add(offset);
    
    // Smoother movement
    astronautRef.current.position.lerp(targetPosition, 0.06);
    
    // Look at camera with body tilt
    const lookAtPosition = camera.position.clone();
    astronautRef.current.lookAt(lookAtPosition);
    
    // Enhanced floating animation
    astronautRef.current.position.y += Math.sin(time * 2.5) * 0.03;
    
    // Body rotations based on movement
    const velocity = new THREE.Vector3().subVectors(astronautRef.current.position, targetPosition);
    astronautRef.current.rotation.z = velocity.x * 0.4;
    astronautRef.current.rotation.x += Math.sin(time * 3.5) * 0.015;
    
    // Enhanced jetpack flames during transitions with debugging
    if (jetpackRef.current) {
      const flameScale = isTransitioning ? 2 : 1.2;
      jetpackRef.current.scale.setScalar(flameScale);
      
      // Enhanced jetpack glow with debugging
      const jetpackFlames = jetpackRef.current.children;
      jetpackFlames.forEach((flame, index) => {
        if (flame instanceof THREE.Mesh) {
          if (!flame.material) {
            console.warn(`Jetpack flame ${index}: material is null/undefined`);
          } else {
            const material = flame.material as THREE.MeshBasicMaterial;
            
            // DEBUG: Check flame material uniforms
            if ('uniforms' in material) {
              console.log(`Jetpack flame ${index} material has uniforms:`, material.uniforms);
              
              if (material.uniforms) {
                Object.keys(material.uniforms).forEach(uniformName => {
                  const uniform = material.uniforms[uniformName];
                  if (!uniform) {
                    console.error(`Jetpack flame ${index} uniform '${uniformName}' is undefined`);
                  } else if (uniform.value === undefined) {
                    console.error(`Jetpack flame ${index} uniform '${uniformName}'.value is undefined`);
                  }
                });
              }
            }
            
            // Safely set opacity
            try {
              if ('opacity' in material) {
                material.opacity = isTransitioning 
                  ? 0.95 + Math.sin(time * 12 + index) * 0.05
                  : 0.8 + Math.sin(time * 6 + index) * 0.2;
              }
            } catch (error) {
              console.error(`Error setting jetpack flame ${index} opacity:`, error);
            }
          }
        }
      });
    }
    
    // Enhanced particle trail with debugging
    if (trailRef.current) {
      // DEBUG: Check trail material
      if (!trailRef.current.material) {
        console.warn('Trail material is null/undefined');
      } else {
        const trailMaterial = trailRef.current.material as THREE.PointsMaterial;
        
        if ('uniforms' in trailMaterial) {
          console.log('Trail material has uniforms:', trailMaterial.uniforms);
          
          if (trailMaterial.uniforms) {
            Object.keys(trailMaterial.uniforms).forEach(uniformName => {
              const uniform = trailMaterial.uniforms[uniformName];
              if (!uniform) {
                console.error(`Trail uniform '${uniformName}' is undefined`);
              } else if (uniform.value === undefined) {
                console.error(`Trail uniform '${uniformName}'.value is undefined`);
              }
            });
          }
        }
      }
      
      // Safely update particle positions
      try {
        const positions = trailRef.current.geometry.attributes.position.array as Float32Array;
        const trailSizes = trailRef.current.geometry.attributes.size.array as Float32Array;
        
        for (let i = 0; i < particleCount * 3; i += 3) {
          positions[i] += velocities[i];
          positions[i + 1] += velocities[i + 1];
          positions[i + 2] += velocities[i + 2];
          
          // Fade out particles
          const particleIndex = i / 3;
          trailSizes[particleIndex] *= 0.97;
          
          // Reset particles
          if (positions[i + 2] < -8 || trailSizes[particleIndex] < 0.01) {
            positions[i] = astronautRef.current.position.x + (Math.random() - 0.5) * 0.3;
            positions[i + 1] = astronautRef.current.position.y - 0.8;
            positions[i + 2] = astronautRef.current.position.z - 0.5;
            trailSizes[particleIndex] = Math.random() * 1.2 + 0.3;
          }
        }
        
        trailRef.current.geometry.attributes.position.needsUpdate = true;
        trailRef.current.geometry.attributes.size.needsUpdate = true;
      } catch (error) {
        console.error('Error updating trail particles:', error);
      }
    }
  });

  // Enhanced reaction animations based on section
  useEffect(() => {
    if (astronautRef.current && isTransitioning) {
      // More excited spin during transitions
      gsap.to(astronautRef.current.rotation, {
        y: astronautRef.current.rotation.y + Math.PI * 6,
        duration: 2,
        ease: "power2.inOut"
      });
      
      // Enhanced boost effect
      gsap.to(astronautRef.current.scale, {
        x: 1.4,
        y: 1.4,
        z: 1.4,
        duration: 0.4,
        yoyo: true,
        repeat: 1,
        ease: "elastic.out(1, 0.5)"
      });
    }
  }, [isTransitioning, currentSection]);

  return (
    <group ref={astronautRef}>
      {/* Enhanced Astronaut Body */}
      <mesh castShadow>
        <capsuleGeometry args={[0.4, 0.8, 4, 8]} />
        <meshStandardMaterial 
          color="#f8f8f8" 
          metalness={0.3} 
          roughness={0.7}
          emissive="#ffffff"
          emissiveIntensity={0.08}
        />
      </mesh>
      
      {/* Enhanced Helmet */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.95} 
          metalness={0.95} 
          roughness={0.05}
          clearcoat={1}
          clearcoatRoughness={0}
          transmission={0.6}
          thickness={0.3}
        />
      </mesh>
      
      {/* Enhanced Helmet Visor with reflection */}
      <mesh position={[0, 0.5, 0.1]}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshPhysicalMaterial 
          color="#001a33" 
          transparent 
          opacity={0.85} 
          metalness={1} 
          roughness={0}
          envMapIntensity={3}
        />
      </mesh>
      
      {/* Enhanced Arms */}
      <mesh position={[-0.35, 0.15, 0]} rotation={[0, 0, Math.PI / 5]} castShadow>
        <capsuleGeometry args={[0.1, 0.4, 4, 8]} />
        <meshStandardMaterial color="#f8f8f8" metalness={0.3} roughness={0.7} />
      </mesh>
      <mesh position={[0.35, 0.15, 0]} rotation={[0, 0, -Math.PI / 5]} castShadow>
        <capsuleGeometry args={[0.1, 0.4, 4, 8]} />
        <meshStandardMaterial color="#f8f8f8" metalness={0.3} roughness={0.7} />
      </mesh>
      
      {/* Enhanced Legs */}
      <mesh position={[-0.12, -0.6, 0]} castShadow>
        <capsuleGeometry args={[0.1, 0.45, 4, 8]} />
        <meshStandardMaterial color="#f8f8f8" metalness={0.3} roughness={0.7} />
      </mesh>
      <mesh position={[0.12, -0.6, 0]} castShadow>
        <capsuleGeometry args={[0.1, 0.45, 4, 8]} />
        <meshStandardMaterial color="#f8f8f8" metalness={0.3} roughness={0.7} />
      </mesh>
      
      {/* Enhanced Jetpack */}
      <group ref={jetpackRef} position={[0, 0, -0.3]}>
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.45, 0.15]} />
          <meshStandardMaterial 
            color="#2a2a2a" 
            metalness={0.9} 
            roughness={0.1}
            emissive="#000066"
            emissiveIntensity={0.3}
          />
        </mesh>
        
        {/* Enhanced Jetpack thrusters */}
        <mesh position={[-0.1, -0.3, -0.08]}>
          <cylinderGeometry args={[0.05, 0.05, 0.2, 8]} />
          <meshStandardMaterial color="#555555" metalness={0.95} roughness={0.05} />
        </mesh>
        <mesh position={[0.1, -0.3, -0.08]}>
          <cylinderGeometry args={[0.05, 0.05, 0.2, 8]} />
          <meshStandardMaterial color="#555555" metalness={0.95} roughness={0.05} />
        </mesh>
        
        {/* Enhanced dynamic jetpack flames */}
        <mesh position={[-0.1, -0.5, -0.08]}>
          <coneGeometry args={[0.08, 0.35, 8]} />
          <meshBasicMaterial color="#4facfe" transparent opacity={0.9} />
        </mesh>
        <mesh position={[0.1, -0.5, -0.08]}>
          <coneGeometry args={[0.08, 0.35, 8]} />
          <meshBasicMaterial color="#4facfe" transparent opacity={0.9} />
        </mesh>
        
        {/* Enhanced inner flame cores */}
        <mesh position={[-0.1, -0.5, -0.08]} scale={[0.6, 1.5, 0.6]}>
          <coneGeometry args={[0.08, 0.35, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
        <mesh position={[0.1, -0.5, -0.08]} scale={[0.6, 1.5, 0.6]}>
          <coneGeometry args={[0.08, 0.35, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
      </group>
      
      {/* Enhanced Particle Trail */}
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
          size={0.8}
          transparent
          opacity={0.9}
          sizeAttenuation
          vertexColors
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      
      {/* Enhanced soft glow around astronaut */}
      <mesh>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial 
          color="#4facfe" 
          transparent 
          opacity={0.12} 
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Enhanced antenna with blinking light */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.15, 8]} />
        <meshStandardMaterial color="#ff6b6b" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.88, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial 
          ref={antennaLightMaterialRef}
          color="#ff6b6b" 
          transparent 
          opacity={0.5}
        />
      </mesh>
      
      {/* Enhanced navigation lights */}
      <mesh position={[-0.25, 0.25, 0.25]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>
      <mesh position={[0.25, 0.25, 0.25]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      
      {/* Additional detail: chest control panel */}
      <mesh position={[0, 0.2, 0.35]}>
        <boxGeometry args={[0.15, 0.1, 0.02]} />
        <meshStandardMaterial 
          color="#333333" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#4facfe"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Small indicator lights on chest panel */}
      <mesh position={[-0.04, 0.22, 0.36]}>
        <sphereGeometry args={[0.008, 6, 6]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>
      <mesh position={[0, 0.22, 0.36]}>
        <sphereGeometry args={[0.008, 6, 6]} />
        <meshBasicMaterial color="#ffff00" />
      </mesh>
      <mesh position={[0.04, 0.22, 0.36]}>
        <sphereGeometry args={[0.008, 6, 6]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
    </group>
  );
};

export default FlyingAstronaut;