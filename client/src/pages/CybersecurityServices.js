import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CybersecurityServices = () => {
  const canvasRef = useRef(null);

  // ANIMATED NETWORK BACKGROUND - Same as Home
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
    </div>
  );
};

export default CybersecurityServices;