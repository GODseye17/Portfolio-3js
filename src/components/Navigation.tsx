// src/components/Navigation.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Home, User, Briefcase, Code, FolderOpen, Mail } from 'lucide-react';

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
  const navItems = [
    { icon: Home, label: 'Home', color: '#4169E1' },
    { icon: User, label: 'About', color: '#4facfe' },
    { icon: Briefcase, label: 'Experience', color: '#CD5C5C' },
    { icon: Code, label: 'Skills', color: '#228B22' },
    { icon: FolderOpen, label: 'Projects', color: '#FFD700' },
    { icon: Mail, label: 'Contact', color: '#9370DB' },
  ];

  return (
    <motion.nav 
      className="fixed right-8 top-1/2 -translate-y-1/2 z-50"
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
              onClick={() => !isTransitioning && onNavigate(index)}
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
  );
};

export default Navigation;