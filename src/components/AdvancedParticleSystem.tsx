import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AdvancedParticleSystemProps {
  count?: number;
  isTransitioning?: boolean;
}

const AdvancedParticleSystem: React.FC<AdvancedParticleSystemProps> = ({ 
  count = 800, // Reduced count for better performance
  isTransitioning = false 
}) => {
  const particlesRef = useRef<THREE.Points>(null);
  const nebulaRef = useRef<THREE.Points>(null);
  
  const { positions, colors, sizes, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Smaller, more contained positions
      positions[i3] = (Math.random() - 0.5) * 80;
      positions[i3 + 1] = (Math.random() - 0.5) * 80;
      positions[i3 + 2] = (Math.random() - 0.5) * 80;
      
      // Slower velocities
      velocities[i3] = (Math.random() - 0.5) * 0.002;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.002;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.002;
      
      // Simple color palette
      const colorType = Math.random();
      let color;
      if (colorType < 0.5) {
        color = new THREE.Color().setHSL(0.6, 0.7, 0.6); // Blue
      } else {
        color = new THREE.Color().setHSL(0.8, 0.8, 0.7); // Purple
      }
      
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      // Smaller sizes
      sizes[i] = Math.random() * 0.5 + 0.1;
    }
    
    return { positions, colors, sizes, velocities };
  }, [count]);
  
  // Simple nebula clouds
  const nebulaData = useMemo(() => {
    const nebulaCount = 100; // Much smaller
    const positions = new Float32Array(nebulaCount * 3);
    const colors = new Float32Array(nebulaCount * 3);
    const sizes = new Float32Array(nebulaCount);
    
    for (let i = 0; i < nebulaCount; i++) {
      const i3 = i * 3;
      
      // Two simple clusters
      const cluster = Math.floor(Math.random() * 2);
      const clusterCenters = [
        { x: 20, y: 10, z: -40 },
        { x: -25, y: -12, z: -50 }
      ];
      
      const center = clusterCenters[cluster];
      positions[i3] = center.x + (Math.random() - 0.5) * 15;
      positions[i3 + 1] = center.y + (Math.random() - 0.5) * 15;
      positions[i3 + 2] = center.z + (Math.random() - 0.5) * 15;
      
      // Simple colors
      const nebulaColors = [
        new THREE.Color('#4facfe'),
        new THREE.Color('#9c88ff')
      ];
      
      const color = nebulaColors[cluster];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      sizes[i] = Math.random() * 1 + 0.2;
    }
    
    return { positions, colors, sizes };
  }, []);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Simple particle animation
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0001; // Very slow
      
      // Gentle twinkling
      const material = particlesRef.current.material as THREE.PointsMaterial;
      material.opacity = 0.2 + Math.sin(time * 0.3) * 0.05;
      
      // Minimal movement during transitions
      if (isTransitioning) {
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += velocities[i / 3 * 3] * 1;
          positions[i + 1] += velocities[i / 3 * 3 + 1] * 1;
          positions[i + 2] += velocities[i / 3 * 3 + 2] * 1;
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
    
    // Simple nebula animation
    if (nebulaRef.current) {
      nebulaRef.current.rotation.y += 0.00002;
      const material = nebulaRef.current.material as THREE.PointsMaterial;
      material.opacity = 0.1 + Math.sin(time * 0.2) * 0.03;
    }
  });
  
  return (
    <>
      {/* Main particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={count}
            array={colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={count}
            array={sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.3}
          transparent
          opacity={0.2}
          sizeAttenuation
          vertexColors
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      
      {/* Simple nebula */}
      <points ref={nebulaRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={100}
            array={nebulaData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={100}
            array={nebulaData.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={100}
            array={nebulaData.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1}
          transparent
          opacity={0.1}
          sizeAttenuation
          vertexColors
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </>
  );
};

export default AdvancedParticleSystem;