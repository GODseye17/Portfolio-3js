import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Github, Linkedin, Twitter, Rocket } from 'lucide-react';

interface HeroSectionProps {
  onExplore: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onExplore }) => {
  return (
    <div className="text-center max-w-4xl mx-auto z-10 relative min-h-screen flex flex-col justify-center px-6">
      {/* Simple Welcome Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-6"
      >
        <div className="inline-block px-4 py-2 bg-space-dark/40 backdrop-blur-lg rounded-full border border-cyan-400/30">
          <span className="text-cyan-400 font-mono text-sm">Welcome to my universe</span>
        </div>
      </motion.div>
      
      {/* Main Title - Simplified */}
      <motion.h1
        className="text-6xl md:text-7xl font-bold font-display leading-tight mb-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          Yash Shankaram
        </span>
      </motion.h1>
      
      {/* Subtitle - Clean */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <p className="text-xl md:text-2xl text-gray-300 mb-4">
          <span className="text-cyan-400">Full-Stack Developer</span> & <span className="text-purple-400">3D Creative</span>
        </p>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Crafting immersive digital experiences with modern web technologies
        </p>
      </motion.div>
      
      {/* Tech Stack - Simple Pills */}
      <motion.div 
        className="flex flex-wrap justify-center gap-3 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        {['React.js', 'Three.js', 'Node.js', 'TypeScript'].map((tech) => (
          <span
            key={tech}
            className="px-4 py-2 bg-space-dark/40 backdrop-blur-lg rounded-full border border-cyan-400/20 text-cyan-400 text-sm"
          >
            {tech}
          </span>
        ))}
      </motion.div>

      {/* Social Links - Clean */}
      <motion.div 
        className="flex gap-4 justify-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        {[
          { icon: Github, href: "https://github.com", label: "GitHub" },
          { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
          { icon: Twitter, href: "https://twitter.com", label: "Twitter" }
        ].map(({ icon: Icon, href, label }) => (
          <motion.a 
            key={label}
            href={href}
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 bg-space-dark/40 backdrop-blur-lg rounded-full border border-cyan-400/20 text-cyan-400 hover:text-white hover:border-cyan-400/50 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={label}
          >
            <Icon size={20} />
          </motion.a>
        ))}
      </motion.div>

      {/* CTA Button - Simple */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <motion.button 
          onClick={onExplore}
          className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 flex items-center gap-3 mx-auto"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Rocket size={20} />
          Begin Exploration
          <ChevronDown className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* Scroll Indicator - Minimal */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className="text-cyan-400 text-sm font-mono mb-2">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-5 h-5 text-cyan-400" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;