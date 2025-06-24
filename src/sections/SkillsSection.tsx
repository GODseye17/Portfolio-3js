import React from 'react';
import { motion, useInView } from 'framer-motion';
import { Code, Database, Cloud, Palette } from 'lucide-react';

interface SkillsSectionProps {
  planetSide: 'left' | 'right';
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ planetSide }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const skillCategories = [
    {
      title: "Frontend",
      icon: Code,
      color: "from-green-400 to-emerald-400",
      skills: [
        { name: "React/Next.js", level: 95 },
        { name: "TypeScript", level: 90 },
        { name: "Three.js/WebGL", level: 85 },
        { name: "Vue.js", level: 80 },
      ]
    },
    {
      title: "Backend",
      icon: Database,
      color: "from-green-500 to-green-600",
      skills: [
        { name: "Node.js", level: 90 },
        { name: "Python", level: 85 },
        { name: "PostgreSQL", level: 80 },
        { name: "MongoDB", level: 75 },
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { 
      y: 50, 
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
    <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-center min-h-screen">
      {/* Planet Space - Green planet representation */}
      <div className={`${planetSide === 'left' ? 'order-1' : 'order-2'} relative`}>
        <motion.div 
          className="w-full h-80 flex items-center justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative">
            {/* Green forest planet - smaller and more visible */}
            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 relative overflow-hidden shadow-2xl">
              {/* Forest patterns */}
              <div className="absolute top-2 left-4 w-12 h-10 bg-green-700 rounded-full opacity-70"></div>
              <div className="absolute bottom-4 right-2 w-16 h-8 bg-green-800 rounded-full opacity-60"></div>
              <div className="absolute top-12 right-4 w-10 h-12 bg-emerald-700 rounded-full opacity-75"></div>
              <div className="absolute bottom-10 left-4 w-12 h-9 bg-green-600 rounded-full opacity-65"></div>
              
              {/* Rivers/water */}
              <div className="absolute top-8 left-2 w-20 h-1.5 bg-blue-400 rounded-full opacity-60 transform rotate-45"></div>
              <div className="absolute bottom-12 right-6 w-16 h-1 bg-blue-500 rounded-full opacity-50 transform -rotate-12"></div>
              
              {/* Clouds */}
              <div className="absolute top-1 left-8 w-12 h-3 bg-white rounded-full opacity-25"></div>
              <div className="absolute bottom-2 left-12 w-10 h-2 bg-white rounded-full opacity-30"></div>
              
              {/* Atmosphere glow */}
              <div className="absolute inset-0 rounded-full bg-green-300 opacity-20 blur-sm"></div>
            </div>
            
            {/* Orbital satellites */}
            <motion.div 
              className="absolute top-2 right-2 w-2 h-2 bg-gray-300 rounded-full"
              animate={{ 
                x: [0, 20, 0, -20, 0],
                y: [0, -12, 0, 12, 0]
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />
            
            <div className="text-center mt-6 text-green-400/60">
              <p className="text-lg font-mono">Verdant - Skills</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        className={`${contentSide === 'left' ? 'order-1' : 'order-2'} space-y-8`}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.div variants={itemVariants}>
          <h2 className="text-4xl font-bold mb-4 font-display bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Skills
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mb-6"></div>
        </motion.div>
        
        <motion.div 
          className="space-y-6"
          variants={containerVariants}
        >
          {skillCategories.map((category, categoryIndex) => (
            <motion.div 
              key={categoryIndex} 
              className="bg-space-dark/30 backdrop-blur-lg rounded-xl p-6 border border-green-400/10 hover:border-green-400/30 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02, boxShadow: '0 10px 25px -5px rgba(34, 197, 94, 0.1)' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 bg-gradient-to-r ${category.color} bg-opacity-20 rounded-full`}>
                  <category.icon className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-green-400">{category.title}</h3>
              </div>
              
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex}>
                    <div className="flex justify-between mb-2">
                      <span className="text-white font-medium text-sm">{skill.name}</span>
                      <span className="text-gray-400 text-xs">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-space-dark/50 rounded-full h-2 overflow-hidden">
                      <motion.div 
                        className={`h-2 rounded-full bg-gradient-to-r ${category.color}`}
                        initial={{ width: "0%" }}
                        animate={isInView ? { width: `${skill.level}%` } : { width: "0%" }}
                        transition={{ duration: 1.5, delay: 0.5 + skillIndex * 0.1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Skills */}
        <motion.div 
          className="bg-space-dark/20 backdrop-blur-lg rounded-xl p-6 border border-green-400/10"
          variants={itemVariants}
        >
          <h3 className="text-xl font-bold text-white mb-4">Additional Expertise</h3>
          <div className="flex flex-wrap gap-3">
            {['WebGL Shaders', 'Machine Learning', 'AR/VR', 'Game Development'].map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 bg-gradient-to-r from-green-400/10 to-emerald-500/10 border border-green-400/20 rounded-full text-sm text-green-400"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SkillsSection;