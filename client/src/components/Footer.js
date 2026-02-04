import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing!');
    setEmail('');
  };

  return (
    <footer 
      className="relative py-16 overflow-hidden" 
      style={{ 
        background: 'linear-gradient(180deg, #061424 0%, #0a1e3d 100%)',
        borderTop: '2px solid rgba(0, 212, 255, 0.3)' 
      }}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Company Info with Logo and Name */}
          <motion.div 
            className="col-span-1 md:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Logo and Company Name Together */}
            <div className="flex items-center space-x-4 mb-6">
              <motion.img 
                src="/logo.png" 
                alt="Martianblue Cyber Defense" 
                className="h-16 w-auto"
                style={{
                  filter: 'drop-shadow(0 0 15px rgba(0, 212, 255, 0.6))'
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <motion.h3 
                className="text-2xl font-bold"
                style={{
                  fontFamily: 'Rajdhani, sans-serif',
                  color: '#ffffff',
                  textShadow: '0 0 20px rgba(0, 212, 255, 0.5)'
                }}
                whileHover={{ scale: 1.02 }}
              >
                Martianblue<br/>Cyber Defense
              </motion.h3>
            </div>
            
            <p 
              className="text-white text-sm leading-relaxed mb-6" 
              style={{
                fontFamily: 'Poppins, sans-serif',
                opacity: 0.9,
                textShadow: '0 0 10px rgba(0, 212, 255, 0.2)'
              }}
            >
              Advanced Anti-Phishing Platform providing comprehensive security solutions 
              for organizations worldwide.
            </p>

            {/* Social Media Icons */}
            <div className="flex space-x-4">
              {['linkedin', 'twitter', 'facebook'].map((social, index) => (
                <motion.a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all"
                  style={{
                    borderColor: 'rgba(0, 212, 255, 0.4)',
                    background: 'rgba(0, 212, 255, 0.1)'
                  }}
                  whileHover={{
                    scale: 1.1,
                    borderColor: '#00d4ff',
                    background: 'rgba(0, 212, 255, 0.2)',
                    boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <span className="text-white text-lg">
                    {social === 'linkedin' && '💼'}
                    {social === 'twitter' && '🐦'}
                    {social === 'facebook' && '👥'}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 
              className="font-bold text-cyan-400 mb-6 text-lg" 
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                textShadow: '0 0 15px rgba(0, 212, 255, 0.5)'
              }}
            >
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Cybersecurity & Services', path: '/cybersecurity-services' },
                { name: 'About us', path: '/about' }
              ].map((link, index) => (
                <motion.li 
                  key={link.path}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link 
                    to={link.path}
                    className="text-white hover:text-cyan-400 transition text-sm flex items-center group"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    <motion.span 
                      className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ x: 5 }}
                    >
                      →
                    </motion.span>
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 
              className="font-bold text-cyan-400 mb-6 text-lg" 
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                textShadow: '0 0 15px rgba(0, 212, 255, 0.5)'
              }}
            >
              Contact
            </h4>
            <div className="space-y-4">
              <motion.div 
                className="flex items-start space-x-3"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-cyan-400 mt-1">📧</span>
                <div>
                  <p 
                    className="text-white text-sm" 
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    admin@martianbluecyberdefense.in
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start space-x-3"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
              
              </motion.div>

              <motion.div 
                className="flex items-start space-x-3"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
               
              </motion.div>
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 
              className="font-bold text-cyan-400 mb-6 text-lg" 
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                textShadow: '0 0 15px rgba(0, 212, 255, 0.5)'
              }}
            >
              Subscribe To Newsletter
            </h4>
            <form onSubmit={handleSubscribe} className="space-y-4">
              <motion.input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 bg-transparent border-2 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400 transition-all"
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  borderColor: 'rgba(0, 212, 255, 0.3)',
                  boxShadow: '0 0 10px rgba(0, 212, 255, 0.1)'
                }}
                whileFocus={{
                  borderColor: '#00d4ff',
                  boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)'
                }}
              />
              <motion.button
                type="submit"
                className="w-full cyber-button px-4 py-3 text-sm font-bold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="pt-8 border-t text-center"
          style={{ borderColor: 'rgba(0, 212, 255, 0.3)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p 
              className="text-white text-sm"
              style={{
                fontFamily: 'Poppins, sans-serif',
                textShadow: '0 0 10px rgba(0, 212, 255, 0.2)'
              }}
            >
              © 2026 Martianblue Cyber Defense. All rights reserved.
            </p>
            
            <div className="flex space-x-6">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item, index) => (
                <motion.a
                  key={item}
                  href="#"
                  className="text-white text-sm hover:text-cyan-400 transition"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;