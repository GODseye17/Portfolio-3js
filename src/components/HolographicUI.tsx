import React from 'react';
import { motion } from 'framer-motion';

interface HolographicUIProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  scanLines?: boolean;
}

const HolographicUI: React.FC<HolographicUIProps> = ({ 
  children, 
  className = "", 
  glowColor = "cyan",
  scanLines = true 
}) => {
  const glowColors = {
    cyan: 'shadow-cyan-500/50 border-cyan-500/30 hover:shadow-[0_0_30px_rgba(79,172,254,0.4)]',
    purple: 'shadow-purple-500/50 border-purple-500/30 hover:shadow-[0_0_30px_rgba(147,51,234,0.4)]',
    pink: 'shadow-pink-500/50 border-pink-500/30 hover:shadow-[0_0_30px_rgba(236,72,153,0.4)]',
    blue: 'shadow-blue-500/50 border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]'
  };
  
  return (
    <motion.div
      className={`relative bg-space-dark/20 backdrop-blur-lg rounded-xl border ${glowColors[glowColor as keyof typeof glowColors]} transition-shadow duration-300 ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      {/* Holographic border effect */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-pulse" />
      </div>
      
      {/* Scan lines effect */}
      {scanLines && (
        <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent h-8"
            animate={{ 
              transform: ["translateY(-32px)", "translateY(100%)"] 
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}
      
      {/* Corner accents */}
      <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-500/50" />
      <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-cyan-500/50" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-cyan-500/50" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-500/50" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default HolographicUI;