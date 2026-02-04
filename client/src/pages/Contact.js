import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    requirement: ''
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await axios.post('http://localhost:5000/api/contact', formData);
      setStatus({ 
        type: 'success', 
        message: 'Thank you! Your message has been sent successfully.' 
      });
      setFormData({
        name: '',
        phone: '',
        email: '',
        service: '',
        requirement: ''
      });
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: 'Something went wrong. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Page Header */}
      <section className="relative py-20 overflow-hidden bg-cyber-navy/30">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">Contact Us</h1>
            <p className="text-xl text-gray-300">
              Get in touch with our cybersecurity experts
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="cyber-card"
            >
              <h3 className="text-3xl font-bold mb-6">Message Us</h3>
              
              {status.message && (
                <div className={`mb-6 p-4 rounded ${
                  status.type === 'success' 
                    ? 'bg-green-500/20 border border-green-500 text-green-400' 
                    : 'bg-red-500/20 border border-red-500 text-red-400'
                }`}>
                  {status.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter Your Name"
                    required
                    className="w-full px-4 py-3 bg-cyber-dark border border-cyber-blue/30 rounded focus:border-cyber-blue focus:outline-none text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Phone No. *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter Your Phone No."
                    required
                    className="w-full px-4 py-3 bg-cyber-dark border border-cyber-blue/30 rounded focus:border-cyber-blue focus:outline-none text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Email ID *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter Email ID"
                    required
                    className="w-full px-4 py-3 bg-cyber-dark border border-cyber-blue/30 rounded focus:border-cyber-blue focus:outline-none text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Service You Require</label>
                  <input
                    type="text"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    placeholder="Service You Require"
                    className="w-full px-4 py-3 bg-cyber-dark border border-cyber-blue/30 rounded focus:border-cyber-blue focus:outline-none text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Your Requirement</label>
                  <textarea
                    name="requirement"
                    value={formData.requirement}
                    onChange={handleChange}
                    placeholder="Details Of Requirement..."
                    rows="4"
                    className="w-full px-4 py-3 bg-cyber-dark border border-cyber-blue/30 rounded focus:border-cyber-blue focus:outline-none text-white resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full cyber-button text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="space-y-8"
            >
              <div className="cyber-card">
                <h3 className="text-3xl font-bold mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-cyber-blue">Email</h4>
                    <p className="text-gray-300">
admin@martianbluecyberdefense.in</p>
                    
                  </div>

                 

                  <div>
                    <h4 className="text-xl font-bold mb-2 text-cyber-blue">Office Hours</h4>
                    <p className="text-gray-300">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-300">Saturday: 10:00 AM - 4:00 PM</p>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold mb-2 text-cyber-blue">Follow Us</h4>
                    <p className="text-gray-300">
                      Connect with us on social media for updates and insights
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;