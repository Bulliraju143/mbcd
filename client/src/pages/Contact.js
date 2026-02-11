import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Contact = () => {
  const canvasRef = useRef(null);
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

  // ANIMATED NETWORK BACKGROUND
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    class NetworkNode {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 2.5 + 1;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
        
        this.pulsePhase += 0.03;
      }

      draw() {
        const pulse = Math.sin(this.pulsePhase) * 0.5 + 0.5;
        const size = this.radius + pulse * 1.5;
        
        ctx.shadowBlur = 8 + pulse * 4;
        ctx.shadowColor = '#00a8c0';
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
        
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, size);
        gradient.addColorStop(0, `rgba(0, 210, 230, ${0.6 + pulse * 0.15})`);
        gradient.addColorStop(0.5, `rgba(0, 180, 200, ${0.4 + pulse * 0.15})`);
        gradient.addColorStop(1, 'rgba(0, 150, 180, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    class FlowingLine {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.length = Math.random() * 100 + 50;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 2 + 1;
        this.life = 0;
        this.maxLife = Math.random() * 60 + 40;
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.life++;
        
        if (this.life > this.maxLife || 
            this.x < -100 || this.x > canvas.width + 100 ||
            this.y < -100 || this.y > canvas.height + 100) {
          this.reset();
        }
      }

      draw() {
        const lifeRatio = this.life / this.maxLife;
        const opacity = Math.sin(lifeRatio * Math.PI) * 0.25;
        
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
          this.x - Math.cos(this.angle) * this.length,
          this.y - Math.sin(this.angle) * this.length
        );
        
        const gradient = ctx.createLinearGradient(
          this.x, this.y,
          this.x - Math.cos(this.angle) * this.length,
          this.y - Math.sin(this.angle) * this.length
        );
        gradient.addColorStop(0, `rgba(0, 200, 220, ${opacity})`);
        gradient.addColorStop(1, 'rgba(0, 200, 220, 0)');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 5;
        ctx.shadowColor = 'rgba(0, 180, 200, 0.2)';
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }

    const nodes = [];
    const nodeCount = 60;
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new NetworkNode());
    }

    const flowingLines = [];
    for (let i = 0; i < 12; i++) {
      flowingLines.push(new FlowingLine());
    }

    function drawConnections() {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 180) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            
            const opacity = (1 - distance / 180) * 0.2;
            const gradient = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            gradient.addColorStop(0, `rgba(0, 200, 180, ${opacity})`);
            gradient.addColorStop(1, `rgba(0, 180, 200, ${opacity})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.shadowBlur = 3;
            ctx.shadowColor = 'rgba(0, 180, 200, 0.1)';
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        }
      }
    }

    function animate() {
      ctx.fillStyle = 'rgba(10, 37, 64, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      flowingLines.forEach(line => {
        line.update();
        line.draw();
      });
      
      nodes.forEach(node => {
        node.update();
        node.draw();
      });
      drawConnections();
      animationFrameId = requestAnimationFrame(animate);
    }

    animate();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a2540 0%, #0d3a5c 35%, #115073 65%, #0d3a5c 100%)' }}>
      {/* Animated Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full pointer-events-none"
        style={{ zIndex: 1, height: '100%' }}
      />

      {/* Main Content */}
      <div className="relative min-h-screen pt-20" style={{ zIndex: 10 }}>
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
    </div>
  );
};

export default Contact;