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
  
  // Create enhanced star field - ONLY STARS, smaller and better distributed
  const starData = useMemo(() => {
    const count = 2500; // Optimized count
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Better distribution in a huge sphere
      const radius = 80 + Math.random() * 150;
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
      
      // Much smaller star sizes
      sizes[i] = Math.random() * 0.8 + 0.1;
    }
    
    return { positions, colors, sizes };
  }, []);
  
  // Create distant background stars - even smaller
  const distantStarData = useMemo(() => {
    const count = 1500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Very distant stars
      const radius = 250 + Math.random() * 300;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Dimmer distant stars
      const color = new THREE.Color('#ffffff');
      colors[i3] = color.r * 0.3;
      colors[i3 + 1] = color.g * 0.3;
      colors[i3 + 2] = color.b * 0.3;
      
      sizes[i] = Math.random() * 0.3 + 0.05;
    }
    
    return { positions, colors, sizes };
  }, []);
  
  // Create beautiful nebula clouds - smaller and more subtle
  const nebulaData = useMemo(() => {
    const count = 300;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Create multiple nebula clusters
      const cluster = Math.floor(Math.random() * 4);
      const clusterCenters = [
        { x: 40, y: 25, z: -80 },   // Blue nebula
        { x: -50, y: -20, z: -90 }, // Purple nebula
        { x: 35, y: -35, z: -85 },  // Pink nebula
        { x: -40, y: 30, z: -75 }   // Cyan nebula
      ];
      
      const center = clusterCenters[cluster];
      positions[i3] = center.x + (Math.random() - 0.5) * 25;
      positions[i3 + 1] = center.y + (Math.random() - 0.5) * 25;
      positions[i3 + 2] = center.z + (Math.random() - 0.5) * 25;
      
      // Beautiful nebula colors
      const nebulaColors = [
        new THREE.Color('#4facfe'), // Blue
        new THREE.Color('#9c88ff'), // Purple
        new THREE.Color('#ff9ff3'), // Pink
        new THREE.Color('#0abde3')  // Cyan
      ];
      
      const color = nebulaColors[cluster];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      sizes[i] = Math.random() * 2 + 0.5;
    }
    
    return { positions, colors, sizes };
  }, []);
  
  // Create distant galaxy - smaller and more subtle
  const galaxyData = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Spiral galaxy pattern
      const angle = (i / count) * Math.PI * 6; // 3 spiral arms
      const radius = (i / count) * 20 + 3;
      const spiralOffset = Math.sin(angle * 2) * 2;
      
      positions[i3] = Math.cos(angle) * radius + spiralOffset + 70;
      positions[i3 + 1] = (Math.random() - 0.5) * 3 - 25;
      positions[i3 + 2] = Math.sin(angle) * radius + spiralOffset - 120;
      
      // Galaxy colors
      const color = new THREE.Color().setHSL(0.6 + Math.random() * 0.2, 0.7, 0.5);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      sizes[i] = Math.random() * 0.5 + 0.1;
    }
    
    return { positions, colors, sizes };
  }, []);
  
  // Create asteroid belt
  const asteroidData = useMemo(() => {
    const asteroids = [];
    for (let i = 0; i < 40; i++) {
      const angle = (i / 40) * Math.PI * 2;
      const radius = 25 + Math.random() * 6;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 3;
      
      asteroids.push({
        position: [x, y, z],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        scale: Math.random() * 0.3 + 0.08,
        speed: Math.random() * 0.006 + 0.002
      });
    }
    return asteroids;
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Animate black hole
    if (blackHoleRef.current) {
      blackHoleRef.current.rotation.z += 0.01;
      
      // Subtle pulsing effect
      const scale = 1 + Math.sin(time * 1.2) * 0.1;
      blackHoleRef.current.scale.setScalar(scale);
    }
    
    // Animate asteroid belt
    if (asteroidBeltRef.current) {
      asteroidBeltRef.current.rotation.y += 0.001;
      
      asteroidBeltRef.current.children.forEach((asteroid, index) => {
        asteroid.rotation.x += asteroidData[index].speed;
        asteroid.rotation.y += asteroidData[index].speed * 0.7;
        asteroid.rotation.z += asteroidData[index].speed * 0.5;
      });
    }
    
    // Animate stars - subtle twinkling
    if (starsRef.current) {
      const material = starsRef.current.material as THREE.PointsMaterial;
      material.opacity = 0.7 + Math.sin(time * 0.3) * 0.1;
      starsRef.current.rotation.y += 0.00005;
    }
    
    // Animate distant stars
    if (distantStarsRef.current) {
      distantStarsRef.current.rotation.y += 0.00002;
      const material = distantStarsRef.current.material as THREE.PointsMaterial;
      material.opacity = 0.3 + Math.sin(time * 0.2) * 0.05;
    }
    
    // Animate nebula
    if (nebulaRef.current) {
      nebulaRef.current.rotation.y += 0.0002;
      nebulaRef.current.rotation.x += 0.00008;
      const material = nebulaRef.current.material as THREE.PointsMaterial;
      material.opacity = 0.2 + Math.sin(time * 0.3) * 0.1;
    }
    
    // Animate galaxy
    if (galaxyRef.current) {
      galaxyRef.current.rotation.z += 0.0001;
      const material = galaxyRef.current.material as THREE.PointsMaterial;
      material.opacity = 0.4 + Math.sin(time * 0.4) * 0.15;
    }
  });

  return (
    <>
      {/* Main Star Field - Smaller and Better */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2500}
            array={starData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={2500}
            array={starData.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={2500}
            array={starData.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.6}
          transparent
          opacity={0.7}
          sizeAttenuation
          vertexColors
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      
      {/* Distant Background Stars - Even Smaller */}
      <points ref={distantStarsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={1500}
            array={distantStarData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={1500}
            array={distantStarData.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={1500}
            array={distantStarData.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.3}
          transparent
          opacity={0.3}
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
            count={300}
            array={nebulaData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={300}
            array={nebulaData.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={300}
            array={nebulaData.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1.5}
          transparent
          opacity={0.2}
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
            count={500}
            array={galaxyData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={500}
            array={galaxyData.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={500}
            array={galaxyData.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.8}
          transparent
          opacity={0.4}
          sizeAttenuation
          vertexColors
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      
      {/* Black Hole - More Subtle */}
      <group ref={blackHoleRef} position={[-60, 15, -120]}>
        {/* Event Horizon */}
        <mesh>
          <sphereGeometry args={[2, 32, 32]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        
        {/* Accretion Disk - More Subtle */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.5, 6, 64]} />
          <meshBasicMaterial 
            color="#ff6b6b" 
            transparent 
            opacity={0.6} 
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Outer Disk */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[6.5, 9, 64]} />
          <meshBasicMaterial 
            color="#ffaa00" 
            transparent 
            opacity={0.3} 
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Gravitational Lensing Effect */}
        <mesh>
          <sphereGeometry args={[10, 32, 32]} />
          <meshBasicMaterial 
            color="#4facfe" 
            transparent 
            opacity={0.05} 
            side={THREE.BackSide}
          />
        </mesh>
      </group>
      
      {/* Asteroid Belt - Smaller */}
      <group ref={asteroidBeltRef}>
        {asteroidData.map((asteroid, index) => (
          <mesh 
            key={index}
            position={asteroid.position}
            rotation={asteroid.rotation}
            scale={asteroid.scale}
          >
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial 
              color="#8B7355" 
              roughness={0.9} 
              metalness={0.1} 
              emissive="#4a3728"
              emissiveIntensity={0.05}
            />
          </mesh>
        ))}
      </group>
      
      {/* Pulsar - More Subtle */}
      <group position={[45, 60, -140]}>
        <mesh>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Subtle Pulsar beams */}
        <mesh rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 30, 8]} />
          <meshBasicMaterial 
            color="#00ffff" 
            transparent 
            opacity={0.5} 
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 30, 8]} />
          <meshBasicMaterial 
            color="#00ffff" 
            transparent 
            opacity={0.5} 
          />
        </mesh>
      </group>
      
      {/* Wormhole - More Subtle */}
      <group position={[70, -40, -150]}>
        <mesh>
          <torusGeometry args={[3, 1, 16, 32]} />
          <meshBasicMaterial 
            color="#9c88ff" 
            transparent 
            opacity={0.4} 
          />
        </mesh>
        <mesh>
          <torusGeometry args={[4.5, 0.6, 16, 32]} />
          <meshBasicMaterial 
            color="#ff9ff3" 
            transparent 
            opacity={0.2} 
          />
        </mesh>
      </group>
      
      {/* Comet - Smaller */}
      <group position={[-70, 30, -100]}>
        <mesh>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Comet tail */}
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <coneGeometry args={[0.8, 12, 8]} />
          <meshBasicMaterial 
            color="#87ceeb" 
            transparent 
            opacity={0.4} 
          />
        </mesh>
      </group>
    </>
  );
};

export default SpaceObjects;