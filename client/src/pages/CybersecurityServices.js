import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CybersecurityServices = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Page Header */}
      <section className="relative py-20 overflow-hidden" style={{ background: '#0d2847' }}>
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">Cybersecurity Solutions</h1>
            <p className="text-xl text-gray-300">
              Cyber security products and Technology Development • Cyber security consulting and services • Cyber security Training and upskilling
            </p>
          </motion.div>
        </div>
      </section>

      {/* Enterprise-Grade Cybersecurity */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold tracking-wider uppercase mb-4 block" style={{ color: '#00b4d8' }}>
              COMPREHENSIVE PROTECTION
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white">Enterprise-Grade Cybersecurity</h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeInUp} className="cyber-card">
              <div className="mb-4" style={{ color: '#00b4d8' }}>
                <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Antiphishing & Cyber Frauds</h3>
              <p className="text-gray-300">
                Research and development based tactical cyber defense solutions to cater Antiphishing & Cyberfrauds
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="cyber-card">
              <div className="mb-4" style={{ color: '#00b4d8' }}>
                <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Data Leakage Detection & Prevention</h3>
              <p className="text-gray-300">
                Our tactical teams on AI & Cyber security provides next generation solutions on data leakage detection as well as advanced analytics based on context
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="cyber-card">
              <div className="mb-4" style={{ color: '#00b4d8' }}>
                <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Digital Payments & Identity</h3>
              <p className="text-gray-300">
                We provide services and technology development for secure authentication solutions and offline authentication and payments solution development
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="cyber-card">
              <div className="mb-4" style={{ color: '#00b4d8' }}>
                <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Secure Software Development</h3>
              <p className="text-gray-300">
                Providing consultancy for end to end software security processes so that the developed product is safe and secure
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="cyber-card">
              <div className="mb-4" style={{ color: '#00b4d8' }}>
                <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Education & Upskilling</h3>
              <p className="text-gray-300">
                Our workforce with decent experience also conducts cyber education trainings and workshops across areas in cyber security. This includes students training and professional training courses
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="cyber-card">
              <div className="mb-4" style={{ color: '#00b4d8' }}>
                <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Tactical Cyber Security & AI Powered</h3>
              <p className="text-gray-300">
                We provide consultancy and technology development towards tactical & niche areas of security and AI powered cyber defense
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="cyber-card max-w-4xl mx-auto text-center p-12"
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              Protect Your Organization Today
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Schedule a consultation with our security experts
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="cyber-button text-lg px-8 py-4 inline-block">
                Get Started
              </Link>
              <Link 
                to="/about" 
                className="bg-transparent border-2 text-lg px-8 py-4 rounded font-semibold inline-block transition-all"
                style={{ borderColor: '#00b4d8', color: '#00b4d8' }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#00b4d8';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#00b4d8';
                }}
              >
                Learn About Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CybersecurityServices;