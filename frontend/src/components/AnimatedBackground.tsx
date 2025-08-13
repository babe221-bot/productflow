import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import animate from 'animejs';

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  element?: HTMLDivElement;
}

const AnimatedBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const numberOfParticles = 50;
    
    // Create particles
    for (let i = 0; i < numberOfParticles; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random particle properties
      const size = Math.random() * 4 + 2;
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const opacity = Math.random() * 0.6 + 0.2;
      
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, rgba(100, 181, 246, ${opacity}) 0%, rgba(156, 39, 176, ${opacity * 0.5}) 100%);
        border-radius: 50%;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        will-change: transform;
      `;
      
      container.appendChild(particle);
      
      particlesRef.current.push({
        x,
        y,
        size,
        opacity,
        speed: Math.random() * 0.5 + 0.1,
        element: particle,
      });
    }

    // Animate particles floating
    particlesRef.current.forEach((particle, index) => {
      if (particle.element) {
        animate({
          targets: particle.element,
          translateY: [
            { value: Math.random() * 20 - 10, duration: 2000 + Math.random() * 2000 },
            { value: Math.random() * 20 - 10, duration: 2000 + Math.random() * 2000 },
          ],
          translateX: [
            { value: Math.random() * 30 - 15, duration: 3000 + Math.random() * 2000 },
            { value: Math.random() * 30 - 15, duration: 3000 + Math.random() * 2000 },
          ],
          opacity: [
            { value: Math.random() * 0.3 + 0.2, duration: 1500 + Math.random() * 1500 },
            { value: Math.random() * 0.6 + 0.3, duration: 1500 + Math.random() * 1500 },
          ],
          scale: [
            { value: 0.8 + Math.random() * 0.4, duration: 2000 + Math.random() * 1000 },
            { value: 0.8 + Math.random() * 0.4, duration: 2000 + Math.random() * 1000 },
          ],
          loop: true,
          easing: 'easeInOutSine',
          delay: Math.random() * 2000,
        });
      }
    });

    // Create floating geometric shapes
    const shapes = ['circle', 'triangle', 'square'];
    for (let i = 0; i < 8; i++) {
      const shape = document.createElement('div');
      const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
      const size = Math.random() * 40 + 20;
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      
      shape.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        opacity: 0.1;
        will-change: transform;
      `;

      switch (shapeType) {
        case 'circle':
          shape.style.borderRadius = '50%';
          shape.style.background = 'linear-gradient(45deg, #64b5f6, #ab47bc)';
          break;
        case 'triangle':
          shape.style.width = '0';
          shape.style.height = '0';
          shape.style.borderLeft = `${size/2}px solid transparent`;
          shape.style.borderRight = `${size/2}px solid transparent`;
          shape.style.borderBottom = `${size}px solid rgba(100, 181, 246, 0.2)`;
          break;
        case 'square':
          shape.style.background = 'linear-gradient(135deg, rgba(156, 39, 176, 0.2), rgba(100, 181, 246, 0.2))';
          shape.style.transform = 'rotate(45deg)';
          break;
      }

      container.appendChild(shape);

      // Animate shapes
      animate({
        targets: shape,
        rotate: shapeType === 'square' ? '405deg' : '360deg',
        translateY: [
          { value: Math.random() * 100 - 50, duration: 8000 + Math.random() * 4000 },
          { value: Math.random() * 100 - 50, duration: 8000 + Math.random() * 4000 },
        ],
        translateX: [
          { value: Math.random() * 100 - 50, duration: 10000 + Math.random() * 5000 },
          { value: Math.random() * 100 - 50, duration: 10000 + Math.random() * 5000 },
        ],
        opacity: [0.05, 0.2, 0.05],
        loop: true,
        easing: 'easeInOutSine',
        delay: Math.random() * 5000,
      });
    }

    // Cleanup function
    return () => {
      if (container) {
        container.innerHTML = '';
      }
      particlesRef.current = [];
    };
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden',
        background: `
          radial-gradient(ellipse at top left, rgba(26, 35, 126, 0.3) 0%, transparent 50%),
          radial-gradient(ellipse at top right, rgba(74, 20, 140, 0.3) 0%, transparent 50%),
          radial-gradient(ellipse at bottom left, rgba(13, 71, 161, 0.2) 0%, transparent 50%),
          linear-gradient(135deg, #0a1929 0%, #1a237e 50%, #4a148c 100%)
        `,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(100, 181, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(156, 39, 176, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(25, 118, 210, 0.05) 0%, transparent 50%)
          `,
          animation: 'pulse 8s ease-in-out infinite alternate',
        },
        '@keyframes pulse': {
          '0%': {
            opacity: 0.5,
          },
          '100%': {
            opacity: 1,
          },
        },
      }}
    />
  );
};

export default AnimatedBackground;