import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, Briefcase, Code, FolderOpen, Mail, Menu, X, Rocket } from 'lucide-react';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'Home' },
    { icon: User, label: 'About' },
    { icon: Briefcase, label: 'Experience' },
    { icon: Code, label: 'Skills' },
    { icon: FolderOpen, label: 'Projects' },
    { icon: Mail, label: 'Contact' },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav 
        className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:block"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="bg-space-dark/30 backdrop-blur-lg rounded-full p-2 border border-space-blue/20">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentSection === index;
            
            return (
              <button
                key={index}
                onClick={() => !isTransitioning && onNavigate(index)}
                disabled={isTransitioning}
                className={`relative block p-3 rounded-full transition-all duration-300 mb-2 last:mb-0 group ${
                  isActive
                    ? 'bg-space-blue text-white'
                    : 'text-space-blue/70 hover:text-white hover:bg-space-blue/20'
                } ${isTransitioning ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                title={item.label}
              >
                <Icon size={20} />
                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-space-dark/80 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {item.label}
                </span>
                
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute inset-0 rounded-full bg-space-blue z-[-1]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <motion.div 
        className="fixed top-0 left-0 right-0 z-50 md:hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex justify-between items-center px-6 py-4 bg-space-dark/80 backdrop-blur-lg">
          <motion.div 
            className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-space-blue via-space-purple to-space-pink"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Rocket className="inline-block mr-2" size={20} />
            Yash Shankaram
          </motion.div>
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-full bg-space-dark/50 backdrop-blur-lg border border-space-blue/20"
            disabled={isTransitioning}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="fixed inset-0 bg-space-dark/95 backdrop-blur-lg z-40 pt-20"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col items-center gap-6 p-6">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = currentSection === index;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        if (!isTransitioning) {
                          onNavigate(index);
                          setIsMobileMenuOpen(false);
                        }
                      }}
                      disabled={isTransitioning}
                      className={`relative flex items-center gap-3 py-3 px-6 rounded-full w-full max-w-xs transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-space-blue/30 to-space-purple/30 text-white border border-space-blue/50'
                          : 'text-space-blue/70 hover:text-white'
                      } ${isTransitioning ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                    >
                      <Icon size={20} />
                      <span className="text-lg">{item.label}</span>
                      
                      {isActive && (
                        <motion.div
                          layoutId="mobileNavIndicator"
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-space-blue/30 to-space-purple/30 border border-space-blue/50 z-[-1]"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default Navigation;