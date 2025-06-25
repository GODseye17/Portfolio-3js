// src/components/Navigation.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, Briefcase, Code, FolderOpen, Mail, Menu, X } from 'lucide-react';

interface NavigationProps {
  currentSection: number;
  onNavigate: (index: number) => void;
  isTransitioning: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ 
  currentSection, 
  onNavigate,
  isTransitioning
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'Home', color: '#4169E1' },
    { icon: User, label: 'About', color: '#4facfe' },
    { icon: Briefcase, label: 'Experience', color: '#CD5C5C' },
    { icon: Code, label: 'Skills', color: '#228B22' },
    { icon: FolderOpen, label: 'Projects', color: '#FFD700' },
    { icon: Mail, label: 'Contact', color: '#9370DB' },
  ];

  const handleNavigation = (index: number) => {
    if (!isTransitioning) {
      onNavigate(index);
      setIsMenuOpen(false); // Close menu after navigation on mobile
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Desktop Navigation - Hidden on mobile */}
      <motion.nav 
        className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:block"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <div className="bg-black/30 backdrop-blur-xl rounded-full p-3 border border-white/10">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentSection === index;
            
            return (
              <motion.button
                key={index}
                onClick={() => handleNavigation(index)}
                disabled={isTransitioning}
                className={`relative block p-3 rounded-full transition-all duration-300 mb-2 last:mb-0 group`}
                style={{
                  backgroundColor: isActive ? item.color + '40' : 'transparent',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: isActive ? item.color : 'transparent'
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title={item.label}
              >
                <Icon 
                  size={20} 
                  style={{ color: isActive ? item.color : '#ffffff80' }}
                />
                
                {/* Tooltip */}
                <span 
                  className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1 rounded-full text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{
                    backgroundColor: item.color + '20',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: item.color + '40',
                    color: item.color
                  }}
                >
                  {item.label}
                </span>
                
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute inset-0 rounded-full z-[-1]"
                    style={{
                      backgroundColor: item.color + '20',
                      boxShadow: `0 0 20px ${item.color}60`
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.nav>

      {/* Mobile Hamburger Button */}
      <motion.button
        onClick={toggleMenu}
        className="fixed top-6 right-6 z-[60] lg:hidden p-3 bg-black/30 backdrop-blur-xl rounded-full border border-white/10 interactive"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isMenuOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} color="#ffffff" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu size={24} color="#ffffff" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Mobile Menu */}
            <motion.div
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-black/90 backdrop-blur-xl border-l border-white/10 z-[56] lg:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="flex flex-col h-full pt-20 px-6">
                {/* Menu Header */}
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-xl font-heading text-white mb-2">Navigation</h3>
                  <div className="w-12 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-600"></div>
                </motion.div>

                {/* Navigation Items */}
                <div className="flex-1 space-y-2">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = currentSection === index;
                    
                    return (
                      <motion.button
                        key={index}
                        onClick={() => handleNavigation(index)}
                        disabled={isTransitioning}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 text-left interactive ${
                          isActive ? 'bg-white/10' : 'hover:bg-white/5'
                        }`}
                        style={{
                          borderLeft: isActive ? `4px solid ${item.color}` : '4px solid transparent'
                        }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon 
                          size={24} 
                          style={{ color: isActive ? item.color : '#ffffff80' }}
                        />
                        <span 
                          className={`text-lg font-sans ${
                            isActive ? 'text-white font-medium' : 'text-gray-300'
                          }`}
                        >
                          {item.label}
                        </span>
                        
                        {/* Active indicator */}
                        {isActive && (
                          <motion.div
                            className="ml-auto w-2 h-2 rounded-full"
                            style={{ backgroundColor: item.color }}
                            layoutId="mobileNavIndicator"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Menu Footer */}
                <motion.div
                  className="mt-8 pt-6 border-t border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-sm text-gray-400 font-sans text-center">
                    Yash Shankaram
                  </p>
                  <p className="text-xs text-gray-500 font-sans text-center mt-1">
                    Full-Stack Developer
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;