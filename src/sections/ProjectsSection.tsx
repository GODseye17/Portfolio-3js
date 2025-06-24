import React from 'react';
import { motion, useInView } from 'framer-motion';
import { ExternalLink, Github, Play, Star } from 'lucide-react';

interface ProjectsSectionProps {
  planetSide: 'left' | 'right';
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ planetSide }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const projects = [
    {
      title: "3D Data Visualization Platform",
      description: "Interactive 3D platform for visualizing complex datasets with real-time updates and WebGL shaders.",
      technologies: ["Three.js", "React", "Node.js", "WebGL", "D3.js"],
      featured: true,
      stats: { stars: 234, forks: 45, users: "10K+" },
      links: { demo: "#", github: "#", live: "#" }
    },
    {
      title: "Real-time Collaboration App",
      description: "Multi-user collaboration platform with WebRTC, real-time sync, and 3D workspace visualization.",
      technologies: ["Vue.js", "Socket.io", "WebRTC", "MongoDB", "Redis"],
      featured: true,
      stats: { stars: 189, forks: 32, users: "5K+" },
      links: { demo: "#", github: "#", live: "#" }
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
      x: planetSide === 'left' ? -50 : 50
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
      {/* Planet Space - Saturn-like yellow planet */}
      <div className={`${planetSide === 'left' ? 'order-1' : 'order-2'} relative`}>
        <motion.div 
          className="w-full h-80 flex items-center justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative">
            {/* Saturn-like yellow planet - smaller and more visible */}
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 relative overflow-hidden shadow-2xl">
              {/* Surface bands */}
              <div className="absolute top-4 left-0 w-full h-2 bg-yellow-600 opacity-40"></div>
              <div className="absolute top-8 left-0 w-full h-1.5 bg-amber-600 opacity-50"></div>
              <div className="absolute top-12 left-0 w-full h-3 bg-yellow-500 opacity-30"></div>
              <div className="absolute bottom-6 left-0 w-full h-1.5 bg-orange-500 opacity-45"></div>
              
              {/* Storm spots */}
              <div className="absolute top-6 right-4 w-4 h-3 bg-orange-600 rounded-full opacity-60"></div>
              <div className="absolute bottom-8 left-6 w-3 h-2 bg-red-500 rounded-full opacity-50"></div>
              
              {/* Atmosphere glow */}
              <div className="absolute inset-0 rounded-full bg-yellow-200 opacity-25 blur-sm"></div>
            </div>
            
            {/* Saturn rings - smaller */}
            <motion.div 
              className="absolute inset-0 border-3 border-yellow-400/40 rounded-full w-44 h-12 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              style={{ clipPath: 'ellipse(50% 25% at 50% 50%)' }}
            />
            <motion.div 
              className="absolute inset-0 border-2 border-yellow-300/30 rounded-full w-48 h-14 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              style={{ clipPath: 'ellipse(50% 22% at 50% 50%)' }}
            />
            
            {/* Moons */}
            <motion.div 
              className="absolute top-4 right-8 w-1.5 h-1.5 bg-gray-300 rounded-full"
              animate={{ 
                x: [0, 15, 0, -15, 0],
                y: [0, -10, 0, 10, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            
            <div className="text-center mt-8 text-yellow-400/60">
              <p className="text-lg font-mono">Saturn - Projects</p>
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
          <h2 className="text-4xl font-bold mb-4 font-display bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
            Projects
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full mb-6"></div>
        </motion.div>
        
        <motion.div className="space-y-6" variants={containerVariants}>
          {projects.map((project, index) => (
            <motion.div 
              key={index} 
              className={`group bg-space-dark/30 backdrop-blur-lg rounded-xl overflow-hidden border border-yellow-400/10 hover:border-yellow-400/30 transition-all duration-500 ${
                project.featured ? 'ring-2 ring-yellow-400/20' : ''
              }`}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02, boxShadow: '0 20px 25px -5px rgba(251, 191, 36, 0.1)' }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                        {project.title}
                      </h3>
                      {project.featured && (
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      )}
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <motion.a 
                      href={project.links.live}
                      className="p-2 bg-yellow-400/20 rounded-full text-yellow-400 hover:bg-yellow-400/30 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ExternalLink size={16} />
                    </motion.a>
                    <motion.a 
                      href={project.links.github}
                      className="p-2 bg-yellow-400/20 rounded-full text-yellow-400 hover:bg-yellow-400/30 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Github size={16} />
                    </motion.a>
                    <motion.a 
                      href={project.links.demo}
                      className="p-2 bg-yellow-400/20 rounded-full text-yellow-400 hover:bg-yellow-400/30 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Play size={16} />
                    </motion.a>
                  </div>
                </div>
                
                {/* Project Stats */}
                <div className="flex items-center gap-6 mb-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Star size={14} />
                    {project.stats.stars}
                  </div>
                  <div className="flex items-center gap-1">
                    <Github size={14} />
                    {project.stats.forks}
                  </div>
                  <div>
                    👥 {project.stats.users} users
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-gradient-to-r from-yellow-400/10 to-amber-500/10 border border-yellow-400/20 rounded-full text-xs text-yellow-400"
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
          className="text-center pt-6"
          variants={itemVariants}
        >
          <motion.button 
            className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-8 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/25"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Projects
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProjectsSection;