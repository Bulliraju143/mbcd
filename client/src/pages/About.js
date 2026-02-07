import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const About = () => {
  const reasons = [
    {
      title: 'Market Research',
      description: 'Continuous research into emerging phishing tactics, data-driven market intelligence tailored to your sector.',
    },
    {
      title: 'Protect Every Device',
      description: 'Comprehensive security solutions safeguarding every device, everywhere.',
    },
    {
      title: 'User Experience',
      description: 'Delivering seamless solutions that empower user satisfaction and digital trust.',
    },
    {
      title: 'Protect Data Traffic',
      description: 'Safeguarding data in transit with advanced encryption and secure channels.',
    },
    {
      title: 'Remote Access',
      description: 'Enable secure and seamless remote access without compromising security.',
    },
    {
      title: 'Manage Access',
      description: 'Centralized access control to protect your systems while ensuring smooth operations.',
    },
  ];

  const team = [
    { 
      name: 'Dr. Gaurav Varshney', 
      role: 'Assistant Professor CSE', 
      experience: '15+ years in cybersecurity',
      image: '/team-member.jpg' // You'll need to add actual image
    },
  ];

  const stats = [
    { value: '50+', label: 'Security Experts' },
    { value: '1000+', label: 'Organizations Protected' },
    { value: '99.9%', label: 'Uptime Guarantee' },
    { value: '24/7', label: 'Support Available' },
  ];

  const Card = ({ item, index }) => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="cyber-card text-center"
      >
        <h3 className="text-xl font-display font-semibold mb-3" style={{ color: '#00b4d8' }}>
          {item.title || item.name}
        </h3>
        <p className="text-gray-400">{item.description || item.role}</p>
        {item.experience && <p className="text-sm mt-2" style={{ color: '#00b4d8' }}>{item.experience}</p>}
      </motion.div>
    );
  };

  // Create separate component for stats to avoid hooks in callback
  const StatCard = ({ stat, index }) => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
    
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="relative group"
      >
        <div className="absolute inset-0 rounded-lg blur-xl opacity-25 group-hover:opacity-50 transition-opacity" style={{ background: 'linear-gradient(135deg, #00b4d8 0%, #06ffa5 100%)' }}></div>
        <div className="relative glass-effect rounded-lg p-8 text-center">
          <h3 className="text-5xl font-display font-bold mb-2" style={{ color: '#00b4d8' }}>{stat.value}</h3>
          <p className="text-gray-400 font-medium">{stat.label}</p>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative pt-32 pb-20">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-white">About Us</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Leading the fight against phishing and cyber threats worldwide
          </p>
        </motion.div>
      </section>


      

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 py-20" style={{ background: '#0d2847', borderRadius: '8px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold tracking-wider uppercase mb-4 block" style={{ color: '#00b4d8' }}>
            OUR MISSION
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
            We Are Reliable In Terms Of Cyber Security
          </h2>
          <div className="max-w-4xl mx-auto space-y-6 text-gray-300 text-lg leading-relaxed">
            <p>
              At Martianblue Cyber Defense, we protect you from the dangers of cyberspace. Our comprehensive 
              anti-phishing platform combines AI-powered threat detection, tactical cyber defense solutions, and 
              advanced analytics to safeguard your organization's digital assets. From research and development-based 
              antiphishing solutions to data leakage prevention, we deliver next-generation security that 
              adapts to evolving threats.
            </p>
            <p>
              Whether through secure software development, digital identity protection, or AI-powered cyber 
              defense consultancy, our commitment to your security is unwavering. We provide end-to-end 
              cybersecurity products, consulting services, and training programs that ensure your organization stays 
              secure, resilient, and prepared for tomorrow's challenges.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Testimonial */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-effect rounded-2xl p-12 text-center"
        >
          <span className="text-sm font-semibold tracking-wider uppercase mb-8 block" style={{ color: '#00b4d8' }}>
            TESTIMONIALS
          </span>
          <h3 className="text-3xl font-display font-bold mb-8 text-white">What Our Clients Say</h3>
          <p className="text-2xl text-gray-300 italic mb-8 leading-relaxed">
            "The team is very friendly and assisted with their services, strongly recommend them."
          </p>
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center border-2" style={{ borderColor: '#00b4d8', background: '#0d2847' }}>
                <span className="text-xl font-bold" style={{ color: '#00b4d8' }}>Client</span>
              </div>
              <div className="text-left">
                <h4 className="text-xl font-semibold text-white">Laura Reddick</h4>
                <p style={{ color: '#00b4d8' }}>CEO, TechCorp</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>


      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative glass-effect rounded-2xl p-12 text-center border-2" style={{ borderColor: 'rgba(0, 180, 216, 0.3)' }}
        >
          <h2 className="text-4xl font-display font-bold mb-6 text-white">Ready To Work With Us?</h2>
          <p className="text-xl text-gray-300 mb-8">Let's discuss how we can protect your organization</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <button className="cyber-button text-lg px-8 py-4">Get In Touch</button>
            </Link>
            <Link to="/cybersecurity-services">
              <button 
                className="px-8 py-4 rounded-lg glass-effect border text-white hover:bg-white/10 transition-all duration-300 font-semibold"
                style={{ borderColor: 'rgba(0, 180, 216, 0.5)' }}
              >
                View Services
              </button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;