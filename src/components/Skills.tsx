import React, { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Skills: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const skillCategories = [
    {
      title: "Frontend",
      color: "cyan",
      skills: [
        { name: "React/Next.js", level: 95 },
        { name: "TypeScript", level: 90 },
        { name: "Three.js/WebGL", level: 85 },
        { name: "Vue.js", level: 80 },
      ]
    },
    {
      title: "Backend",
      color: "purple",
      skills: [
        { name: "Node.js", level: 90 },
        { name: "Python", level: 85 },
        { name: "PostgreSQL", level: 80 },
        { name: "MongoDB", level: 75 },
      ]
    },
    {
      title: "DevOps & Tools",
      color: "green",
      skills: [
        { name: "AWS/GCP", level: 80 },
        { name: "Docker", level: 85 },
        { name: "Git/GitHub", level: 95 },
        { name: "CI/CD", level: 75 },
      ]
    }
  ];

  const getColorClass = (color: string, type: 'bg' | 'border' | 'text') => {
    const colors: { [key: string]: { [key: string]: string } } = {
      cyan: { bg: 'bg-cyan-500', border: 'border-cyan-500', text: 'text-cyan-400' },
      purple: { bg: 'bg-purple-500', border: 'border-purple-500', text: 'text-purple-400' },
      green: { bg: 'bg-green-500', border: 'border-green-500', text: 'text-green-400' },
    };
    return colors[color][type];
  };

  useEffect(() => {
    if (!skillsRef.current || !sectionRef.current) return;
    
    const progressBars = skillsRef.current.querySelectorAll('.progress-bar');
    
    progressBars.forEach((bar) => {
      const level = bar.getAttribute('data-level');
      gsap.fromTo(bar,
        { width: 0 },
        {
          width: `${level}%`,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: bar,
            start: "top 85%",
          }
        }
      );
    });

    const categories = skillsRef.current.querySelectorAll('.skill-category');
    categories.forEach((category, index) => {
      gsap.fromTo(category,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: index * 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: category,
            start: "top 85%",
          }
        }
      );
    });
  }, []);

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section ref={sectionRef} id="skills" className="min-h-screen flex items-center px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          className="text-4xl font-bold text-center mb-16 font-display bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Technical Skills
        </motion.h2>
        
        <motion.div 
          ref={skillsRef} 
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {skillCategories.map((category, categoryIndex) => (
            <motion.div 
              key={categoryIndex} 
              className="skill-category bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}
            >
              <h3 className={`text-xl font-bold mb-6 ${getColorClass(category.color, 'text')}`}>
                {category.title}
              </h3>
              
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex}>
                    <div className="flex justify-between mb-2">
                      <span className="text-white font-medium">{skill.name}</span>
                      <span className="text-gray-400 text-sm">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`progress-bar h-2 rounded-full ${getColorClass(category.color, 'bg')}`}
                        data-level={skill.level}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 3D Skills Visualization Placeholder */}
        <motion.div 
          className="mt-16"
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div 
            className="bg-black/20 backdrop-blur-lg rounded-xl p-8 border border-white/10 hover:border-cyan-500/20 transition-all duration-300"
            whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}
          >
            <h3 className="text-2xl font-bold text-white mb-4">Interactive Skills Visualization</h3>
            <p className="text-gray-400 mb-6">
              Explore my skills in an interactive 3D environment - hover and click to discover more!
            </p>
            <div className="h-64 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-lg border border-cyan-500/20 flex items-center justify-center">
              <div className="text-cyan-400 text-lg font-medium">3D Skills Sphere Coming Soon</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;