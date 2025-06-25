import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const Cursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement[]>([]);
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorVariant, setCursorVariant] = useState<'default' | 'hover' | 'click'>('default');

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    if (!cursor || !follower) return;

    // Check if device has fine pointer (mouse)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsPointer(mediaQuery.matches);

    // If touch device, hide custom cursor
    if (!mediaQuery.matches) {
      cursor.style.display = 'none';
      follower.style.display = 'none';
      return;
    }

    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Update cursor position immediately
      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      
      // Create trail effect
      createTrail(mouseX, mouseY);
    };

    const handleMouseDown = () => {
      setIsClicking(true);
      setCursorVariant('click');
    };

    const handleMouseUp = () => {
      setIsClicking(false);
      setCursorVariant(isPointer ? 'hover' : 'default');
    };

    const handleMouseEnter = () => {
      setCursorVariant('hover');
    };

    const handleMouseLeave = () => {
      setCursorVariant('default');
    };

    // Smooth follower animation
    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      
      follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
      requestAnimationFrame(animateFollower);
    };

    // Create particle trail
    const createTrail = (x: number, y: number) => {
      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      trail.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 4px;
        height: 4px;
        background: radial-gradient(circle, #4facfe 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate3d(${x}px, ${y}px, 0);
        opacity: 0.8;
      `;
      
      document.body.appendChild(trail);
      
      // Animate trail particle
      let opacity = 0.8;
      let scale = 1;
      const animate = () => {
        opacity -= 0.05;
        scale += 0.02;
        trail.style.opacity = opacity.toString();
        trail.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
        
        if (opacity <= 0) {
          document.body.removeChild(trail);
        } else {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    };

    // Add event listeners to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, select, textarea, .interactive');
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Start follower animation
    animateFollower();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [isPointer]);

  if (!isPointer) return null;

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[10000] mix-blend-difference"
        style={{ 
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: cursorVariant === 'click' ? 0.8 : cursorVariant === 'hover' ? 1.5 : 1,
          opacity: cursorVariant === 'click' ? 0.8 : 1,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 500, 
          damping: 28,
          mass: 0.5
        }}
      >
        <div className="relative">
          {/* Core dot */}
          <div 
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              cursorVariant === 'hover' ? 'bg-cyan-400' : 'bg-white'
            }`}
            style={{
              boxShadow: cursorVariant === 'hover' 
                ? '0 0 20px rgba(79, 172, 254, 0.8), 0 0 40px rgba(79, 172, 254, 0.4)' 
                : '0 0 10px rgba(255, 255, 255, 0.5)'
            }}
          />
          
          {/* Pulsing ring for hover state */}
          {cursorVariant === 'hover' && (
            <motion.div
              className="absolute top-1/2 left-1/2 w-6 h-6 border border-cyan-400 rounded-full"
              style={{ transform: 'translate(-50%, -50%)' }}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.8, 0.3, 0.8]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </div>
      </motion.div>

      {/* Follower circle */}
      <motion.div
        ref={followerRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ 
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: cursorVariant === 'click' ? 0.5 : cursorVariant === 'hover' ? 1.2 : 1,
          opacity: cursorVariant === 'click' ? 0.3 : 0.6,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 150, 
          damping: 15,
          mass: 0.8
        }}
      >
        <div 
          className={`w-8 h-8 rounded-full border transition-all duration-300 ${
            cursorVariant === 'hover' 
              ? 'border-cyan-400 bg-cyan-400/10' 
              : 'border-white/30 bg-white/5'
          }`}
          style={{
            backdropFilter: 'blur(10px)',
            boxShadow: cursorVariant === 'hover' 
              ? '0 0 30px rgba(79, 172, 254, 0.3)' 
              : '0 0 20px rgba(255, 255, 255, 0.1)'
          }}
        />
      </motion.div>

      {/* Click ripple effect */}
      {isClicking && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9998]"
          style={{ 
            transform: 'translate(-50%, -50%)',
            left: cursorRef.current?.style.left,
            top: cursorRef.current?.style.top,
          }}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="w-8 h-8 rounded-full border-2 border-cyan-400" />
        </motion.div>
      )}

      {/* Orbital particles for enhanced effect */}
      {cursorVariant === 'hover' && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="fixed top-0 left-0 pointer-events-none z-[9997]"
              style={{ 
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <div 
                className="w-1 h-1 bg-cyan-400 rounded-full"
                style={{
                  transform: `translateX(${15 + i * 5}px)`,
                  boxShadow: '0 0 10px rgba(79, 172, 254, 0.8)'
                }}
              />
            </motion.div>
          ))}
        </>
      )}
    </>
  );
};

export default Cursor;