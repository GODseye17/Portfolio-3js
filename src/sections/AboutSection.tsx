import React from 'react';
import { motion, useInView } from 'framer-motion';
import { User, Code, Palette, Zap } from 'lucide-react';

interface AboutSectionProps {
  planetSide: 'left' | 'right';
}

const AboutSection: React.FC<AboutSectionProps> = ({ planetSide }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      y: 30, 
      opacity: 0,
      x: planetSide === 'right' ? -50 : 50
    },
    visible: {
      y: 0,
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const contentSide = planetSide === 'right' ? 'left' : 'right';

  return (
    <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-center min-h-screen max-w-6xl mx-auto">
      {/* Planet Space - Earth representation */}
      <div className={`${planetSide === 'left' ? 'order-1' : 'order-2'} relative`}>
        <motion.div 
          className="w-full h-80 flex items-center justify-center"
          initial={{ scale: 0.3, opacity: 0, rotate: -45 }}
          animate={isInView ? { scale: 1, opacity: 1, rotate: 0 } : { scale: 0.3, opacity: 0, rotate: -45 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative">
            {/* Earth-like planet - smaller and more visible */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 via-green-500 to-blue-600 relative overflow-hidden shadow-2xl">
              {/* Continents */}
              <div className="absolute top-4 left-6 w-10 h-8 bg-green-600 rounded-full opacity-80"></div>
              <div className="absolute bottom-6 right-4 w-12 h-6 bg-green-700 rounded-full opacity-70"></div>
              <div className="absolute top-12 right-8 w-8 h-10 bg-green-500 rounded-full opacity-75"></div>
              
              {/* Clouds */}
              <div className="absolute top-2 left-4 w-16 h-4 bg-white rounded-full opacity-30"></div>
              <div className="absolute bottom-4 left-8 w-12 h-3 bg-white rounded-full opacity-25"></div>
              <div className="absolute top-8 right-2 w-10 h-3 bg-white rounded-full opacity-35"></div>
              
              {/* Atmosphere glow */}
              <div className="absolute inset-0 rounded-full bg-blue-300 opacity-20 blur-sm"></div>
            </div>
            
            {/* Orbital ring */}
            <motion.div 
              className="absolute inset-0 border-2 border-blue-300/30 rounded-full w-40 h-40 -top-4 -left-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            
            <div className="text-center mt-6 text-blue-400/60">
              <p className="text-lg font-mono">Earth - About</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <motion.div 
        className={`${contentSide === 'left' ? 'order-1' : 'order-2'} space-y-6`}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.div variants={itemVariants}>
          <h2 className="text-4xl font-bold mb-4 font-display bg-gradient-to-r from-blue-400 to-green-500 bg-clip-text text-transparent">
            About Me
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-green-500 rounded-full mb-6"></div>
        </motion.div>
        
        <motion.p 
          className="text-lg text-gray-300 leading-relaxed mb-6"
          variants={itemVariants}
        >
          I'm a passionate full-stack developer with a love for creating immersive digital experiences. 
          With expertise in modern web technologies and 3D graphics, I bring ideas to life through 
          innovative code and stunning visual design.
        </motion.p>
        
        <motion.p 
          className="text-gray-400 leading-relaxed mb-8"
          variants={itemVariants}
        >
          My journey spans from building scalable web applications to crafting interactive 3D experiences 
          that push the boundaries of what's possible in the browser.
        </motion.p>
        
        {/* Stats */}
        <motion.div 
          className="grid grid-cols-2 gap-4 mb-8"
          variants={itemVariants}
        >
          <div className="text-center p-4 bg-space-dark/30 backdrop-blur-lg rounded-lg border border-blue-400/20">
            <div className="text-2xl font-bold text-blue-400 mb-1">5+</div>
            <div className="text-sm text-gray-400">Years Experience</div>
          </div>
          <div className="text-center p-4 bg-space-dark/30 backdrop-blur-lg rounded-lg border border-green-400/20">
            <div className="text-2xl font-bold text-green-400 mb-1">50+</div>
            <div className="text-sm text-gray-400">Projects Completed</div>
          </div>
        </motion.div>

        {/* Specialties */}
        <motion.div className="space-y-3" variants={itemVariants}>
          {[
            { icon: Code, title: "Frontend Development", desc: "React, Vue.js, TypeScript", color: "blue" },
            { icon: Palette, title: "3D Graphics & WebGL", desc: "Three.js, WebGL shaders", color: "green" },
            { icon: Zap, title: "Backend & Cloud", desc: "Node.js, Python, AWS", color: "cyan" }
          ].map((specialty) => (
            <motion.div 
              key={specialty.title}
              className={`flex items-center gap-3 p-3 bg-space-dark/20 backdrop-blur-lg rounded-lg border border-${specialty.color}-400/10 hover:border-${specialty.color}-400/30 transition-all duration-300`}
              whileHover={{ x: 8, scale: 1.02 }}
            >
              <div className={`p-2 bg-${specialty.color}-400/20 rounded-lg`}>
                <specialty.icon className={`w-5 h-5 text-${specialty.color}-400`} />
              </div>
              <div>
                <h3 className="text-white font-medium">{specialty.title}</h3>
                <p className="text-gray-400 text-sm">{specialty.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutSection;