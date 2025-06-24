import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const Cursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const isPointerRef = useRef(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    if (!cursor || !follower) return;

    // Check if device has coarse pointer (touch)
    const mediaQuery = window.matchMedia('(pointer: coarse)');
    isPointerRef.current = !mediaQuery.matches;

    // If touch device, hide custom cursor
    if (!isPointerRef.current) {
      cursor.style.display = 'none';
      follower.style.display = 'none';
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      
      setTimeout(() => {
        follower.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }, 80);
    };

    const handleMouseEnter = () => {
      cursor.classList.add('cursor-active');
      follower.classList.add('follower-active');
    };

    const handleMouseLeave = () => {
      cursor.classList.remove('cursor-active');
      follower.classList.remove('follower-active');
    };

    // Add event listeners to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, select, textarea');
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 w-3 h-3 bg-space-blue rounded-full pointer-events-none z-50 mix-blend-difference"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        style={{ 
          transform: 'translate3d(-50%, -50%, 0)',
          transition: 'transform 0.1s ease-out, width 0.2s, height 0.2s'
        }}
      />
      <motion.div
        ref={followerRef}
        className="fixed top-0 left-0 w-8 h-8 border border-space-blue/50 rounded-full pointer-events-none z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        style={{ 
          transform: 'translate3d(-50%, -50%, 0)',
          transition: 'transform 0.3s ease-out, width 0.2s, height 0.2s'
        }}
      />
    </>
  );
};

export default Cursor;