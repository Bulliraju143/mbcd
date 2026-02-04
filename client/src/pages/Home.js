import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const [videoError, setVideoError] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  
  // Smooth spring animation for parallax
  const springConfig = { stiffness: 50, damping: 20 };
  const x = useSpring(useTransform(scrollYProgress, [0, 1], [0, -100]), springConfig);
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, 100]), springConfig);
  
  // Track mouse position for parallax effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Handle video loading with audio enabled
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Add event listeners
      const handleLoadedData = () => {
        console.log('Video loaded successfully');
        setVideoError(false);
      };

      const handleError = (e) => {
        console.error('Video loading error:', e);
        setVideoError(true);
      };

      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('error', handleError);

      // Start with unmuted audio
      video.muted = isMuted;
      video.volume = 0.7; // Set to 70% volume
      
      // Try to play with audio
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsVideoPlaying(true);
            console.log('Video playing with audio');
          })
          .catch(error => {
            console.log('Video autoplay prevented:', error);
            // If autoplay with sound fails, try muted first then unmute
            video.muted = true;
            setIsMuted(true);
            video.play().then(() => {
              setIsVideoPlaying(true);
            }).catch(err => {
              console.log('Video play failed:', err);
            });
          });
      }

      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('error', handleError);
      };
    }
  }, [isMuted]);

  // Toggle video play/pause on click
  const handleVideoClick = () => {
    const video = videoRef.current;
    if (video && !videoError) {
      if (video.paused) {
        video.play();
        setIsVideoPlaying(true);
      } else {
        video.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  // Toggle mute/unmute
  const toggleMute = (e) => {
    e.stopPropagation(); // Prevent video click handler
    const video = videoRef.current;
    if (video) {
      const newMutedState = !isMuted;
      video.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = (e) => {
    e.stopPropagation(); // Prevent video click handler
    const container = videoContainerRef.current;
    
    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Toggle Picture-in-Picture
  const togglePiP = async (e) => {
    e.stopPropagation(); // Prevent video click handler
    const video = videoRef.current;
    
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled && video) {
        await video.requestPictureInPicture();
      }
    } catch (error) {
      console.error('Picture-in-Picture error:', error);
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
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2.5 + 1;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        this.pulsePhase += 0.03;
      }

      draw() {
        const pulse = Math.sin(this.pulsePhase) * 0.5 + 0.5;
        const size = this.radius + pulse * 1.5;
        
        ctx.shadowBlur = 12 + pulse * 8;
        ctx.shadowColor = '#00d4ff';
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
        
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, size);
        gradient.addColorStop(0, `rgba(0, 255, 255, ${0.8 + pulse * 0.2})`);
        gradient.addColorStop(0.5, `rgba(0, 212, 255, ${0.6 + pulse * 0.2})`);
        gradient.addColorStop(1, 'rgba(0, 180, 216, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const nodes = [];
    const nodeCount = 50;
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new NetworkNode());
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
            
            const opacity = (1 - distance / 180) * 0.3;
            const gradient = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            gradient.addColorStop(0, `rgba(0, 255, 159, ${opacity})`);
            gradient.addColorStop(1, `rgba(0, 212, 255, ${opacity})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Hero Section with Two-Column Layout */}
      <motion.section 
        className="relative min-h-screen flex items-center justify-center pt-24 pb-20 px-6"
        style={{ 
          opacity: heroOpacity,
          zIndex: 1
        }}
      >
        <div className="container mx-auto max-w-7xl">
          {/* Main Heading Centered Above */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold leading-tight mb-4"
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                textShadow: '0 0 40px rgba(0, 212, 255, 0.7), 0 0 80px rgba(0, 212, 255, 0.4)',
                color: '#ffffff'
              }}
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Martianblue Anti-Phishing Platform
            </motion.h1>
          </motion.div>

          {/* Content Grid - Two Columns Below Heading */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              className="space-y-8"
            >
              {/* Subtitle */}
              <motion.h2 
                className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6"
                style={{
                  fontFamily: 'Rajdhani, sans-serif',
                  color: '#00d4ff',
                  textShadow: '0 0 30px rgba(0, 212, 255, 0.7)'
                }}
                animate={{
                  x: [-8, 8, -8],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Protect Yourself From The Dangers Of Cyberspace
              </motion.h2>
              
              {/* Description */}
              <motion.p 
                className="text-lg md:text-xl lg:text-2xl leading-relaxed"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  color: 'rgba(255, 255, 255, 0.95)',
                }}
                animate={{
                  opacity: [0.9, 1, 0.9],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Provides comprehensive protection against phishing attacks, securing your organization's digital assets and training your team to recognize threats.
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                <Link to="/contact">
                  <motion.button 
                    className="cyber-button text-xl px-12 py-5 font-bold"
                    whileHover={{ 
                      scale: 1.08,
                      boxShadow: '0 20px 60px rgba(0, 212, 255, 0.7)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      boxShadow: [
                        '0 10px 30px rgba(0, 212, 255, 0.4)',
                        '0 15px 45px rgba(0, 212, 255, 0.6)',
                        '0 10px 30px rgba(0, 212, 255, 0.4)'
                      ]
                    }}
                    transition={{
                      boxShadow: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                  >
                    Get Started
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Column - Video Player */}
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
              className="relative flex justify-center items-center"
            >
              <div 
                ref={videoContainerRef}
                className="relative rounded-3xl overflow-hidden group cursor-pointer w-full"
                onClick={handleVideoClick}
                style={{
                  boxShadow: '0 20px 60px rgba(255, 255, 255, 0.1)',
                  border: isFullscreen ? 'none' : '2px solid rgba(255, 255, 255, 0.2)',
                  maxWidth: '650px',
                  borderRadius: isFullscreen ? '0' : '1.5rem',
                  position: isFullscreen ? 'fixed' : 'relative',
                  top: isFullscreen ? '0' : 'auto',
                  left: isFullscreen ? '0' : 'auto',
                  width: isFullscreen ? '100vw' : '100%',
                  height: isFullscreen ? '100vh' : 'auto',
                  zIndex: isFullscreen ? 9999 : 'auto',
                  background: isFullscreen ? '#000' : 'transparent'
                }}
              >
                <div className="relative bg-cyber-dark overflow-hidden" style={{ 
                  borderRadius: isFullscreen ? '0' : '1.5rem',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {!videoError ? (
                    <>
                      <video
                        ref={videoRef}
                        className="w-full h-auto block"
                        loop
                        playsInline
                        muted
                        autoPlay
                        style={{
                          minHeight: isFullscreen ? '100vh' : '400px',
                          maxHeight: isFullscreen ? '100vh' : '500px',
                          objectFit: isFullscreen ? 'contain' : 'cover',
                          display: 'block',
                          backgroundColor: 'rgba(10, 30, 56, 0.5)',
                          width: isFullscreen ? '100vw' : '100%',
                          height: isFullscreen ? '100vh' : 'auto'
                        }}
                      >
                        <source src="/videos/phishing-awareness.mp4" type="video/mp4" />
                        <source src="/video.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>

                      {/* Video Controls - Clean overlay without blur */}
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-black/60 transition-opacity duration-300"
                        style={{
                          opacity: 1
                        }}
                      >
                        <div className="px-6 py-4 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {/* Play/Pause Button */}
                            <motion.button
                              onClick={handleVideoClick}
                              className="text-white hover:text-cyan-400 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {isVideoPlaying ? (
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                                </svg>
                              ) : (
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                              )}
                            </motion.button>

                            {/* Mute/Unmute Button */}
                            <motion.button
                              onClick={toggleMute}
                              className="text-white hover:text-cyan-400 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {isMuted ? (
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                                </svg>
                              ) : (
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                </svg>
                              )}
                            </motion.button>
                          </div>

                          <div className="flex items-center space-x-3">
                            {/* Picture-in-Picture Button */}
                            <motion.button
                              onClick={togglePiP}
                              className="text-white hover:text-cyan-400 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Picture-in-Picture"
                            >
                              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                <rect x="13" y="13" width="6" height="5" rx="1"/>
                              </svg>
                            </motion.button>

                            {/* Fullscreen Button */}
                            <motion.button
                              onClick={toggleFullscreen}
                              className="text-white hover:text-cyan-400 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {isFullscreen ? (
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              ) : (
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                </svg>
                              )}
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-96 bg-cyber-dark">
                      <p className="text-gray-400">Video unavailable</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section with Enhanced Animations */}
      <section className="relative py-24" style={{ zIndex: 2 }}>
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.span 
              className="text-lg font-semibold tracking-wider uppercase mb-6 block"
              style={{
                color: '#00d4ff',
                textShadow: '0 0 20px rgba(0, 212, 255, 0.6)'
              }}
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              OUR FEATURES
            </motion.span>
            <motion.h2 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                color: '#ffffff',
                textShadow: '0 0 30px rgba(0, 212, 255, 0.5)'
              }}
              animate={{
                y: [-5, 5, -5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Comprehensive Cybersecurity Solutions
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: "AI-Powered Email Generation",
                desc: "Automatically generate sophisticated phishing scenarios with AI. Create realistic, context-aware emails tailored to your organization's industry.",
                icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
                color: "#00d4ff"
              },
              {
                title: "Multi-Language Support",
                desc: "Send phishing simulations in multiple languages. Train your global workforce effectively, regardless of location or language preference.",
                icon: "M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129",
                color: "#00ffaa"
              },
              {
                title: "Custom Manual Prompts",
                desc: "Create custom phishing scenarios with complete control. Design targeted simulations tailored to your specific security concerns and organizational vulnerabilities.",
                icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
                color: "#00d4ff"
              },
              {
                title: "Realistic Simulations",
                desc: "Deploy automated phishing campaigns with templates based on real-world attacks. Test your team's awareness safely and effectively.",
                icon: "M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2",
                color: "#00ffaa"
              },
              {
                title: "Interactive Training",
                desc: "Engaging micro-learning modules that teach employees to identify and report phishing attempts effectively with immediate feedback.",
                icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                color: "#00d4ff"
              },
              {
                title: "Advanced Analytics",
                desc: "Track progress with detailed reports and insights. Identify at-risk users and measure the effectiveness of your training programs.",
                icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
                color: "#ff6600"
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  y: -15,
                  boxShadow: `0 25px 70px ${feature.color}40`,
                  transition: { duration: 0.3 }
                }}
                className="cyber-card text-center group cursor-pointer relative overflow-hidden"
              >
                {/* Animated gradient background on hover */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${feature.color}10 0%, transparent 100%)`
                  }}
                />
                
                <div className="relative z-10">
                  <motion.div 
                    className="mb-6 flex justify-center"
                    style={{ color: feature.color }}
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 200, duration: 0.8 }}
                    animate={{
                      y: [0, -10, 0],
                    }}
                    whileInView={{
                      transition: {
                        y: {
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.2
                        }
                      }
                    }}
                  >
                    <svg className="w-20 h-20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                    </svg>
                  </motion.div>
                  
                  <motion.h3 
                    className="text-2xl font-bold mb-4"
                    style={{
                      fontFamily: 'Rajdhani, sans-serif',
                      color: '#ffffff',
                      textShadow: `0 0 15px ${feature.color}40`
                    }}
                    animate={{
                      x: [-3, 3, -3],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.3
                    }}
                  >
                    {feature.title}
                  </motion.h3>
                  
                  <motion.p 
                    className="leading-relaxed"
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '0.95rem'
                    }}
                    animate={{
                      opacity: [0.85, 1, 0.85],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.2
                    }}
                  >
                    {feature.desc}
                  </motion.p>
                </div>

                {/* Corner accent */}
                <motion.div
                  className="absolute top-0 right-0 w-20 h-20"
                  style={{
                    background: `radial-gradient(circle at top right, ${feature.color}30 0%, transparent 70%)`,
                  }}
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.1
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section with Better Spacing */}
      <section className="py-20 relative" style={{ zIndex: 1 }}>
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h2 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8"
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                color: '#ffffff',
                textShadow: '0 0 30px rgba(0, 212, 255, 0.5)'
              }}
              animate={{
                y: [-5, 5, -5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Ready To Protect Your Organization?
            </motion.h2>
            
            <motion.p 
              className="text-xl mb-12"
              style={{
                fontFamily: 'Poppins, sans-serif',
                color: '#ffffff'
              }}
              animate={{
                opacity: [0.85, 1, 0.85],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Join thousands of organizations using Martian Blue to stay secure
            </motion.p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/contact">
                <motion.button 
                  className="cyber-button text-lg px-10 py-4 font-bold"
                  whileHover={{ 
                    scale: 1.08,
                    boxShadow: '0 20px 60px rgba(0, 212, 255, 0.6)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    boxShadow: [
                      '0 10px 30px rgba(0, 212, 255, 0.3)',
                      '0 15px 45px rgba(0, 212, 255, 0.5)',
                      '0 10px 30px rgba(0, 212, 255, 0.3)'
                    ]
                  }}
                  transition={{
                    boxShadow: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                >
                  Get Started
                </motion.button>
              </Link>
              
              <Link to="/cybersecurity-services">
                <motion.button 
                  className="bg-transparent border-2 text-lg px-10 py-4 rounded-lg font-bold text-white transition-all duration-300"
                  style={{
                    borderColor: '#00d4ff',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                  whileHover={{ 
                    scale: 1.08,
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    boxShadow: '0 15px 45px rgba(0, 212, 255, 0.4)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    borderColor: ['#00d4ff', '#00ffaa', '#00d4ff'],
                  }}
                  transition={{
                    borderColor: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                >
                  Learn More
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <style jsx>{`
        @keyframes shimmer {
          0% { 
            background-position: -200% 0;
          }
          100% { 
            background-position: 200% 0;
          }
        }
        
        @keyframes rotate-border {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Home;