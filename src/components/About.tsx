import React, { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (!cardRef.current || !sectionRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
      }
    });

    tl.fromTo(cardRef.current,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
      }
    );
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
    <section ref={sectionRef} id="about" className="min-h-screen flex items-center px-6 py-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div 
          ref={cardRef}
          className="bg-black/30 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-cyan-500/30 transition-all duration-500"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.h2 
            className="text-4xl font-bold mb-6 font-display bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            About Me
          </motion.h2>
          
          <motion.p 
            className="text-gray-300 text-lg leading-relaxed mb-6"
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
            that push the boundaries of what's possible in the browser. I believe in the power of technology 
            to solve complex problems and create meaningful connections.
          </motion.p>
          
          <motion.div 
            className="grid grid-cols-2 gap-4"
            variants={itemVariants}
          >
            <div className="text-center p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              <div className="text-2xl font-bold text-cyan-400">5+</div>
              <div className="text-sm text-gray-400">Years Experience</div>
            </div>
            <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <div className="text-2xl font-bold text-purple-400">50+</div>
              <div className="text-sm text-gray-400">Projects Completed</div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div 
            className="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-blue-500/30 transition-all duration-300"
            variants={itemVariants}
          >
            <h3 className="text-xl font-semibold text-white mb-3">Frontend Development</h3>
            <p className="text-gray-400">
              Crafting responsive, interactive user interfaces with React, Vue.js, and modern CSS frameworks.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
            variants={itemVariants}
          >
            <h3 className="text-xl font-semibold text-white mb-3">3D Graphics & WebGL</h3>
            <p className="text-gray-400">
              Creating immersive 3D experiences using Three.js, WebGL shaders, and advanced graphics techniques.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-green-500/30 transition-all duration-300"
            variants={itemVariants}
          >
            <h3 className="text-xl font-semibold text-white mb-3">Backend & Cloud</h3>
            <p className="text-gray-400">
              Building scalable server architectures with Node.js, Python, and cloud platforms like AWS.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;