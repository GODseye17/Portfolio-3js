import React, { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Github, Play } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const projects = [
    {
      title: "3D Data Visualization Platform",
      description: "Interactive 3D platform for visualizing complex datasets with real-time updates and WebGL shaders.",
      image: "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=800",
      technologies: ["Three.js", "React", "Node.js", "WebGL", "D3.js"],
      links: {
        demo: "#",
        github: "#",
        live: "#"
      }
    },
    {
      title: "Real-time Collaboration App",
      description: "Multi-user collaboration platform with WebRTC, real-time sync, and 3D workspace visualization.",
      image: "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800",
      technologies: ["Vue.js", "Socket.io", "WebRTC", "MongoDB", "Redis"],
      links: {
        demo: "#",
        github: "#",
        live: "#"
      }
    },
    {
      title: "AI-Powered Design Tool",
      description: "Machine learning-enhanced design tool with procedural generation and intelligent asset recommendations.",
      image: "https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=800",
      technologies: ["TensorFlow.js", "React", "Python", "FastAPI", "PostgreSQL"],
      links: {
        demo: "#",
        github: "#",
        live: "#"
      }
    },
    {
      title: "VR Web Experience",
      description: "Immersive VR experience running in the browser with hand tracking and spatial audio.",
      image: "https://images.pexels.com/photos/2653362/pexels-photo-2653362.jpeg?auto=compress&cs=tinysrgb&w=800",
      technologies: ["A-Frame", "WebXR", "Three.js", "Web Audio API"],
      links: {
        demo: "#",
        github: "#",
        live: "#"
      }
    }
  ];

  useEffect(() => {
    if (!projectsRef.current || !sectionRef.current) return;
    
    const projectCards = projectsRef.current.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
      gsap.fromTo(card,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: index * 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
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
    <section ref={sectionRef} id="projects" className="min-h-screen flex items-center px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          className="text-4xl font-bold text-center mb-16 font-display bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Featured Projects
        </motion.h2>
        
        <motion.div 
          ref={projectsRef} 
          className="grid md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {projects.map((project, index) => (
            <motion.div 
              key={index} 
              className="project-card group bg-black/30 backdrop-blur-lg rounded-xl overflow-hidden border border-white/10 hover:border-cyan-500/30 transition-all duration-500"
              variants={itemVariants}
              whileHover={{ y: -10, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <motion.a 
                    href={project.links.live}
                    className="p-2 bg-black/50 rounded-full text-white hover:bg-cyan-500/50 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLink size={16} />
                  </motion.a>
                  <motion.a 
                    href={project.links.github}
                    className="p-2 bg-black/50 rounded-full text-white hover:bg-cyan-500/50 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Github size={16} />
                  </motion.a>
                  <motion.a 
                    href={project.links.demo}
                    className="p-2 bg-black/50 rounded-full text-white hover:bg-cyan-500/50 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play size={16} />
                  </motion.a>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full text-xs text-cyan-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="text-center mt-12"
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.button 
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Projects
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;