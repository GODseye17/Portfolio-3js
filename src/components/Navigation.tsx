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
  const [isOpen, setIsOpen] = useState(false);

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
      setIsOpen(false); // Close mobile menu after navigation
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav 
        className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:block"
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
        className="fixed top-6 right-6 z-50 md:hidden p-3 bg-black/30 backdrop-blur-xl rounded-full border border-white/10 interactive"
        onClick={() => setIsOpen(!isOpen)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} className="text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu size={24} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Mobile Menu */}
            <motion.div
              className="fixed top-20 right-6 z-50 md:hidden bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 p-4 min-w-[200px]"
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
            >
              <div className="space-y-2">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = currentSection === index;
                  
                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleNavigation(index)}
                      disabled={isTransitioning}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 interactive`}
                      style={{
                        backgroundColor: isActive ? item.color + '20' : 'transparent',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: isActive ? item.color + '40' : 'transparent'
                      }}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Icon 
                        size={20} 
                        style={{ color: isActive ? item.color : '#ffffff80' }}
                      />
                      <span 
                        className="font-sans text-sm"
                        style={{ color: isActive ? item.color : '#ffffff' }}
                      >
                        {item.label}
                      </span>
                      
                      {/* Active indicator dot */}
                      {isActive && (
                        <motion.div
                          className="ml-auto w-2 h-2 rounded-full"
                          style={{ backgroundColor: item.color }}
                          layoutId="mobileActiveIndicator"
                          transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;