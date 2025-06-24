import React, { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, MessageCircle } from 'lucide-react';

interface ContactSectionProps {
  planetSide: 'left' | 'right';
}

const ContactSection: React.FC<ContactSectionProps> = ({ planetSide }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      
      // Reset submission status after 3 seconds
      setTimeout(() => setIsSubmitted(false), 3000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

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
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const contentSide = planetSide === 'right' ? 'left' : 'right';

  return (
    <div ref={ref} className="grid lg:grid-cols-1 gap-16 items-center min-h-screen max-w-4xl mx-auto">
      {/* Content - Full width without planet */}
      <motion.div
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.div variants={itemVariants} className="text-center">
          <h2 className="text-5xl font-bold mb-6 font-display bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
            Let's Connect
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full mb-8 mx-auto"></div>
        </motion.div>

        <motion.p 
          className="text-xl text-gray-300 leading-relaxed mb-8 text-center max-w-2xl mx-auto"
          variants={itemVariants}
        >
          Ready to bring your ideas to life? Let's discuss your next project and create something amazing together.
        </motion.p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <h3 className="text-2xl font-bold text-white mb-6">Get In Touch</h3>
            {[
              { icon: Mail, label: "Email", value: "yash.shankaram@email.com", href: "mailto:yash.shankaram@email.com" },
              { icon: Phone, label: "Phone", value: "+1 (555) 123-4567", href: "tel:+15551234567" },
              { icon: MapPin, label: "Location", value: "San Francisco, CA", href: "#" }
            ].map((contact, index) => (
              <motion.a
                key={contact.label}
                href={contact.href}
                className="flex items-center gap-4 p-4 bg-space-dark/30 backdrop-blur-lg rounded-xl border border-blue-400/10 hover:border-blue-400/30 transition-all duration-300"
                whileHover={{ x: 10, backgroundColor: "rgba(59, 130, 246, 0.05)" }}
              >
                <div className="p-3 bg-blue-400/20 rounded-full">
                  <contact.icon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-white font-medium">{contact.label}</div>
                  <div className="text-gray-400 text-sm">{contact.value}</div>
                </div>
              </motion.a>
            ))}

            {/* Social Links */}
            <motion.div 
              className="flex gap-4 pt-4"
              variants={itemVariants}
            >
              {[
                { icon: Github, href: "https://github.com", label: "GitHub" },
                { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
                { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
                { icon: MessageCircle, href: "#", label: "Discord" }
              ].map(({ icon: Icon, href, label }) => (
                <motion.a 
                  key={label}
                  href={href}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-blue-400/20 rounded-full text-blue-400 hover:bg-blue-400/30 transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={label}
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Quick Contact Form */}
          <motion.form 
            onSubmit={handleSubmit}
            className="bg-space-dark/30 backdrop-blur-lg rounded-xl p-6 border border-blue-400/10"
            variants={itemVariants}
          >
            <h3 className="text-xl font-bold text-white mb-4">Quick Message</h3>
            
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                className="w-full px-4 py-3 bg-space-dark/50 border border-blue-400/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-colors"
              />
              
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
                className="w-full px-4 py-3 bg-space-dark/50 border border-blue-400/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-colors"
              />
              
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me about your project..."
                required
                rows={4}
                className="w-full px-4 py-3 bg-space-dark/50 border border-blue-400/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-colors resize-none"
              />
              
              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-400 to-cyan-500 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-blue-400/25 disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending...
                  </>
                ) : isSubmitted ? (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Message Sent!
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactSection;