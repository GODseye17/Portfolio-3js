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
import Cursor from './components/Cursor';
import { Github, Linkedin } from 'lucide-react';
import portfolioData from './data/portfolio.json';
import type { PortfolioData, Section, Position, Project } from './types/portfolio';
import './index.css';

// Camera controller component with smoother transitions
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
    
    // Much smoother camera movement
    camera.position.lerp(idealPosition, 0.015);
    
    // Look at planet with offset for better view
    const lookAtPosition = targetPosition.clone();
    lookAtPosition.y += 2;
    camera.lookAt(lookAtPosition);
  });

  return null;
};

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Get sections from JSON data
  const { personalInfo, sections } = portfolioData;
  
  // TypeScript knows the shape of your data
  const currentSectionData: Section = sections[currentSection];
  
  // When mapping sections, TypeScript knows the type
  if (currentSectionData.positions) {
    currentSectionData.positions.forEach((position: Position) => {
      console.log(position.title); // TypeScript knows this exists
    });
  }

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 1500);
  }, []);

  const handleNavigation = (index: number) => {
    if (isTransitioning || index === currentSection) return;
    
    setIsTransitioning(true);
    setCurrentSection(index);
    
    // Longer transition time for smoother effect
    setTimeout(() => {
      setIsTransitioning(false);
    }, 2000);
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

    // Only add wheel listener on desktop
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    if (mediaQuery.matches) {
      window.addEventListener('wheel', handleWheel, { passive: false });
    }
    
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 font-heading bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent text-center">
              {section.title}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-4 font-sans text-center">
              {section.subtitle}
            </p>
            <p className="text-base sm:text-lg text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto font-sans text-center px-4">
              {section.content}
            </p>
            {section.highlights && (
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-4">
                {section.highlights.map((tech: string) => (
                  <span 
                    key={tech}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-cyan-400/10 rounded-full border border-cyan-400/30 text-cyan-400 font-sans interactive cursor-pointer hover:bg-cyan-400/20 transition-all duration-300 text-sm sm:text-base"
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
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 font-heading text-white text-center">
              {section.title}
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-4 sm:mb-6 font-sans text-center">
              {section.subtitle}
            </p>
            <p className="text-base sm:text-lg text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto font-sans text-center px-4">
              {section.content}
            </p>
            {section.stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto px-4">
                {Object.entries(section.stats).map(([key, value]) => (
                  <div key={key} className="text-center p-3 sm:p-4 bg-blue-400/10 rounded-lg border border-blue-400/20 interactive cursor-pointer hover:bg-blue-400/20 hover:border-blue-400/40 transition-all duration-300">
                    <div className="text-xl sm:text-2xl font-bold text-cyan-400 font-heading">{value}</div>
                    <div className="text-xs sm:text-sm text-gray-400 font-sans">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        );
        
      case 'experience':
        return (
          <>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 font-heading text-white text-center">
              {section.title}
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-4 sm:mb-6 font-sans text-center">
              {section.subtitle}
            </p>
            <p className="text-base sm:text-lg text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto font-sans text-center px-4">
              {section.content}
            </p>
            {section.positions && (
              <div className="space-y-4 max-w-3xl mx-auto text-left px-4">
                {section.positions.slice(0, 2).map((position: any, index: number) => (
                  <div 
                    key={index}
                    className="p-4 bg-red-400/10 rounded-lg border border-red-400/20 interactive cursor-pointer hover:bg-red-400/20 hover:border-red-400/40 transition-all duration-300"
                  >
                    <h3 className="text-lg sm:text-xl font-bold text-red-400 font-heading">{position.title}</h3>
                    <p className="text-white font-sans text-sm sm:text-base">{position.company} • {position.period}</p>
                    <p className="text-gray-400 text-xs sm:text-sm mt-2 font-sans">{position.description}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        );
        
      case 'skills':
        return (
          <>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 font-heading text-white text-center">
              {section.title}
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-4 sm:mb-6 font-sans text-center">
              {section.subtitle}
            </p>
            <p className="text-base sm:text-lg text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto font-sans text-center px-4">
              {section.content}
            </p>
            {section.categories && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto px-4">
                {section.categories.map((category: any) => (
                  <div 
                    key={category.title}
                    className="p-4 bg-green-400/10 rounded-lg border border-green-400/20 interactive cursor-pointer hover:bg-green-400/20 hover:border-green-400/40 transition-all duration-300"
                  >
                    <h3 className="text-green-400 font-bold mb-2 font-heading text-base sm:text-lg">{category.title}</h3>
                    <div className="space-y-1">
                      {category.skills.slice(0, 3).map((skill: any) => (
                        <div key={skill.name} className="flex justify-between">
                          <span className="text-xs sm:text-sm text-gray-300 font-sans">{skill.name}</span>
                          <span className="text-xs sm:text-sm text-gray-500 font-sans">{skill.level}%</span>
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
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 font-heading text-white text-center">
              {section.title}
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-4 sm:mb-6 font-sans text-center">
              {section.subtitle}
            </p>
            <p className="text-base sm:text-lg text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto font-sans text-center px-4">
              {section.content}
            </p>
            {section.projects && (
              <div className="space-y-4 max-w-3xl mx-auto px-4">
                {section.projects.filter((p: any) => p.featured).map((project: any) => (
                  <div 
                    key={project.title}
                    className="p-4 bg-yellow-400/10 rounded-lg border border-yellow-400/20 interactive cursor-pointer hover:bg-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300"
                  >
                    <h3 className="text-yellow-400 font-bold font-heading text-base sm:text-lg">{project.title}</h3>
                    <p className="text-gray-300 text-xs sm:text-sm mt-1 font-sans">{project.description}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        );
        
      case 'contact':
        return (
          <>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 font-heading text-white text-center">
              {section.title}
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-4 sm:mb-6 font-sans text-center">
              {section.subtitle}
            </p>
            <p className="text-base sm:text-lg text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto font-sans text-center px-4">
              {section.content}
            </p>
            {section.contactInfo && (
              <div className="space-y-4 max-w-md mx-auto px-4">
                <a 
                  href={`mailto:${section.contactInfo.email}`}
                  className="block text-gray-300 font-sans interactive cursor-pointer hover:text-cyan-400 transition-colors duration-300 p-3 rounded-lg hover:bg-purple-400/10 text-sm sm:text-base"
                >
                  📧 {section.contactInfo.email}
                </a>
                <a 
                  href={`tel:${section.contactInfo.phone}`}
                  className="block text-gray-300 font-sans interactive cursor-pointer hover:text-cyan-400 transition-colors duration-300 p-3 rounded-lg hover:bg-purple-400/10 text-sm sm:text-base"
                >
                  📱 {section.contactInfo.phone}
                </a>
                <div className="text-gray-300 font-sans p-3 text-sm sm:text-base">
                  📍 {section.contactInfo.location}
                </div>
                
                {/* Social Links */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                  <a 
                    href="https://www.linkedin.com/in/yash-shankaram-035426237/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="interactive cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 p-3 sm:p-4 bg-purple-400/10 rounded-lg border border-purple-400/20 hover:bg-purple-400/20 hover:border-purple-400/40 transition-all duration-300">
                      <Linkedin className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 group-hover:text-purple-300" />
                      <span className="text-gray-300 font-sans group-hover:text-white text-sm sm:text-base">LinkedIn</span>
                    </div>
                  </a>
                  <a 
                    href="https://github.com/GODseye17" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="interactive cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 p-3 sm:p-4 bg-purple-400/10 rounded-lg border border-purple-400/20 hover:bg-purple-400/20 hover:border-purple-400/40 transition-all duration-300">
                      <Github className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 group-hover:text-purple-300" />
                      <span className="text-gray-300 font-sans group-hover:text-white text-sm sm:text-base">GitHub</span>
                    </div>
                  </a>
                </div>
                
                <p className="text-purple-400 mt-6 font-sans text-center text-sm sm:text-base">{section.contactInfo.availability}</p>
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
      {/* Custom Cursor */}
      <Cursor />
      
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
            <ambientLight intensity={0.4} color="#ffffff" />
            <pointLight position={[20, 20, 20]} intensity={1.2} color="#4facfe" />
            <pointLight position={[-20, -20, -20]} intensity={1} color="#ff6b6b" />
            <directionalLight position={[0, 10, 5]} intensity={0.6} color="#ffffff" />
            <hemisphereLight 
              color="#4facfe" 
              groundColor="#ff6b6b" 
              intensity={0.4} 
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
            
            {/* Flying Astronaut Companion - Enhanced visibility */}
            <FlyingAstronaut 
              currentSection={currentSection} 
              isTransitioning={isTransitioning}
            />
          </Suspense>
        </Canvas>
      </div>
      
      {/* UI Layer */}
      <AnimatePresence mode="wait">
        {isLoaded && (
          <>
            {/* Navigation - Now responsive with hamburger */}
            <Navigation 
              currentSection={currentSection} 
              onNavigate={handleNavigation}
              isTransitioning={isTransitioning}
            />
            
            {/* Scroll Indicator - Hidden on mobile */}
            {currentSection === 0 && (
              <div className="hidden lg:block">
                <ScrollIndicator />
              </div>
            )}
            
            {/* Section Content - Mobile responsive */}
            <motion.div 
              className="fixed inset-0 z-10 pointer-events-none flex items-center justify-center px-4 sm:px-6 lg:px-8"
              key={currentSection}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -30 }}
                transition={{ 
                  duration: 1.2, 
                  ease: [0.25, 0.46, 0.45, 0.94],
                  opacity: { duration: 0.8 },
                  scale: { duration: 1.2 },
                  y: { duration: 1.2 }
                }}
                className="max-w-4xl w-full text-center pointer-events-auto"
              >
                <div className="p-4 sm:p-6 md:p-8 lg:p-12">
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
            transition={{ duration: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          >
            <div className="text-center px-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-4xl sm:text-6xl mb-4"
              >
                🚀
              </motion.div>
              <div className="text-lg sm:text-xl text-cyan-400 font-sans">Initializing Space Journey...</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;