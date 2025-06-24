import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen: React.FC = () => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-space-dark"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2.5, duration: 0.8 }}
      style={{ pointerEvents: 'none' }}
    >
      <div className="flex flex-col items-center">
        {/* Animated Planet */}
        <motion.div
          className="relative mb-8"
          animate={{ 
            rotate: [0, 360],
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "linear" 
          }}
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-space-blue to-space-purple relative">
            {/* Planet surface details */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-space-blue/50 to-space-purple/50"></div>
            <div className="absolute top-4 left-6 w-3 h-3 rounded-full bg-space-blue/30"></div>
            <div className="absolute bottom-6 right-4 w-2 h-2 rounded-full bg-space-purple/40"></div>
            
            {/* Atmosphere glow */}
            <div className="absolute -inset-2 rounded-full bg-space-blue/20 blur-md"></div>
          </div>
          
          {/* Orbiting elements */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2"
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-white rounded-full -translate-x-1/2"></div>
          </motion.div>
        </motion.div>
        
        {/* Loading bar */}
        <motion.div
          className="relative w-64 h-2 bg-space-dark/50 rounded-full overflow-hidden mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-space-blue to-space-purple rounded-full"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          
          {/* Shimmer effect */}
          <motion.div
            className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: [-32, 256] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        
        {/* Loading text */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className="text-space-blue font-mono text-lg mb-2">Initializing Space Travel</p>
          <p className="text-space-blue/60 font-mono text-sm">Preparing your cosmic journey...</p>
        </motion.div>
        
        {/* Floating particles */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-space-blue rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default LoadingScreen;