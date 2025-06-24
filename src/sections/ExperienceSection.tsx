import React from 'react';
import { motion, useInView } from 'framer-motion';
import { Calendar, MapPin, ExternalLink, Briefcase } from 'lucide-react';

interface ExperienceSectionProps {
  planetSide: 'left' | 'right';
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ planetSide }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const experiences = [
    {
      title: "Senior Full-Stack Developer",
      company: "Tech Innovators Inc.",
      period: "2022 - Present",
      location: "San Francisco, CA",
      description: "Leading development of next-generation web applications with focus on 3D visualization and real-time data processing.",
      technologies: ["React", "Node.js", "Three.js", "PostgreSQL", "AWS"],
      achievements: [
        "Increased user engagement by 150% with 3D interactive features",
        "Led team of 6 developers on flagship product",
        "Reduced load times by 60% through optimization"
      ]
    },
    {
      title: "Frontend Developer",
      company: "Digital Dynamics",
      period: "2020 - 2022",
      location: "New York, NY",
      description: "Developed responsive web applications and implemented complex UI/UX designs for enterprise clients.",
      technologies: ["Vue.js", "TypeScript", "D3.js", "SCSS", "Docker"],
      achievements: [
        "Built 15+ client applications from scratch",
        "Implemented advanced data visualization tools",
        "Mentored 3 junior developers"
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      x: planetSide === 'left' ? -100 : 100, 
      opacity: 0,
      rotate: planetSide === 'left' ? -5 : 5
    },
    visible: {
      x: 0,
      opacity: 1,
      rotate: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const contentSide = planetSide === 'right' ? 'left' : 'right';

  return (
    <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-center min-h-screen">
      {/* Planet Space - Mars representation */}
      <div className={`${planetSide === 'left' ? 'order-1' : 'order-2'} relative`}>
        <motion.div 
          className="w-full h-80 flex items-center justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative">
            {/* Mars-like planet - smaller and more visible */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-red-600 via-red-500 to-orange-600 relative overflow-hidden shadow-2xl">
              {/* Surface features */}
              <div className="absolute top-3 left-4 w-8 h-6 bg-red-800 rounded-full opacity-60"></div>
              <div className="absolute bottom-4 right-3 w-10 h-4 bg-red-700 rounded-full opacity-70"></div>
              <div className="absolute top-8 right-6 w-6 h-8 bg-orange-700 rounded-full opacity-50"></div>
              <div className="absolute bottom-8 left-6 w-7 h-7 bg-red-900 rounded-full opacity-80"></div>
              
              {/* Polar ice caps */}
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-white rounded-full opacity-40"></div>
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-white rounded-full opacity-30"></div>
              
              {/* Dust storms */}
              <div className="absolute top-4 right-2 w-12 h-2 bg-orange-400 rounded-full opacity-20"></div>
              <div className="absolute bottom-6 left-2 w-10 h-1.5 bg-red-300 rounded-full opacity-25"></div>
              
              {/* Atmosphere glow */}
              <div className="absolute inset-0 rounded-full bg-red-400 opacity-15 blur-sm"></div>
            </div>
            
            {/* Orbital debris */}
            <motion.div 
              className="absolute top-4 right-4 w-1.5 h-1.5 bg-gray-400 rounded-full"
              animate={{ 
                x: [0, 12, 0, -12, 0],
                y: [0, -8, 0, 8, 0]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            
            <div className="text-center mt-6 text-red-400/60">
              <p className="text-lg font-mono">Mars - Experience</p>
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
          <h2 className="text-4xl font-bold mb-4 font-display bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
            Experience
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-red-400 to-orange-500 rounded-full mb-6"></div>
        </motion.div>

        <motion.div className="space-y-6" variants={containerVariants}>
          {experiences.map((exp, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="bg-space-dark/30 backdrop-blur-lg rounded-xl p-6 border border-red-400/10 hover:border-red-400/30 transition-all duration-500"
              whileHover={{ y: -5, scale: 1.02, boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.1)' }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-400/20 rounded-full">
                    <Briefcase className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                    <h4 className="text-red-400 font-semibold">{exp.company}</h4>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400 hover:text-white transition-colors cursor-pointer" />
              </div>
              
              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  {exp.period}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  {exp.location}
                </div>
              </div>
              
              <p className="text-gray-300 mb-4 leading-relaxed">{exp.description}</p>
              
              <div className="mb-4">
                <h5 className="text-white font-semibold mb-2">Key Achievements:</h5>
                <ul className="space-y-1">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="text-gray-400 text-sm flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {exp.technologies.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-3 py-1 bg-gradient-to-r from-red-400/10 to-orange-500/10 border border-red-400/20 rounded-full text-xs text-red-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ExperienceSection;