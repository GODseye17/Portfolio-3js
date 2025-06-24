import React, { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Experience: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const experiences = [
    {
      title: "Senior Full-Stack Developer",
      company: "Tech Innovators Inc.",
      period: "2022 - Present",
      location: "San Francisco, CA",
      description: "Leading development of next-generation web applications with focus on 3D visualization and real-time data processing.",
      technologies: ["React", "Node.js", "Three.js", "PostgreSQL", "AWS"],
      link: "#"
    },
    {
      title: "Frontend Developer",
      company: "Digital Dynamics",
      period: "2020 - 2022",
      location: "New York, NY",
      description: "Developed responsive web applications and implemented complex UI/UX designs for enterprise clients.",
      technologies: ["Vue.js", "TypeScript", "D3.js", "SCSS", "Docker"],
      link: "#"
    },
    {
      title: "Junior Developer",
      company: "StartUp Studio",
      period: "2019 - 2020",
      location: "Austin, TX",
      description: "Built and maintained multiple client websites while learning modern development practices and agile methodologies.",
      technologies: ["HTML5", "CSS3", "JavaScript", "PHP", "MySQL"],
      link: "#"
    }
  ];

  useEffect(() => {
    if (!timelineRef.current || !sectionRef.current) return;
    
    const items = timelineRef.current.querySelectorAll('.timeline-item');
    
    items.forEach((item, index) => {
      gsap.fromTo(item,
        { x: index % 2 === 0 ? -100 : 100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
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
    <section ref={sectionRef} id="experience" className="min-h-screen flex items-center px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          className="text-4xl font-bold text-center mb-16 font-display bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Professional Experience
        </motion.h2>
        
        <div ref={timelineRef} className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-0.5 w-0.5 h-full bg-gradient-to-b from-cyan-500 to-purple-500"></div>
          
          {experiences.map((exp, index) => (
            <motion.div 
              key={index} 
              className={`timeline-item relative flex items-center mb-12 ${
                index % 2 === 0 ? 'flex-row-reverse' : ''
              }`}
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {/* Timeline dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-cyan-500 rounded-full border-4 border-gray-900 z-10"></div>
              
              {/* Content */}
              <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'pl-8'}`}>
                <motion.div 
                  className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all duration-500"
                  variants={itemVariants}
                  whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 255, 255, 0.1)' }}
                >
                  <h3 className="text-xl font-bold text-white mb-2">{exp.title}</h3>
                  <h4 className="text-cyan-400 font-semibold mb-3">{exp.company}</h4>
                  
                  <div className="flex items-center gap-4 mb-3 text-sm text-gray-400">
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
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {exp.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full text-xs text-cyan-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <a 
                    href={exp.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-cyan-400 hover:text-white transition-colors"
                  >
                    View Company <ExternalLink size={14} className="ml-1" />
                  </a>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;