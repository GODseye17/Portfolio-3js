import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import AdvancedParticleSystem from './components/AdvancedParticleSystem';
import RealisticPlanets from './components/RealisticPlanets';
import FlyingAstronaut from './components/FlyingAstronaut';
import SpaceObjects from './components/SpaceObjects';
import Cursor from './components/Cursor';
import Navigation from './components/Navigation';
import LoadingScreen from './components/LoadingScreen';
import ScrollIndicator from './components/ScrollIndicator';
import SectionContainer from './components/SectionContainer';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import ExperienceSection from './sections/ExperienceSection';
import SkillsSection from './sections/SkillsSection';
import ProjectsSection from './sections/ProjectsSection';
import ContactSection from './sections/ContactSection';

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 2000);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isTransitioning) return;
      
      const sections = document.querySelectorAll('.space-section');
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      sections.forEach((section, index) => {
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        const sectionHeight = section.getBoundingClientRect().height;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          if (currentSection !== index) {
            setIsTransitioning(true);
            setCurrentSection(index);
            
            setTimeout(() => setIsTransitioning(false), 1200);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentSection, isTransitioning]);

  const handleNavigation = (index: number) => {
    setIsTransitioning(true);
    
    const sections = document.querySelectorAll('.space-section');
    sections[index]?.scrollIntoView({ behavior: 'smooth' });
    
    setTimeout(() => {
      setIsTransitioning(false);
      setCurrentSection(index);
    }, 1200);
  };

  return (
    <div className="relative min-h-screen bg-space-dark text-white overflow-x-hidden">
      <Cursor />
      <ScrollIndicator />
      
      {/* Enhanced 3D Background with Complete Space Environment */}
      <div className="fixed inset-0 z-0">
        <Canvas 
          camera={{ position: [0, 0, 20], fov: 50 }}
          gl={{ 
            antialias: true, 
            alpha: true,
            powerPreference: 'high-performance'
          }}
        >
          <Suspense fallback={null}>
            {/* Enhanced Lighting */}
            <ambientLight intensity={0.2} color="#ffffff" />
            <pointLight position={[15, 15, 15]} intensity={0.4} color="#ffffff" />
            <pointLight position={[-15, -15, -15]} intensity={0.2} color="#4facfe" />
            <directionalLight position={[0, 10, 5]} intensity={0.3} color="#ffffff" />
            
            {/* Space Objects - Stars, Black Holes, Nebulae, etc. */}
            <SpaceObjects />
            
            {/* Particle Systems */}
            <AdvancedParticleSystem 
              count={800}
              isTransitioning={isTransitioning} 
            />
            
            {/* Background Planets */}
            <RealisticPlanets currentSection={currentSection} />
            
            {/* Flying Astronaut Companion */}
            <FlyingAstronaut 
              currentSection={currentSection} 
              isTransitioning={isTransitioning}
            />
            
            {/* Subtle auto-rotation */}
            <OrbitControls 
              enableZoom={false} 
              enablePan={false} 
              enableRotate={false} 
              autoRotate 
              autoRotateSpeed={0.02}
            />
          </Suspense>
        </Canvas>
      </div>
      
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10"
          >
            <Navigation 
              currentSection={currentSection} 
              onNavigate={handleNavigation}
              isTransitioning={isTransitioning}
            />
            
            <main className="relative">
              <SectionContainer className="space-section" index={0} currentSection={currentSection}>
                <HeroSection onExplore={() => handleNavigation(1)} />
              </SectionContainer>
              
              <SectionContainer className="space-section diagonal-left" index={1} currentSection={currentSection}>
                <AboutSection planetSide="right" />
              </SectionContainer>
              
              <SectionContainer className="space-section diagonal-right" index={2} currentSection={currentSection}>
                <ExperienceSection planetSide="left" />
              </SectionContainer>
              
              <SectionContainer className="space-section diagonal-left" index={3} currentSection={currentSection}>
                <SkillsSection planetSide="right" />
              </SectionContainer>
              
              <SectionContainer className="space-section diagonal-right" index={4} currentSection={currentSection}>
                <ProjectsSection planetSide="left" />
              </SectionContainer>
              
              <SectionContainer className="space-section diagonal-left" index={5} currentSection={currentSection}>
                <ContactSection planetSide="right" />
              </SectionContainer>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isLoaded && <LoadingScreen />}
    </div>
  );
};

export default App;