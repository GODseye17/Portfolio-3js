import React from 'react';
import { motion } from 'framer-motion';

interface SectionContainerProps {
  index: number;
  currentSection: number;
  children: React.ReactNode;
  className?: string;
}

const SectionContainer: React.FC<SectionContainerProps> = ({ 
  index, 
  currentSection, 
  children,
  className = ""
}) => {
  const isActive = index === currentSection;
  
  // Diagonal animation variants
  const getDiagonalVariants = () => {
    const isDiagonalLeft = className.includes('diagonal-left');
    const isDiagonalRight = className.includes('diagonal-right');
    
    if (isDiagonalLeft) {
      return {
        hidden: { 
          opacity: 0, 
          x: -100, 
          y: 50,
          rotate: -2,
          scale: 0.95
        },
        visible: { 
          opacity: 1, 
          x: 0, 
          y: 0,
          rotate: 0,
          scale: 1
        }
      };
    } else if (isDiagonalRight) {
      return {
        hidden: { 
          opacity: 0, 
          x: 100, 
          y: -50,
          rotate: 2,
          scale: 0.95
        },
        visible: { 
          opacity: 1, 
          x: 0, 
          y: 0,
          rotate: 0,
          scale: 1
        }
      };
    } else {
      // Default for hero section
      return {
        hidden: { 
          opacity: 0, 
          y: 100,
          scale: 0.9
        },
        visible: { 
          opacity: 1, 
          y: 0,
          scale: 1
        }
      };
    }
  };
  
  const variants = getDiagonalVariants();
  
  return (
    <section 
      className={`min-h-screen flex items-center justify-center px-6 py-20 relative ${className}`}
      style={{ scrollSnapAlign: 'start' }}
    >
      <motion.div 
        className="w-full max-w-7xl mx-auto"
        initial="hidden"
        animate={isActive ? "visible" : "hidden"}
        variants={variants}
        transition={{ 
          duration: 1.2, 
          ease: [0.16, 1, 0.3, 1],
          delay: isActive ? 0.3 : 0
        }}
      >
        {children}
      </motion.div>
      
      {/* Section number indicator with enhanced styling */}
      <motion.div
        className="absolute top-8 right-8 text-5xl font-bold text-space-blue/20 font-display"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: isActive ? 1 : 0.3,
          scale: isActive ? 1.1 : 0.8
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {String(index + 1).padStart(2, '0')}
      </motion.div>
      
      {/* Random floating elements for visual interest */}
      {isActive && (
        <>
          <motion.div
            className="absolute top-1/4 left-8 w-2 h-2 bg-cyan-400/30 rounded-full"
            animate={{ 
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
          <motion.div
            className="absolute bottom-1/3 right-12 w-1 h-1 bg-purple-400/40 rounded-full"
            animate={{ 
              x: [0, 15, 0],
              opacity: [0.4, 0.9, 0.4]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
          <motion.div
            className="absolute top-2/3 left-1/4 w-1.5 h-1.5 bg-pink-400/25 rounded-full"
            animate={{ 
              y: [0, 10, 0],
              x: [0, -10, 0],
              opacity: [0.2, 0.7, 0.2]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        </>
      )}
    </section>
  );
};

export default SectionContainer;