import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
  const canvasRef = useRef(null);
  const marsCanvasRef = useRef(null);
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

  // Toggle play/pause button with stopPropagation
  const togglePlayPause = (e) => {
    e.stopPropagation(); // Prevent video click handler
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

  // MARS-THEMED ANIMATED BACKGROUND - Subtle and Realistic
  useEffect(() => {
    const canvas = marsCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    // Stars for space background
    class Star {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.brightness = Math.random();
        this.twinkleSpeed = 0.02 + Math.random() * 0.03;
        this.twinklePhase = Math.random() * Math.PI * 2;
      }

      update() {
        this.twinklePhase += this.twinkleSpeed;
      }

      draw() {
        const twinkle = Math.sin(this.twinklePhase) * 0.5 + 0.5;
        const opacity = this.brightness * twinkle;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${opacity * 0.8})`;
        ctx.shadowBlur = this.size * 2;
        ctx.shadowColor = `rgba(150, 200, 255, ${opacity * 0.6})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Nebula clouds on sides
    class NebulaCloud {
      constructor(side) {
        this.side = side;
        if (side === 'left') {
          this.x = Math.random() * (canvas.width * 0.25);
        } else {
          this.x = canvas.width - Math.random() * (canvas.width * 0.25);
        }
        this.y = Math.random() * canvas.height;
        this.size = 150 + Math.random() * 200;
        this.opacity = 0.15 + Math.random() * 0.15;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.005 + Math.random() * 0.005;
        this.driftSpeed = (Math.random() - 0.5) * 0.1;
        this.color = this.getNebulaColor();
      }

      getNebulaColor() {
        const colors = [
          { r: 0, g: 150, b: 255 },    // Cyan blue
          { r: 0, g: 200, b: 255 },    // Light cyan
          { r: 100, g: 180, b: 255 },  // Soft blue
          { r: 50, g: 150, b: 200 },   // Deep cyan
        ];
        return colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.pulsePhase += this.pulseSpeed;
        this.y += this.driftSpeed;
        
        // Wrap around vertically
        if (this.y < -this.size) this.y = canvas.height + this.size;
        if (this.y > canvas.height + this.size) this.y = -this.size;
      }

      draw() {
        const pulse = Math.sin(this.pulsePhase) * 0.3 + 1;
        const size = this.size * pulse;
        
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, size);
        gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity * 0.4})`);
        gradient.addColorStop(0.5, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity * 0.2})`);
        gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x - size, this.y - size, size * 2, size * 2);
      }
    }

    // Shooting stars
    class ShootingStar {
      constructor() {
        const side = Math.random();
        if (side < 0.5) {
          this.x = Math.random() * (canvas.width * 0.3);
        } else {
          this.x = canvas.width - Math.random() * (canvas.width * 0.3);
        }
        this.y = Math.random() * canvas.height * 0.5;
        this.length = 30 + Math.random() * 50;
        this.speed = 3 + Math.random() * 4;
        this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.5;
        this.opacity = 1;
        this.decay = 0.015;
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.opacity -= this.decay;
      }

      draw() {
        if (this.opacity <= 0) return;
        
        const endX = this.x - Math.cos(this.angle) * this.length;
        const endY = this.y - Math.sin(this.angle) * this.length;
        
        const gradient = ctx.createLinearGradient(this.x, this.y, endX, endY);
        gradient.addColorStop(0, `rgba(200, 230, 255, ${this.opacity * 0.9})`);
        gradient.addColorStop(1, `rgba(100, 180, 255, 0)`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }

      isDead() {
        return this.opacity <= 0;
      }
    }

    // Subtle Mars dust particles floating from sides
    class MarsDust {
      constructor() {
        const side = Math.random();
        if (side < 0.25) {
          this.x = -10;
          this.y = Math.random() * canvas.height;
          this.vx = 0.3 + Math.random() * 0.3;
          this.vy = (Math.random() - 0.5) * 0.2;
        } else if (side < 0.5) {
          this.x = canvas.width + 10;
          this.y = Math.random() * canvas.height;
          this.vx = -(0.3 + Math.random() * 0.3);
          this.vy = (Math.random() - 0.5) * 0.2;
        } else if (side < 0.75) {
          this.x = Math.random() * canvas.width;
          this.y = -10;
          this.vx = (Math.random() - 0.5) * 0.2;
          this.vy = 0.3 + Math.random() * 0.3;
        } else {
          this.x = Math.random() * canvas.width;
          this.y = canvas.height + 10;
          this.vx = (Math.random() - 0.5) * 0.2;
          this.vy = -(0.3 + Math.random() * 0.3);
        }
        
        this.size = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.life = 0;
        this.maxLife = 600 + Math.random() * 400;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;
        
        // Gentle fade in and out
        if (this.life < 100) {
          this.opacity = (this.life / 100) * 0.3;
        } else if (this.life > this.maxLife - 100) {
          this.opacity = ((this.maxLife - this.life) / 100) * 0.3;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // Subtle orange-red Mars dust color
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, `rgba(255, 140, 80, ${this.opacity})`);
        gradient.addColorStop(1, `rgba(200, 100, 60, ${this.opacity * 0.5})`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      isDead() {
        return this.life >= this.maxLife || 
               this.x < -20 || this.x > canvas.width + 20 ||
               this.y < -20 || this.y > canvas.height + 20;
      }
    }

    // Distant Mars-like celestial bodies in corners (very subtle)
    class DistantMars {
      constructor(corner) {
        this.corner = corner;
        
        switch(corner) {
          case 'top-left':
            this.x = 80;
            this.y = 120;
            break;
          case 'bottom-right':
            this.x = canvas.width - 80;
            this.y = canvas.height - 120;
            break;
          case 'top-right':
            this.x = canvas.width - 100;
            this.y = 150;
            break;
          case 'bottom-left':
            this.x = 100;
            this.y = canvas.height - 150;
            break;
        }
        
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = 25 + Math.random() * 15;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.floatPhase = Math.random() * Math.PI * 2;
      }

      update() {
        this.pulsePhase += 0.008;
        this.floatPhase += 0.005;
        
        // Gentle floating motion
        this.x = this.baseX + Math.sin(this.floatPhase) * 3;
        this.y = this.baseY + Math.cos(this.floatPhase * 1.3) * 3;
      }

      draw() {
        const pulse = Math.sin(this.pulsePhase) * 0.05 + 1;
        const size = this.size * pulse;
        
        ctx.save();
        
        // Very subtle outer glow
        ctx.shadowBlur = 25;
        ctx.shadowColor = 'rgba(200, 100, 50, 0.15)';
        
        // Mars surface gradient - realistic colors
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, size);
        gradient.addColorStop(0, 'rgba(210, 125, 70, 0.25)');
        gradient.addColorStop(0.6, 'rgba(180, 95, 55, 0.18)');
        gradient.addColorStop(1, 'rgba(140, 70, 40, 0.08)');
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Subtle surface texture
        ctx.shadowBlur = 0;
        for (let i = 0; i < 2; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * size * 0.6;
          const dotX = this.x + Math.cos(angle) * dist;
          const dotY = this.y + Math.sin(angle) * dist;
          const dotSize = size * 0.1;
          
          ctx.beginPath();
          ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(120, 60, 35, 0.15)';
          ctx.fill();
        }
        
        ctx.restore();
      }
    }

    // Initialize all elements
    const stars = [];
    const starCount = 200;
    for (let i = 0; i < starCount; i++) {
      stars.push(new Star());
    }

    const nebulaClouds = [];
    // Left side nebula
    for (let i = 0; i < 8; i++) {
      nebulaClouds.push(new NebulaCloud('left'));
    }
    // Right side nebula
    for (let i = 0; i < 8; i++) {
      nebulaClouds.push(new NebulaCloud('right'));
    }

    const shootingStars = [];
    const dustParticles = [];
    const distantBodies = [
      new DistantMars('top-left'),
      new DistantMars('bottom-right')
    ];

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw nebula clouds first (background layer)
      nebulaClouds.forEach(cloud => {
        cloud.update();
        cloud.draw();
      });
      
      // Draw stars
      stars.forEach(star => {
        star.update();
        star.draw();
      });
      
      // Add new shooting stars occasionally
      if (Math.random() < 0.01 && shootingStars.length < 3) {
        shootingStars.push(new ShootingStar());
      }
      
      // Update and draw shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        shootingStars[i].update();
        shootingStars[i].draw();
        
        if (shootingStars[i].isDead()) {
          shootingStars.splice(i, 1);
        }
      }
      
      // Add new dust particles occasionally
      if (Math.random() < 0.15 && dustParticles.length < 60) {
        dustParticles.push(new MarsDust());
      }
      
      // Update and draw dust
      for (let i = dustParticles.length - 1; i >= 0; i--) {
        dustParticles[i].update();
        dustParticles[i].draw();
        
        if (dustParticles[i].isDead()) {
          dustParticles.splice(i, 1);
        }
      }
      
      // Update and draw distant Mars bodies
      distantBodies.forEach(body => {
        body.update();
        body.draw();
      });
      
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

      {/* Mars-themed animated background */}
      <canvas
        ref={marsCanvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Space-themed Planets Background - Left and Right Sides */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {/* Left Side Planets */}
        <motion.div
          className="absolute"
          style={{
            left: '-5%',
            top: '10%',
            width: '200px',
            height: '200px',
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, #00ffff 0%, #00d4ff 50%, #0099cc 100%)',
              boxShadow: '0 0 80px rgba(0, 255, 255, 0.8), inset -20px -20px 40px rgba(0, 0, 0, 0.3)',
              position: 'relative'
            }}
          >
            {/* Planet rings */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotateX(75deg)',
                width: '280px',
                height: '280px',
                border: '8px solid rgba(0, 255, 255, 0.4)',
                borderRadius: '50%',
                boxShadow: '0 0 30px rgba(0, 255, 255, 0.6)'
              }}
            />
          </div>
        </motion.div>

        <motion.div
          className="absolute"
          style={{
            left: '2%',
            top: '55%',
            width: '120px',
            height: '120px',
          }}
          animate={{
            y: [0, 40, 0],
            x: [0, -20, 0],
            rotate: [0, -360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #5ddbff 0%, #00b8ff 50%, #0088cc 100%)',
              boxShadow: '0 0 60px rgba(93, 219, 255, 0.7), inset -15px -15px 30px rgba(0, 0, 0, 0.4)',
            }}
          />
        </motion.div>

        <motion.div
          className="absolute"
          style={{
            left: '-3%',
            top: '75%',
            width: '150px',
            height: '150px',
          }}
          animate={{
            y: [0, -35, 0],
            x: [0, 18, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 40% 30%, #33ddff 0%, #00c4ff 50%, #0099dd 100%)',
              boxShadow: '0 0 70px rgba(51, 221, 255, 0.6), inset -18px -18px 35px rgba(0, 0, 0, 0.35)',
            }}
          />
        </motion.div>

        {/* Right Side Planets */}
        <motion.div
          className="absolute"
          style={{
            right: '-4%',
            top: '15%',
            width: '180px',
            height: '180px',
          }}
          animate={{
            y: [0, 35, 0],
            x: [0, -18, 0],
            rotate: [0, -360],
          }}
          transition={{
            duration: 27,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 25%, #80e5ff 0%, #00ccff 50%, #0099dd 100%)',
              boxShadow: '0 0 75px rgba(128, 229, 255, 0.7), inset -17px -17px 34px rgba(0, 0, 0, 0.3)',
            }}
          />
        </motion.div>

        <motion.div
          className="absolute"
          style={{
            right: '1%',
            top: '50%',
            width: '220px',
            height: '220px',
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, 20, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, #00e5ff 0%, #00b8ff 50%, #0088cc 100%)',
              boxShadow: '0 0 90px rgba(0, 229, 255, 0.8), inset -22px -22px 44px rgba(0, 0, 0, 0.35)',
              position: 'relative'
            }}
          >
            {/* Planet rings */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotateX(70deg)',
                width: '320px',
                height: '320px',
                border: '10px solid rgba(0, 229, 255, 0.35)',
                borderRadius: '50%',
                boxShadow: '0 0 35px rgba(0, 229, 255, 0.5)'
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotateX(70deg)',
                width: '360px',
                height: '360px',
                border: '6px solid rgba(0, 229, 255, 0.25)',
                borderRadius: '50%',
                boxShadow: '0 0 25px rgba(0, 229, 255, 0.4)'
              }}
            />
          </div>
        </motion.div>

        <motion.div
          className="absolute"
          style={{
            right: '-2%',
            top: '78%',
            width: '140px',
            height: '140px',
          }}
          animate={{
            y: [0, 30, 0],
            x: [0, -15, 0],
            rotate: [0, -360],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 38% 28%, #00f2ff 0%, #00c4ff 50%, #0088cc 100%)',
              boxShadow: '0 0 65px rgba(0, 242, 255, 0.7), inset -16px -16px 32px rgba(0, 0, 0, 0.4)',
            }}
          />
        </motion.div>

        {/* Small floating stars/particles around planets */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute"
            style={{
              left: `${i < 8 ? Math.random() * 15 : 85 + Math.random() * 15}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(0, 212, 255, 0.5) 100%)',
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Hero Section with Two-Column Layout */}
      <motion.section 
        className="relative min-h-screen flex items-center justify-center pt-24 pb-20 px-6"
        style={{ 
          opacity: heroOpacity,
          zIndex: 1
        }}
      >
        <div className="container mx-auto max-w-7xl">
          {/* Main Heading Centered Above - Split into two lines - LARGER SIZE */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <motion.div
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <h1 
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-extrabold leading-tight"
                style={{
                  fontFamily: 'Rajdhani, sans-serif',
                  textShadow: '0 0 40px rgba(0, 212, 255, 0.7), 0 0 80px rgba(0, 212, 255, 0.4)',
                  color: '#ffffff'
                }}
              >
                Martianblue
              </h1>
              <h1 
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[8rem] font-extrabold leading-tight mt-2"
                style={{
                  fontFamily: 'Rajdhani, sans-serif',
                  textShadow: '0 0 40px rgba(0, 212, 255, 0.7), 0 0 80px rgba(0, 212, 255, 0.4)',
                  color: '#ffffff'
                }}
              >
                Anti-Phishing Platform
              </h1>
            </motion.div>
          </motion.div>

          {/* Content Grid - Adjusted ratio for larger video */}
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            {/* Left Column - Text Content (2 columns) */}
            <motion.div
              initial={{ opacity: 0, x: -80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Subtitle */}
              <motion.h2 
                className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6"
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
                className="text-base md:text-lg lg:text-xl leading-relaxed"
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
                    className="cyber-button text-lg px-10 py-4 font-bold"
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

            {/* Right Column - Video Player (3 columns - larger) */}
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
              className="lg:col-span-3 relative flex justify-center items-center"
            >
              <div 
                ref={videoContainerRef}
                className="relative rounded-3xl overflow-hidden group cursor-pointer w-full"
                onClick={handleVideoClick}
                style={{
                  boxShadow: '0 20px 60px rgba(255, 255, 255, 0.1)',
                  border: isFullscreen ? 'none' : '2px solid rgba(255, 255, 255, 0.2)',
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
                          minHeight: isFullscreen ? '100vh' : '450px',
                          maxHeight: isFullscreen ? '100vh' : '700px',
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
                            {/* Play/Pause Button - Fixed with stopPropagation */}
                            <motion.button
                              onClick={togglePlayPause}
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
                fontFamily: 'Rajdhani, sans-serif',
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
              className="text-4xl md:text-5xl lg:text-6xl font-bold"
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
              Comprehensive Security Solutions
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