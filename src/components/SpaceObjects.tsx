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
  
  // Create massive star field - ONLY STARS, no rectangles
  const starData = useMemo(() => {
    const count = 3000; // More stars
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Distribute stars in a huge sphere
      const radius = 100 + Math.random() * 200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Realistic star colors
      const starType = Math.random();
      let color;
      if (starType < 0.5) {
        color = new THREE.Color('#ffffff'); // White stars
      } else if (starType < 0.7) {
        color = new THREE.Color('#87ceeb'); // Blue giants
      } else if (starType < 0.85) {
        color = new THREE.Color('#ffff99'); // Yellow stars
      } else if (starType < 0.95) {
        color = new THREE.Color('#ff6b6b'); // Red giants
      } else {
        color = new THREE.Color('#ff9ff3'); // Pink stars
      }
      
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      // Varied star sizes
      sizes[i] = Math.random() * 1.5 + 0.2;
    }
    
    return { positions, colors, sizes };
  }, []);
  
  // Create distant background stars
  const distantStarData = useMemo(() => {
    const count = 2000;
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
      colors[i3] = color.r * 0.4;
      colors[i3 + 1] = color.g * 0.4;
      colors[i3 + 2] = color.b * 0.4;
      
      sizes[i] = Math.random() * 0.5 + 0.1;
    }
    
    return { positions, colors, sizes };
  }, []);
  
  // Create beautiful nebula clouds
  const nebulaData = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Create multiple nebula clusters
      const cluster = Math.floor(Math.random() * 6);
      const clusterCenters = [
        { x: 40, y: 25, z: -60 },   // Blue nebula
        { x: -50, y: -20, z: -80 }, // Purple nebula
        { x: 35, y: -35, z: -70 },  // Pink nebula
        { x: -40, y: 30, z: -65 },  // Cyan nebula
        { x: 60, y: 0, z: -90 },    // Green nebula
        { x: -30, y: -40, z: -75 }  // Orange nebula
      ];
      
      const center = clusterCenters[cluster];
      positions[i3] = center.x + (Math.random() - 0.5) * 30;
      positions[i3 + 1] = center.y + (Math.random() - 0.5) * 30;
      positions[i3 + 2] = center.z + (Math.random() - 0.5) * 30;
      
      // Beautiful nebula colors
      const nebulaColors = [
        new THREE.Color('#4facfe'), // Blue
        new THREE.Color('#9c88ff'), // Purple
        new THREE.Color('#ff9ff3'), // Pink
        new THREE.Color('#0abde3'), // Cyan
        new THREE.Color('#32cd32'), // Green
        new THREE.Color('#ff6b35')  // Orange
      ];
      
      const color = nebulaColors[cluster];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      sizes[i] = Math.random() * 4 + 1;
    }
    
    return { positions, colors, sizes };
  }, []);
  
  // Create distant galaxy
  const galaxyData = useMemo(() => {
    const count = 800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Spiral galaxy pattern
      const angle = (i / count) * Math.PI * 8; // 4 spiral arms
      const radius = (i / count) * 25 + 5;
      const spiralOffset = Math.sin(angle * 2) * 3;
      
      positions[i3] = Math.cos(angle) * radius + spiralOffset + 80;
      positions[i3 + 1] = (Math.random() - 0.5) * 4 - 30;
      positions[i3 + 2] = Math.sin(angle) * radius + spiralOffset - 150;
      
      // Galaxy colors
      const color = new THREE.Color().setHSL(0.6 + Math.random() * 0.2, 0.8, 0.6);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      sizes[i] = Math.random() * 0.8 + 0.2;
    }
    
    return { positions, colors, sizes };
  }, []);
  
  // Create asteroid belt
  const asteroidData = useMemo(() => {
    const asteroids = [];
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2;
      const radius = 25 + Math.random() * 8;
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
      
      // Pulsing effect
      const scale = 1 + Math.sin(time * 1.5) * 0.15;
      blackHoleRef.current.scale.setScalar(scale);
    }
    
    // Animate asteroid belt
    if (asteroidBeltRef.current) {
      asteroidBeltRef.current.rotation.y += 0.002;
      
      asteroidBeltRef.current.children.forEach((asteroid, index) => {
        asteroid.rotation.x += asteroidData[index].speed;
        asteroid.rotation.y += asteroidData[index].speed * 0.7;
        asteroid.rotation.z += asteroidData[index].speed * 0.5;
      });
    }
    
    // Animate stars - beautiful twinkling
    if (starsRef.current) {
      const material = starsRef.current.material as THREE.PointsMaterial;
      material.opacity = 0.8 + Math.sin(time * 0.5) * 0.2;
      starsRef.current.rotation.y += 0.0001;
    }
    
    // Animate distant stars
    if (distantStarsRef.current) {
      distantStarsRef.current.rotation.y += 0.00005;
      const material = distantStarsRef.current.material as THREE.PointsMaterial;
      material.opacity = 0.4 + Math.sin(time * 0.3) * 0.1;
    }
    
    // Animate nebula
    if (nebulaRef.current) {
      nebulaRef.current.rotation.y += 0.0003;
      nebulaRef.current.rotation.x += 0.0001;
      const material = nebulaRef.current.material as THREE.PointsMaterial;
      material.opacity = 0.3 + Math.sin(time * 0.4) * 0.15;
    }
    
    // Animate galaxy
    if (galaxyRef.current) {
      galaxyRef.current.rotation.z += 0.0002;
      const material = galaxyRef.current.material as THREE.PointsMaterial;
      material.opacity = 0.6 + Math.sin(time * 0.6) * 0.2;
    }
  });

  return (
    <>
      {/* Main Star Field - Beautiful and Visible */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={3000}
            array={starData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={3000}
            array={starData.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={3000}
            array={starData.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1}
          transparent
          opacity={0.8}
          sizeAttenuation
          vertexColors
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      
      {/* Distant Background Stars */}
      <points ref={distantStarsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2000}
            array={distantStarData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={2000}
            array={distantStarData.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={2000}
            array={distantStarData.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.6}
          transparent
          opacity={0.4}
          sizeAttenuation
          vertexColors
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      
      {/* Beautiful Nebula Clouds */}
      <points ref={nebulaRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={500}
            array={nebulaData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={500}
            array={nebulaData.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={500}
            array={nebulaData.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={3}
          transparent
          opacity={0.3}
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
            count={800}
            array={galaxyData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={800}
            array={galaxyData.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={800}
            array={galaxyData.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1.5}
          transparent
          opacity={0.6}
          sizeAttenuation
          vertexColors
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      
      {/* Enhanced Black Hole */}
      <group ref={blackHoleRef} position={[-60, 15, -100]}>
        {/* Event Horizon */}
        <mesh>
          <sphereGeometry args={[2.5, 32, 32]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        
        {/* Accretion Disk - More Visible */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3, 7, 64]} />
          <meshBasicMaterial 
            color="#ff6b6b" 
            transparent 
            opacity={0.8} 
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Outer Disk */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[7.5, 11, 64]} />
          <meshBasicMaterial 
            color="#ffaa00" 
            transparent 
            opacity={0.5} 
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Gravitational Lensing Effect */}
        <mesh>
          <sphereGeometry args={[12, 32, 32]} />
          <meshBasicMaterial 
            color="#4facfe" 
            transparent 
            opacity={0.08} 
            side={THREE.BackSide}
          />
        </mesh>
      </group>
      
      {/* Asteroid Belt - More Visible */}
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
              emissiveIntensity={0.1}
            />
          </mesh>
        ))}
      </group>
      
      {/* Pulsar - More Visible */}
      <group position={[45, 60, -120]}>
        <mesh>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Enhanced Pulsar beams */}
        <mesh rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 40, 8]} />
          <meshBasicMaterial 
            color="#00ffff" 
            transparent 
            opacity={0.8} 
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 40, 8]} />
          <meshBasicMaterial 
            color="#00ffff" 
            transparent 
            opacity={0.8} 
          />
        </mesh>
      </group>
      
      {/* Additional Space Phenomena */}
      
      {/* Wormhole */}
      <group position={[70, -40, -130]}>
        <mesh>
          <torusGeometry args={[4, 1.5, 16, 32]} />
          <meshBasicMaterial 
            color="#9c88ff" 
            transparent 
            opacity={0.6} 
          />
        </mesh>
        <mesh>
          <torusGeometry args={[6, 0.8, 16, 32]} />
          <meshBasicMaterial 
            color="#ff9ff3" 
            transparent 
            opacity={0.4} 
          />
        </mesh>
      </group>
      
      {/* Comet */}
      <group position={[-70, 30, -80]}>
        <mesh>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Comet tail */}
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <coneGeometry args={[1, 15, 8]} />
          <meshBasicMaterial 
            color="#87ceeb" 
            transparent 
            opacity={0.6} 
          />
        </mesh>
      </group>
    </>
  );
};

export default SpaceObjects;