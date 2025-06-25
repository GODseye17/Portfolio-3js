import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SpaceObjects: React.FC = () => {
  const blackHoleRef = useRef<THREE.Group>(null);
  const asteroidBeltRef = useRef<THREE.Group>(null);
  const starsRef = useRef<THREE.Points>(null);
  const distantStarsRef = useRef<THREE.Points>(null);
  const nebulaRef = useRef<THREE.Points>(null);
  const galaxyRef = useRef<THREE.Points>(null);
  
  // Create enhanced star field - ONLY CIRCULAR STARS, much smaller and better distributed
  const starData = useMemo(() => {
    const count = 2000; // Optimized count
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Better distribution in a huge sphere
      const radius = 100 + Math.random() * 200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Realistic star colors with better variety
      const starType = Math.random();
      let color;
      if (starType < 0.4) {
        color = new THREE.Color('#ffffff'); // White stars
      } else if (starType < 0.6) {
        color = new THREE.Color('#b3d9ff'); // Blue stars
      } else if (starType < 0.75) {
        color = new THREE.Color('#fff2cc'); // Yellow stars
      } else if (starType < 0.9) {
        color = new THREE.Color('#ffcccc'); // Red stars
      } else {
        color = new THREE.Color('#e6ccff'); // Purple stars
      }
      
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      // Much smaller star sizes - only circular points
      sizes[i] = Math.random() * 0.4 + 0.1;
    }
    
    return { positions, colors, sizes };
  }, []);
  
  // Create distant background stars - even smaller circular points
  const distantStarData = useMemo(() => {
    const count = 1200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Very distant stars
      const radius = 300 + Math.random() * 400;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Dimmer distant stars
      const color = new THREE.Color('#ffffff');
      colors[i3] = color.r * 0.2;
      colors[i3 + 1] = color.g * 0.2;
      colors[i3 + 2] = color.b * 0.2;
      
      sizes[i] = Math.random() * 0.2 + 0.05;
    }
    
    return { positions, colors, sizes };
  }, []);
  
  // Create beautiful nebula clouds - smaller and more subtle
  const nebulaData = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Create multiple nebula clusters
      const cluster = Math.floor(Math.random() * 3);
      const clusterCenters = [
        { x: 50, y: 30, z: -100 },   // Blue nebula
        { x: -60, y: -25, z: -120 }, // Purple nebula
        { x: 40, y: -40, z: -110 }   // Pink nebula
      ];
      
      const center = clusterCenters[cluster];
      positions[i3] = center.x + (Math.random() - 0.5) * 30;
      positions[i3 + 1] = center.y + (Math.random() - 0.5) * 30;
      positions[i3 + 2] = center.z + (Math.random() - 0.5) * 30;
      
      // Beautiful nebula colors
      const nebulaColors = [
        new THREE.Color('#4facfe'), // Blue
        new THREE.Color('#9c88ff'), // Purple
        new THREE.Color('#ff9ff3')  // Pink
      ];
      
      const color = nebulaColors[cluster];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      sizes[i] = Math.random() * 1.5 + 0.3;
    }
    
    return { positions, colors, sizes };
  }, []);
  
  // Create distant galaxy - smaller and more subtle
  const galaxyData = useMemo(() => {
    const count = 400;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Spiral galaxy pattern
      const angle = (i / count) * Math.PI * 8; // 4 spiral arms
      const radius = (i / count) * 25 + 5;
      const spiralOffset = Math.sin(angle * 3) * 3;
      
      positions[i3] = Math.cos(angle) * radius + spiralOffset + 80;
      positions[i3 + 1] = (Math.random() - 0.5) * 4 - 30;
      positions[i3 + 2] = Math.sin(angle) * radius + spiralOffset - 150;
      
      // Galaxy colors
      const color = new THREE.Color().setHSL(0.6 + Math.random() * 0.2, 0.8, 0.6);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      sizes[i] = Math.random() * 0.3 + 0.05;
    }
    
    return { positions, colors, sizes };
  }, []);
  
  // Create asteroid belt
  const asteroidData = useMemo(() => {
    const asteroids = [];
    for (let i = 0; i < 50; i++) {
      const angle = (i / 50) * Math.PI * 2;
      const radius = 28 + Math.random() * 8;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 4;
      
      asteroids.push({
        position: [x, y, z],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        scale: Math.random() * 0.4 + 0.1,
        speed: Math.random() * 0.008 + 0.003
      });
    }
    return asteroids;
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Animate black hole
    if (blackHoleRef.current) {
      blackHoleRef.current.rotation.z += 0.015;
      
      // Subtle pulsing effect
      const scale = 1 + Math.sin(time * 1.5) * 0.15;
      blackHoleRef.current.scale.setScalar(scale);
    }
    
    // Animate asteroid belt
    if (asteroidBeltRef.current) {
      asteroidBeltRef.current.rotation.y += 0.002;
      
      asteroidBeltRef.current.children.forEach((asteroid, index) => {
        asteroid.rotation.x += asteroidData[index].speed;
        asteroid.rotation.y += asteroidData[index].speed * 0.8;
        asteroid.rotation.z += asteroidData[index].speed * 0.6;
      });
    }
    
    // Animate stars - subtle twinkling, ONLY circular points with debugging
    if (starsRef.current) {
      // DEBUG: Check stars material
      if (!starsRef.current.material) {
        console.warn('Stars material is null/undefined');
      } else {
        const material = starsRef.current.material as THREE.PointsMaterial;
        
        if ('uniforms' in material) {
          console.log('Stars material has uniforms:', material.uniforms);
          
          if (material.uniforms) {
            Object.keys(material.uniforms).forEach(uniformName => {
              const uniform = material.uniforms[uniformName];
              if (!uniform) {
                console.error(`Stars uniform '${uniformName}' is undefined`);
              } else if (uniform.value === undefined) {
                console.error(`Stars uniform '${uniformName}'.value is undefined`);
              }
            });
          }
        }
        
        // Safely set opacity
        try {
          if ('opacity' in material) {
            material.opacity = 0.8 + Math.sin(time * 0.4) * 0.15;
          }
        } catch (error) {
          console.error('Error setting stars opacity:', error);
        }
      }
      
      starsRef.current.rotation.y += 0.00008;
    }
    
    // Animate distant stars with debugging
    if (distantStarsRef.current) {
      // DEBUG: Check distant stars material
      if (!distantStarsRef.current.material) {
        console.warn('Distant stars material is null/undefined');
      } else {
        const material = distantStarsRef.current.material as THREE.PointsMaterial;
        
        if ('uniforms' in material) {
          console.log('Distant stars material has uniforms:', material.uniforms);
          
          if (material.uniforms) {
            Object.keys(material.uniforms).forEach(uniformName => {
              const uniform = material.uniforms[uniformName];
              if (!uniform) {
                console.error(`Distant stars uniform '${uniformName}' is undefined`);
              } else if (uniform.value === undefined) {
                console.error(`Distant stars uniform '${uniformName}'.value is undefined`);
              }
            });
          }
        }
        
        // Safely set opacity
        try {
          if ('opacity' in material) {
            material.opacity = 0.2 + Math.sin(time * 0.25) * 0.08;
          }
        } catch (error) {
          console.error('Error setting distant stars opacity:', error);
        }
      }
      
      distantStarsRef.current.rotation.y += 0.00003;
    }
    
    // Animate nebula with debugging
    if (nebulaRef.current) {
      // DEBUG: Check nebula material
      if (!nebulaRef.current.material) {
        console.warn('Nebula material is null/undefined');
      } else {
        const material = nebulaRef.current.material as THREE.PointsMaterial;
        
        if ('uniforms' in material) {
          console.log('Nebula material has uniforms:', material.uniforms);
          
          if (material.uniforms) {
            Object.keys(material.uniforms).forEach(uniformName => {
              const uniform = material.uniforms[uniformName];
              if (!uniform) {
                console.error(`Nebula uniform '${uniformName}' is undefined`);
              } else if (uniform.value === undefined) {
                console.error(`Nebula uniform '${uniformName}'.value is undefined`);
              }
            });
          }
        }
        
        // Safely set opacity
        try {
          if ('opacity' in material) {
            material.opacity = 0.25 + Math.sin(time * 0.4) * 0.15;
          }
        } catch (error) {
          console.error('Error setting nebula opacity:', error);
        }
      }
      
      nebulaRef.current.rotation.y += 0.0003;
      nebulaRef.current.rotation.x += 0.0001;
    }
    
    // Animate galaxy with debugging
    if (galaxyRef.current) {
      // DEBUG: Check galaxy material
      if (!galaxyRef.current.material) {
        console.warn('Galaxy material is null/undefined');
      } else {
        const material = galaxyRef.current.material as THREE.PointsMaterial;
        
        if ('uniforms' in material) {
          console.log('Galaxy material has uniforms:', material.uniforms);
          
          if (material.uniforms) {
            Object.keys(material.uniforms).forEach(uniformName => {
              const uniform = material.uniforms[uniformName];
              if (!uniform) {
                console.error(`Galaxy uniform '${uniformName}' is undefined`);
              } else if (uniform.value === undefined) {
                console.error(`Galaxy uniform '${uniformName}'.value is undefined`);
              }
            });
          }
        }
        
        // Safely set opacity
        try {
          if ('opacity' in material) {
            material.opacity = 0.5 + Math.sin(time * 0.5) * 0.2;
          }
        } catch (error) {
          console.error('Error setting galaxy opacity:', error);
        }
      }
      
      galaxyRef.current.rotation.z += 0.0002;
    }
  });

  return (
    <>
      {/* Main Star Field - Smaller circular points only */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2000}
            array={starData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={2000}
            array={starData.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={2000}
            array={starData.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.4}
          transparent
          opacity={0.8}
          sizeAttenuation
          vertexColors
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      
      {/* Distant Background Stars - Even smaller circular points */}
      <points ref={distantStarsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={1200}
            array={distantStarData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={1200}
            array={distantStarData.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={1200}
            array={distantStarData.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.2}
          transparent
          opacity={0.2}
          sizeAttenuation
          vertexColors
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      
      {/* Subtle Nebula Clouds */}
      <points ref={nebulaRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={200}
            array={nebulaData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={200}
            array={nebulaData.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={200}
            array={nebulaData.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1.2}
          transparent
          opacity={0.25}
          sizeAttenuation
          vertexColors
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      
      {/* Distant Spiral Galaxy */}
      <points ref={galaxyRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={400}
            array={galaxyData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={400}
            array={galaxyData.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={400}
            array={galaxyData.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.6}
          transparent
          opacity={0.5}
          sizeAttenuation
          vertexColors
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      
      {/* Black Hole - More Subtle */}
      <group ref={blackHoleRef} position={[-70, 20, -140]}>
        {/* Event Horizon */}
        <mesh>
          <sphereGeometry args={[2.5, 32, 32]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        
        {/* Accretion Disk - More Subtle */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3, 7, 64]} />
          <meshBasicMaterial 
            color="#ff6b6b" 
            transparent 
            opacity={0.7} 
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Outer Disk */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[7.5, 11, 64]} />
          <meshBasicMaterial 
            color="#ffaa00" 
            transparent 
            opacity={0.4} 
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Gravitational Lensing Effect */}
        <mesh>
          <sphereGeometry args={[12, 32, 32]} />
          <meshBasicMaterial 
            color="#4facfe" 
            transparent 
            opacity={0.06} 
            side={THREE.BackSide}
          />
        </mesh>
      </group>
      
      {/* Enhanced Asteroid Belt */}
      <group ref={asteroidBeltRef}>
        {asteroidData.map((asteroid, index) => (
          <mesh 
            key={index}
            position={asteroid.position}
            rotation={asteroid.rotation}
            scale={asteroid.scale}
          >
            <dodecahedronGeometry args={[1, 1]} />
            <meshStandardMaterial 
              color="#8B7355" 
              roughness={0.95} 
              metalness={0.05} 
              emissive="#3a2f28"
              emissiveIntensity={0.08}
            />
          </mesh>
        ))}
      </group>
      
      {/* Enhanced Pulsar */}
      <group position={[50, 70, -160]}>
        <mesh>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshBasicMaterial 
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.5}
          />
        </mesh>
        {/* Pulsar beams */}
        <mesh rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 40, 8]} />
          <meshBasicMaterial 
            color="#00ffff" 
            transparent 
            opacity={0.6} 
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 40, 8]} />
          <meshBasicMaterial 
            color="#00ffff" 
            transparent 
            opacity={0.6} 
          />
        </mesh>
      </group>
      
      {/* Enhanced Wormhole */}
      <group position={[80, -50, -180]}>
        <mesh>
          <torusGeometry args={[4, 1.5, 16, 32]} />
          <meshBasicMaterial 
            color="#9c88ff" 
            transparent 
            opacity={0.5} 
          />
        </mesh>
        <mesh>
          <torusGeometry args={[6, 1, 16, 32]} />
          <meshBasicMaterial 
            color="#ff9ff3" 
            transparent 
            opacity={0.3} 
          />
        </mesh>
      </group>
      
      {/* Enhanced Comet */}
      <group position={[-80, 40, -120]}>
        <mesh>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshBasicMaterial 
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.3}
          />
        </mesh>
        {/* Comet tail */}
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <coneGeometry args={[1.2, 18, 8]} />
          <meshBasicMaterial 
            color="#87ceeb" 
            transparent 
            opacity={0.5} 
          />
        </mesh>
      </group>
    </>
  );
};

export default SpaceObjects;