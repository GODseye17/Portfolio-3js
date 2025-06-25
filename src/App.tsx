// src/App.tsx
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import AdvancedParticleSystem from './components/AdvancedParticleSystem';
import EnhancedPlanets from './components/EnhancedPlanet';
import FlyingAstronaut from './components/FlyingAstronaut';
import SpaceObjects from './components/SpaceObjects';
import Navigation from './components/Navigation';
import ScrollIndicator from './components/ScrollIndicator';
import portfolioData from './data/portfolio.json';
import type { PortfolioData, Section, Position, Project } from './types/portfolio';
import './index.css';

import portfolioJSON from './types/portfolio';
import type { PortfolioData } from './types/portfolio';

export const portfolioData: PortfolioData = portfolioJSON as PortfolioData;

// Camera controller component
const CameraController: React.FC<{ targetPlanet: number }> = ({ targetPlanet }) => {
  const { camera } = useThree();
  const planetPositions = [
    new THREE.Vector3(0, 0, 0),         // Hero - center
    new THREE.Vector3(30, 15, -20),    // About - blue planet
    new THREE.Vector3(-25, -10, -30),   // Experience - red planet
    new THREE.Vector3(35, -20, -40),    // Skills - green planet
    new THREE.Vector3(-30, 25, -50),    // Projects - yellow planet
    new THREE.Vector3(0, -15, -60)      // Contact - purple planet
  ];

  useFrame(() => {
    const targetPosition = planetPositions[targetPlanet];
    const idealOffset = new THREE.Vector3(
      15 * Math.sin(targetPlanet * 0.5),
      10,
      20
    );
    
    const idealPosition = targetPosition.clone().add(idealOffset);
    
    // Smooth camera movement
    camera.position.lerp(idealPosition, 0.02);
    
    // Look at planet with offset for better view
    const lookAtPosition = targetPosition.clone();
    lookAtPosition.y += 2;
    camera.lookAt(lookAtPosition);
  });

  return null;
};

const App: React.FC = () => {

   const [currentSection, setCurrentSection] = useState(0);
  
  // TypeScript knows the shape of your data
  const { personalInfo, sections } = portfolioData;
  
  // When mapping sections, TypeScript knows the type
  const currentSectionData: Section = sections[currentSection];
  
  // When accessing nested data, you get autocomplete
  if (currentSectionData.positions) {
    currentSectionData.positions.forEach((position: Position) => {
      console.log(position.title); // TypeScript knows this exists
    });
  }
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Get sections from JSON data
  const { personalInfo, sections } = portfolioData;

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 1500);
  }, []);

  const handleNavigation = (index: number) => {
    if (isTransitioning || index === currentSection) return;
    
    setIsTransitioning(true);
    setCurrentSection(index);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1500);
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (isTransitioning) return;
      
      if (e.deltaY > 0 && currentSection < sections.length - 1) {
        handleNavigation(currentSection + 1);
      } else if (e.deltaY < 0 && currentSection > 0) {
        handleNavigation(currentSection - 1);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' && currentSection < sections.length - 1) {
        handleNavigation(currentSection + 1);
      } else if (e.key === 'ArrowUp' && currentSection > 0) {
        handleNavigation(currentSection - 1);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSection, isTransitioning, sections.length]);

  const renderSectionContent = (section: any) => {
    switch (section.id) {
      case 'hero':
        return (
          <>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 font-display bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              {section.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-6">
              {section.subtitle}
            </p>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              {section.content}
            </p>
            {section.highlights && (
              <div className="flex flex-wrap justify-center gap-3">
                {section.highlights.map((tech: string) => (
                  <span 
                    key={tech}
                    className="px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full border border-cyan-400/30 text-cyan-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </>
        );
        
      case 'about':
        return (
          <>
            <h2 className="text-4xl md:text-6xl font-bold mb-4 font-display text-white">
              {section.title}
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-6">
              {section.subtitle}
            </p>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              {section.content}
            </p>
            {section.stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {Object.entries(section.stats).map(([key, value]) => (
                  <div key={key} className="text-center p-4 bg-white/5 backdrop-blur-lg rounded-lg">
                    <div className="text-2xl font-bold text-cyan-400">{value}</div>
                    <div className="text-sm text-gray-400">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        );
        
      case 'experience':
        return (
          <>
            <h2 className="text-4xl md:text-6xl font-bold mb-4 font-display text-white">
              {section.title}
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-6">
              {section.subtitle}
            </p>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              {section.content}
            </p>
            {section.positions && (
              <div className="space-y-4 max-w-3xl mx-auto text-left">
                {section.positions.slice(0, 2).map((position: any, index: number) => (
                  <div 
                    key={index}
                    className="p-4 bg-white/5 backdrop-blur-lg rounded-lg border border-red-400/20"
                  >
                    <h3 className="text-xl font-bold text-red-400">{position.title}</h3>
                    <p className="text-white">{position.company} • {position.period}</p>
                    <p className="text-gray-400 text-sm mt-2">{position.description}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        );
        
      case 'skills':
        return (
          <>
            <h2 className="text-4xl md:text-6xl font-bold mb-4 font-display text-white">
              {section.title}
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-6">
              {section.subtitle}
            </p>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              {section.content}
            </p>
            {section.categories && (
              <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                {section.categories.map((category: any) => (
                  <div 
                    key={category.title}
                    className="p-4 bg-white/5 backdrop-blur-lg rounded-lg border border-green-400/20"
                  >
                    <h3 className="text-green-400 font-bold mb-2">{category.title}</h3>
                    <div className="space-y-1">
                      {category.skills.slice(0, 3).map((skill: any) => (
                        <div key={skill.name} className="flex justify-between">
                          <span className="text-sm text-gray-300">{skill.name}</span>
                          <span className="text-sm text-gray-500">{skill.level}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        );
        
      case 'projects':
        return (
          <>
            <h2 className="text-4xl md:text-6xl font-bold mb-4 font-display text-white">
              {section.title}
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-6">
              {section.subtitle}
            </p>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              {section.content}
            </p>
            {section.projects && (
              <div className="space-y-4 max-w-3xl mx-auto">
                {section.projects.filter((p: any) => p.featured).map((project: any) => (
                  <div 
                    key={project.title}
                    className="p-4 bg-gradient-to-r from-yellow-400/10 to-amber-500/10 backdrop-blur-lg rounded-lg border border-yellow-400/20"
                  >
                    <h3 className="text-yellow-400 font-bold">{project.title}</h3>
                    <p className="text-gray-300 text-sm mt-1">{project.description}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        );
        
      case 'contact':
        return (
          <>
            <h2 className="text-4xl md:text-6xl font-bold mb-4 font-display text-white">
              {section.title}
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-6">
              {section.subtitle}
            </p>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              {section.content}
            </p>
            {section.contactInfo && (
              <div className="space-y-2">
                <p className="text-gray-300">📧 {section.contactInfo.email}</p>
                <p className="text-gray-300">📱 {section.contactInfo.phone}</p>
                <p className="text-gray-300">📍 {section.contactInfo.location}</p>
                <p className="text-purple-400 mt-4">{section.contactInfo.availability}</p>
              </div>
            )}
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black">
      {/* 3D Scene */}
      <div className="fixed inset-0 z-0">
        <Canvas 
          camera={{ position: [0, 5, 20], fov: 60 }}
          gl={{ 
            antialias: true, 
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2
          }}
        >
          <Suspense fallback={null}>
            {/* Enhanced Lighting Setup */}
            <ambientLight intensity={0.3} color="#ffffff" />
            <pointLight position={[20, 20, 20]} intensity={1} color="#4facfe" />
            <pointLight position={[-20, -20, -20]} intensity={0.8} color="#ff6b6b" />
            <directionalLight position={[0, 10, 5]} intensity={0.5} color="#ffffff" />
            <hemisphereLight 
              color="#4facfe" 
              groundColor="#ff6b6b" 
              intensity={0.3} 
            />
            
            {/* Fog for depth */}
            <fog attach="fog" args={['#000000', 50, 200]} />
            
            {/* Camera Controller */}
            <CameraController targetPlanet={currentSection} />
            
            {/* Space Environment */}
            <SpaceObjects />
            
            {/* Enhanced Particle System */}
            <AdvancedParticleSystem 
              count={1500}
              isTransitioning={isTransitioning} 
            />
            
            {/* Main Planets */}
            <EnhancedPlanets 
              currentSection={currentSection}
              isTransitioning={isTransitioning}
            />
            
            {/* Flying Astronaut Companion */}
            <FlyingAstronaut 
              currentSection={currentSection} 
              isTransitioning={isTransitioning}
            />
          </Suspense>
        </Canvas>
      </div>
      
      {/* UI Layer */}
      <AnimatePresence>
        {isLoaded && (
          <>
            {/* Navigation */}
            <Navigation 
              currentSection={currentSection} 
              onNavigate={handleNavigation}
              isTransitioning={isTransitioning}
            />
            
            {/* Scroll Indicator */}
            {currentSection === 0 && <ScrollIndicator />}
            
            {/* Section Content */}
            <motion.div 
              className="fixed inset-0 z-10 pointer-events-none flex items-center justify-center px-8"
              key={currentSection}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -50 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-4xl w-full text-center pointer-events-auto"
              >
                <div className="bg-black/50 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl">
                  {renderSectionContent(sections[currentSection])}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Loading Screen */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-6xl mb-4"
              >
                🚀
              </motion.div>
              <div className="text-xl text-cyan-400">Initializing Space Journey...</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;