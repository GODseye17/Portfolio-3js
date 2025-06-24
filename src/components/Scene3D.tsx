import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

const Scene3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const objectsRef = useRef<THREE.Object3D[]>([]);
  const particlesRef = useRef<THREE.Points>();
  const clockRef = useRef(new THREE.Clock());
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const targetRef = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: false
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    camera.position.z = 50;

    // Create floating geometric objects
    const geometries = [
      new THREE.IcosahedronGeometry(1.5, 0),
      new THREE.OctahedronGeometry(1.5, 0),
      new THREE.TetrahedronGeometry(1.5, 0),
      new THREE.TorusKnotGeometry(1, 0.3, 64, 8, 2, 3)
    ];

    // Create custom shader material
    const customMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0x00ffff) },
        opacity: { value: 0.6 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          vUv = uv;
          vPosition = position;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        uniform float opacity;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          float pulse = sin(time * 2.0) * 0.1 + 0.9;
          float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          vec3 finalColor = mix(color, vec3(1.0), fresnel * 0.5);
          
          gl_FragColor = vec4(finalColor * pulse, opacity * (0.5 + fresnel * 0.5));
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      wireframe: false
    });

    // Create objects
    for (let i = 0; i < 12; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = customMaterial.clone();
      
      // Randomize colors
      const hue = Math.random();
      const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
      material.uniforms.color.value = color;
      
      const mesh = new THREE.Mesh(geometry, material);

      mesh.position.set(
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 80
      );

      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      mesh.scale.setScalar(Math.random() * 1.5 + 0.5);

      scene.add(mesh);
      objectsRef.current.push(mesh);

      // Animate objects
      gsap.to(mesh.rotation, {
        x: mesh.rotation.x + Math.PI * 2,
        y: mesh.rotation.y + Math.PI * 2,
        duration: 20 + Math.random() * 20,
        repeat: -1,
        ease: "none"
      });

      gsap.to(mesh.position, {
        x: mesh.position.x + (Math.random() - 0.5) * 20,
        y: mesh.position.y + (Math.random() - 0.5) * 20,
        z: mesh.position.z + (Math.random() - 0.5) * 20,
        duration: 15 + Math.random() * 15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }

    // Create particle system
    const particleCount = 2000;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Position
      positions[i] = (Math.random() - 0.5) * 200;
      positions[i + 1] = (Math.random() - 0.5) * 200;
      positions[i + 2] = (Math.random() - 0.5) * 200;

      // Color
      const hue = Math.random();
      const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;

      // Size
      sizes[i / 3] = Math.random() * 2;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      vertexShader: `
        attribute float size;
        uniform float time;
        uniform float pixelRatio;
        varying vec3 vColor;
        
        void main() {
          vColor = color;
          vec3 pos = position;
          
          // Subtle movement
          pos.x += sin(time * 0.2 + position.z * 0.05) * 2.0;
          pos.y += cos(time * 0.2 + position.x * 0.05) * 2.0;
          pos.z += sin(time * 0.2 + position.y * 0.05) * 2.0;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          // Circular point
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          // Soft edge
          float alpha = 1.0 - smoothstep(0.4, 0.5, dist);
          gl_FragColor = vec4(vColor, alpha * 0.6);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
    particlesRef.current = particleSystem;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x00ffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xff6b6b, 0.5, 100);
    pointLight.position.set(-10, -10, -5);
    scene.add(pointLight);

    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    // Touch interaction
    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        mouseRef.current.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    // Scroll interaction
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollProgress = scrollY / (document.body.scrollHeight - window.innerHeight);

      // Rotate entire scene based on scroll
      if (sceneRef.current) {
        sceneRef.current.rotation.y = scrollProgress * Math.PI * 0.5;
        sceneRef.current.rotation.x = scrollProgress * Math.PI * 0.1;
      }

      // Move objects based on scroll
      objectsRef.current.forEach((obj, index) => {
        obj.position.z = Math.sin(scrollProgress * Math.PI * 2 + index) * 20;
      });
    };

    window.addEventListener('scroll', handleScroll);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      const delta = clockRef.current.getDelta();
      const elapsedTime = clockRef.current.getElapsedTime();

      // Update shader uniforms
      objectsRef.current.forEach(obj => {
        if (obj.material instanceof THREE.ShaderMaterial) {
          obj.material.uniforms.time.value = elapsedTime;
        }
      });

      if (particlesRef.current && particlesRef.current.material instanceof THREE.ShaderMaterial) {
        particlesRef.current.material.uniforms.time.value = elapsedTime;
      }

      // Smooth camera movement following mouse
      targetRef.current.x = mouseRef.current.x * 10;
      targetRef.current.y = mouseRef.current.y * 10;
      
      if (cameraRef.current) {
        cameraRef.current.position.x += (targetRef.current.x - cameraRef.current.position.x) * 0.05;
        cameraRef.current.position.y += (targetRef.current.y - cameraRef.current.position.y) * 0.05;
        cameraRef.current.lookAt(0, 0, 0);
      }

      // Rotate particles
      if (particlesRef.current) {
        particlesRef.current.rotation.y += delta * 0.05;
        particlesRef.current.rotation.x += delta * 0.025;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        if (particlesRef.current && particlesRef.current.material instanceof THREE.ShaderMaterial) {
          particlesRef.current.material.uniforms.pixelRatio.value = Math.min(window.devicePixelRatio, 2);
        }
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Dispose of all geometries and materials
      objectsRef.current.forEach(obj => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (obj.material instanceof THREE.Material) {
            obj.material.dispose();
          }
        }
      });
      
      if (particlesRef.current) {
        particlesRef.current.geometry.dispose();
        if (particlesRef.current.material instanceof THREE.Material) {
          particlesRef.current.material.dispose();
        }
      }
      
      rendererRef.current?.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ 
        background: 'radial-gradient(circle at center, rgba(10,10,20,1) 0%, rgba(0,0,0,1) 70%)'
      }}
    />
  );
};

export default Scene3D;