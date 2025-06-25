// src/components/SectionRenderer.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Calendar, ExternalLink, Github, Linkedin } from 'lucide-react';

interface SectionRendererProps {
  section: any;
  personalInfo?: any;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({ section, personalInfo }) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  switch (section.id) {
    case 'hero':
      return (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold mb-4 font-display bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
          >
            {section.title}
          </motion.h1>
          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-300 mb-4">
            {section.subtitle}
          </motion.p>
          <motion.p variants={itemVariants} className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            {section.content}
          </motion.p>
          {section.highlights && (
            <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3 mb-8">
              {section.highlights.map((tech: string) => (
                <span 
                  key={tech}
                  className="px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full border border-cyan-400/30 text-cyan-400"
                >
                  {tech}
                </span>
              ))}
            </motion.div>
          )}
          {personalInfo?.social && (
            <motion.div variants={itemVariants} className="flex justify-center gap-4">
              <a href={personalInfo.social.github} target="_blank" rel="noopener noreferrer"
                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                <Github className="w-5 h-5 text-cyan-400" />
              </a>
              <a href={personalInfo.social.linkedin} target="_blank" rel="noopener noreferrer"
                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                <Linkedin className="w-5 h-5 text-cyan-400" />
              </a>
            </motion.div>
          )}
        </motion.div>
      );

    case 'about':
      return (
        <motion.div initial="hidden" animate="visible">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 font-display text-white">
            {section.title}
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-6">{section.subtitle}</p>
          <p className="text-lg text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            {section.content}
          </p>
          {section.stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {Object.entries(section.stats).map(([key, value]) => (
                <motion.div 
                  key={key} 
                  className="text-center p-4 bg-white/5 backdrop-blur-lg rounded-xl border border-blue-400/20"
                  whileHover={{ scale: 1.05, borderColor: 'rgba(79, 172, 254, 0.5)' }}
                >
                  <div className="text-2xl font-bold text-blue-400">{value}</div>
                  <div className="text-sm text-gray-400 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      );

    case 'experience':
      return (
        <motion.div initial="hidden" animate="visible">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 font-display text-white">
            {section.title}
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-6">{section.subtitle}</p>
          <p className="text-lg text-gray-400 mb-8">{section.content}</p>
          {section.positions && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {section.positions.map((position: any, index: number) => (
                <motion.div 
                  key={index}
                  className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-red-400/20 text-left"
                  initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.02, borderColor: 'rgba(205, 92, 92, 0.5)' }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-red-400">{position.title}</h3>
                      <p className="text-white font-medium">{position.company}</p>
                    </div>
                    <div className="text-right text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {position.period}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin size={14} />
                        {position.location}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">{position.description}</p>
                  {position.achievements && (
                    <ul className="space-y-1 mb-4">
                      {position.achievements.slice(0, 2).map((achievement: string, i: number) => (
                        <li key={i} className="text-gray-400 text-sm flex items-start gap-2">
                          <span className="text-red-400 mt-1">•</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {position.technologies.map((tech: string) => (
                      <span key={tech} className="px-3 py-1 bg-red-400/10 rounded-full text-xs text-red-400">
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      );

    case 'skills':
      return (
        <motion.div initial="hidden" animate="visible">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 font-display text-white">
            {section.title}
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-6">{section.subtitle}</p>
          <p className="text-lg text-gray-400 mb-8">{section.content}</p>
          {section.categories && (
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {section.categories.map((category: any, catIndex: number) => (
                <motion.div 
                  key={category.title}
                  className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-green-400/20"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: catIndex * 0.1 }}
                  whileHover={{ y: -5, borderColor: 'rgba(34, 139, 34, 0.5)' }}
                >
                  <h3 className="text-green-400 font-bold text-xl mb-4">{category.title}</h3>
                  <div className="space-y-3">
                    {category.skills.slice(0, 4).map((skill: any) => (
                      <div key={skill.name}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-300">{skill.name}</span>
                          <span className="text-sm text-gray-500">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
                          <motion.div 
                            className="h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.level}%` }}
                            transition={{ duration: 1, delay: catIndex * 0.1 + 0.3 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          {section.coursework && (
            <motion.div 
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-sm text-gray-400 mb-2">Relevant Coursework:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {section.coursework.map((course: string) => (
                  <span key={course} className="px-3 py-1 bg-green-400/10 rounded-full text-xs text-green-400">
                    {course}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      );

    case 'projects':
      return (
        <motion.div initial="hidden" animate="visible">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 font-display text-white">
            {section.title}
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-6">{section.subtitle}</p>
          <p className="text-lg text-gray-400 mb-8">{section.content}</p>
          {section.projects && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {section.projects.filter((p: any) => p.featured).map((project: any, index: number) => (
                <motion.div 
                  key={project.title}
                  className="bg-gradient-to-r from-yellow-400/10 to-amber-500/10 backdrop-blur-lg rounded-xl p-6 border border-yellow-400/20"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.02, borderColor: 'rgba(255, 215, 0, 0.5)' }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-yellow-400">{project.title}</h3>
                    <div className="flex gap-2">
                      <a href={project.links.github} className="text-yellow-400 hover:text-yellow-300">
                        <Github size={18} />
                      </a>
                      <a href={project.links.live} className="text-yellow-400 hover:text-yellow-300">
                        <ExternalLink size={18} />
                      </a>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-3">{project.description}</p>
                  {project.features && (
                    <ul className="text-sm text-gray-400 mb-4 space-y-1">
                      {project.features.slice(0, 2).map((feature: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-yellow-400">▸</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech: string) => (
                      <span key={tech} className="px-3 py-1 bg-yellow-400/10 rounded-full text-xs text-yellow-400">
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      );

    case 'contact':
      return (
        <motion.div initial="hidden" animate="visible">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 font-display text-white">
            {section.title}
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-6">{section.subtitle}</p>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">{section.content}</p>
          {section.contactInfo && (
            <motion.div 
              className="space-y-4 max-w-md mx-auto"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } }
              }}
            >
              <motion.a 
                href={`mailto:${section.contactInfo.email}`}
                className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-lg rounded-xl border border-purple-400/20 hover:border-purple-400/50 transition-all"
                variants={itemVariants}
                whileHover={{ x: 10 }}
              >
                <Mail className="text-purple-400" />
                <span className="text-gray-300">{section.contactInfo.email}</span>
              </motion.a>
              <motion.a 
                href={`tel:${section.contactInfo.phone}`}
                className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-lg rounded-xl border border-purple-400/20 hover:border-purple-400/50 transition-all"
                variants={itemVariants}
                whileHover={{ x: 10 }}
              >
                <Phone className="text-purple-400" />
                <span className="text-gray-300">{section.contactInfo.phone}</span>
              </motion.a>
              <motion.div 
                className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-lg rounded-xl border border-purple-400/20"
                variants={itemVariants}
              >
                <MapPin className="text-purple-400" />
                <span className="text-gray-300">{section.contactInfo.location}</span>
              </motion.div>
              <motion.p 
                className="text-purple-400 text-lg font-medium pt-4 text-center"
                variants={itemVariants}
              >
                {section.contactInfo.availability}
              </motion.p>
            </motion.div>
          )}
        </motion.div>
      );

    default:
      return null;
  }
};

export default SectionRenderer;