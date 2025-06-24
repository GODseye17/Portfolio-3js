import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export const Rocket = () => {
  const rocketRef = useRef<THREE.Group>(null);
  
  useFrame(({ camera }) => {
    if (rocketRef.current) {
      // Position the rocket slightly ahead of the camera
      const targetPosition = new THREE.Vector3();
      camera.getWorldPosition(targetPosition);
      
      // Calculate direction vector
      const direction = new THREE.Vector3(0, 0, -1);
      direction.applyQuaternion(camera.quaternion);
      
      // Position rocket in front of camera
      targetPosition.add(direction.multiplyScalar(5));
      
      // Smoothly move rocket
      rocketRef.current.position.lerp(targetPosition, 0.1);
      
      // Make rocket face the direction of travel
      rocketRef.current.lookAt(
        targetPosition.x + direction.x,
        targetPosition.y + direction.y,
        targetPosition.z + direction.z
      );
      
      // Add some wobble
      rocketRef.current.rotation.z = Math.sin(Date.now() * 0.003) * 0.1;
    }
  });

  return (
    <group ref={rocketRef}>
      <mesh>
        <coneGeometry args={[0.5, 2, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 1, 16]} />
        <meshStandardMaterial color="#ff4757" />
      </mesh>
      <mesh position={[0, -2, 0]}>
        <coneGeometry args={[0.5, 0.5, 16]} rotation={[Math.PI, 0, 0]} />
        <meshStandardMaterial color="#2f3542" />
      </mesh>
      
      {/* Fins */}
      {[0, Math.PI/2, Math.PI, Math.PI*1.5].map((rotation, i) => (
        <mesh key={i} position={[0, -1.5, 0]} rotation={[0, rotation, 0]}>
          <boxGeometry args={[0.1, 0.8, 0.8]} />
          <meshStandardMaterial color="#ff6b81" />
        </mesh>
      ))}
      
      {/* Rocket window */}
      <mesh position={[0, -1, 0.4]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#70a1ff" emissive="#70a1ff" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
};

export const RocketSmoke = () => {
  const particles = useRef<THREE.Points>(null);
  const particlesCount = 100;
  
  // Create particles
  const positions = new Float32Array(particlesCount * 3);
  const scales = new Float32Array(particlesCount);
  
  for (let i = 0; i < particlesCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 0.5;
    positions[i3 + 1] = -2 - Math.random() * 2;
    positions[i3 + 2] = (Math.random() - 0.5) * 0.5;
    scales[i] = Math.random() * 0.5 + 0.1;
  }
  
  useFrame(({ camera }) => {
    if (particles.current) {
      // Position smoke behind the rocket
      const targetPosition = new THREE.Vector3();
      camera.getWorldPosition(targetPosition);
      
      // Calculate direction vector
      const direction = new THREE.Vector3(0, 0, -1);
      direction.applyQuaternion(camera.quaternion);
      
      // Position smoke behind rocket
      targetPosition.add(direction.multiplyScalar(5));
      
      // Update particle positions
      const positions = particles.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        
        // Move particles down
        positions[i3 + 1] -= 0.05;
        
        // Reset particles that go too far
        if (positions[i3 + 1] < -4) {
          positions[i3] = (Math.random() - 0.5) * 0.5 + targetPosition.x;
          positions[i3 + 1] = -2 + targetPosition.y;
          positions[i3 + 2] = (Math.random() - 0.5) * 0.5 + targetPosition.z;
        }
      }
      
      particles.current.geometry.attributes.position.needsUpdate = true;
      
      // Move smoke with rocket
      particles.current.position.lerp(targetPosition, 0.1);
    }
  });
  
  return (
    <points ref={particles}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-scale"
          count={particlesCount}
          array={scales}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        color="#ffffff"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
};