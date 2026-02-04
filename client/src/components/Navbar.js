import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Cybersecurity & Services', path: '/cybersecurity-services' },
    { name: 'About us', path: '/about' },
  ];

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'backdrop-blur-lg border-b shadow-lg' : ''
      }`}
      style={{
        backgroundColor: isScrolled ? 'rgba(10, 22, 40, 0.95)' : 'rgba(10, 22, 40, 0.7)',
        borderColor: isScrolled ? 'rgba(0, 212, 255, 0.3)' : 'transparent',
        boxShadow: isScrolled ? '0 4px 20px rgba(0, 212, 255, 0.1)' : 'none'
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo + Company Name */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.img 
              src="/images/logo.png" 
              alt="Martianblue Cyber Defense" 
              className="h-12 w-auto"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(0, 212, 255, 0.5))'
              }}
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <span 
              className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300" 
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                textShadow: '0 0 10px rgba(0, 212, 255, 0.3)'
              }}
            >
              Martianblue Cyber Defense
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative group"
              >
                <span
                  className={`font-semibold text-base px-4 py-2 rounded-lg transition-all duration-300 ${
                    location.pathname === link.path
                      ? 'text-cyan-400'
                      : 'text-gray-300 hover:text-white'
                  }`}
                  style={{
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  {link.name}
                </span>
                {/* Active indicator */}
                {location.pathname === link.path && (
                  <motion.div
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-cyan-400"
                    layoutId="activeTab"
                    style={{
                      boxShadow: '0 0 10px rgba(0, 212, 255, 0.8)'
                    }}
                  />
                )}
                {/* Hover effect */}
                <span 
                  className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    location.pathname !== link.path ? 'bg-cyan-500/10' : ''
                  }`}
                />
              </Link>
            ))}
            <Link to="/contact">
              <motion.button 
                className="cyber-button px-6 py-2.5 text-base font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get A Quote
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-white relative z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{
                  filter: 'drop-shadow(0 0 5px rgba(0, 212, 255, 0.5))'
                }}
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </div>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden py-4 border-t"
            style={{ 
              borderColor: 'rgba(0, 212, 255, 0.3)',
              background: 'rgba(10, 22, 40, 0.98)',
              backdropFilter: 'blur(10px)'
            }}
          >
            {navLinks.map((link, index) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={link.path}
                  className={`block py-3 px-4 font-semibold text-base transition-all duration-300 rounded-lg ${
                    location.pathname === link.path
                      ? 'text-cyan-400 bg-cyan-500/10'
                      : 'text-gray-300 hover:text-white hover:bg-cyan-500/5'
                  }`}
                  style={{
                    fontFamily: 'Poppins, sans-serif'
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.1 }}
            >
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="cyber-button w-full mt-4 px-6 py-3 text-base font-bold">
                  Get A Quote
                </button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;