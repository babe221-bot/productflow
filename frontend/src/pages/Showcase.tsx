import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  Chip,
} from '@mui/material';
import {
  AutoAwesome,
  Visibility,
  Animation,
  Palette,
  Speed,
  Stars,
} from '@mui/icons-material';
import AnimatedCard from '../components/AnimatedCard';
import GlowingButton from '../components/GlowingButton';
import FloatingActionButton from '../components/FloatingActionButton';
import anime from 'animejs';

const Showcase: React.FC = () => {
  const titleRef = useRef<HTMLElement>(null);
  const [animationIndex, setAnimationIndex] = useState(0);
  const demoCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const animations = [
    'fadeInUp',
    'scaleIn', 
    'slideInLeft',
    'slideInRight'
  ] as const;

  useEffect(() => {
    // Animate main title
    if (titleRef.current) {
      anime({
        targets: titleRef.current,
        scale: [0.8, 1.2, 1],
        rotate: [0, 5, -5, 0],
        opacity: [0, 1],
        duration: 1500,
        easing: 'easeOutElastic(1, .8)',
      });
    }

    // Create floating background elements
    const container = document.querySelector('.showcase-container');
    if (container) {
      for (let i = 0; i < 15; i++) {
        const floatingElement = document.createElement('div');
        floatingElement.style.cssText = `
          position: absolute;
          width: ${Math.random() * 20 + 10}px;
          height: ${Math.random() * 20 + 10}px;
          background: linear-gradient(45deg, rgba(100, 181, 246, 0.2), rgba(156, 39, 176, 0.2));
          border-radius: ${Math.random() > 0.5 ? '50%' : '20%'};
          pointer-events: none;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          z-index: 0;
        `;
        
        container.appendChild(floatingElement);
        
        anime({
          targets: floatingElement,
          translateY: [
            { value: Math.random() * 200 - 100, duration: 4000 + Math.random() * 2000 },
            { value: Math.random() * 200 - 100, duration: 4000 + Math.random() * 2000 },
          ],
          translateX: [
            { value: Math.random() * 200 - 100, duration: 5000 + Math.random() * 2000 },
            { value: Math.random() * 200 - 100, duration: 5000 + Math.random() * 2000 },
          ],
          rotate: [0, 360],
          opacity: [0.1, 0.3, 0.1],
          scale: [0.5, 1, 0.5],
          loop: true,
          easing: 'easeInOutSine',
          delay: Math.random() * 3000,
        });
      }
    }
  }, []);

  const triggerDemoAnimation = () => {
    const currentAnimation = animations[animationIndex];
    
    // Animate all demo cards with the current animation type
    demoCardRefs.current.forEach((card, index) => {
      if (card) {
        // Reset card position
        anime.set(card, {
          opacity: 0,
          translateY: currentAnimation.includes('Up') ? 30 : 0,
          translateX: currentAnimation.includes('Left') ? -30 : 
                     currentAnimation.includes('Right') ? 30 : 0,
          scale: currentAnimation === 'scaleIn' ? 0.8 : 1,
        });

        // Animate in
        anime({
          targets: card,
          opacity: 1,
          translateY: 0,
          translateX: 0,
          scale: 1,
          duration: 800,
          easing: 'easeOutCubic',
          delay: index * 100,
        });
      }
    });

    setAnimationIndex((prev) => (prev + 1) % animations.length);
  };

  const features = [
    {
      icon: <Animation />,
      title: 'Anime.js Integration',
      description: 'Smooth, performant animations using the powerful Anime.js library',
      color: '#64b5f6',
    },
    {
      icon: <Palette />,
      title: 'Dark Ocean Theme',
      description: 'Beautiful dark theme with black, purple, and ocean blue gradients',
      color: '#ab47bc',
    },
    {
      icon: <AutoAwesome />,
      title: 'Interactive Effects',
      description: 'Hover animations, floating particles, and dynamic backgrounds',
      color: '#00e676',
    },
    {
      icon: <Speed />,
      title: 'Optimized Performance',
      description: 'Smooth 60fps animations with hardware acceleration',
      color: '#ff9800',
    },
    {
      icon: <Visibility />,
      title: 'Visual Feedback',
      description: 'Glowing buttons, pulsing elements, and state transitions',
      color: '#f44336',
    },
    {
      icon: <Stars />,
      title: 'Stunning UI',
      description: 'Glass-morphism effects, backdrop blur, and gradient borders',
      color: '#2196f3',
    },
  ];

  return (
    <Box 
      className="showcase-container"
      sx={{ 
        minHeight: '100vh', 
        p: 3, 
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="xl">
        {/* Hero Section */}
        <Box textAlign="center" mb={8}>
          <Typography
            ref={titleRef}
            variant="h1"
            sx={{
              mb: 4,
              background: 'linear-gradient(45deg, #64b5f6, #ab47bc, #00e676)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: { xs: '3rem', md: '4.5rem' },
              fontWeight: 800,
              textShadow: '0 8px 16px rgba(0,0,0,0.3)',
            }}
          >
            ✨ Animation Showcase ✨
          </Typography>
          
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 4,
              color: 'text.secondary',
              maxWidth: 800,
              mx: 'auto',
            }}
          >
            Experience the power of Anime.js with our stunning dark theme design
          </Typography>

          <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            <GlowingButton
              variant="contained"
              size="large"
              pulseAnimation
              startIcon={<Animation />}
              onClick={triggerDemoAnimation}
              sx={{
                fontSize: '1.2rem',
                px: 4,
                py: 1.5,
              }}
            >
              Trigger Animation: {animations[animationIndex]}
            </GlowingButton>
          </Box>
        </Box>

        {/* Demo Cards Grid */}
        <Grid container spacing={3} mb={8}>
          {[1, 2, 3, 4, 5, 6].map((num, index) => (
            <Grid item xs={12} sm={6} md={4} key={num}>
              <Card
                ref={(el) => { demoCardRefs.current[index] = el; }}
                sx={{
                  height: 200,
                  background: `linear-gradient(135deg, 
                    rgba(100, 181, 246, 0.1) 0%, 
                    rgba(156, 39, 176, 0.1) 50%,
                    rgba(0, 230, 118, 0.1) 100%)`,
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 4,
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: `linear-gradient(45deg, 
                      ${index % 3 === 0 ? '#64b5f6' : index % 3 === 1 ? '#ab47bc' : '#00e676'}, 
                      rgba(255,255,255,0.3))`,
                  },
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 60px rgba(100, 181, 246, 0.3)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <CardContent 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: `linear-gradient(45deg, 
                        ${index % 3 === 0 ? '#64b5f6' : index % 3 === 1 ? '#ab47bc' : '#00e676'}, 
                        rgba(255,255,255,0.2))`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 700 }}>
                      {num}
                    </Typography>
                  </Box>
                  
                  <Typography variant="h6" sx={{ color: 'text.primary', mb: 1 }}>
                    Demo Card {num}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Animation: {animations[animationIndex]}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Features Section */}
        <Box mb={8}>
          <Typography 
            variant="h2" 
            textAlign="center" 
            sx={{
              mb: 6,
              background: 'linear-gradient(45deg, #64b5f6, #ab47bc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 700,
            }}
          >
            Amazing Features
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <AnimatedCard
                  animationType={animations[index % animations.length]}
                  delay={index * 150}
                  sx={{
                    height: '100%',
                    background: `rgba(${feature.color === '#64b5f6' ? '100, 181, 246' :
                                       feature.color === '#ab47bc' ? '156, 39, 176' :
                                       feature.color === '#00e676' ? '0, 230, 118' :
                                       feature.color === '#ff9800' ? '255, 152, 0' :
                                       feature.color === '#f44336' ? '244, 67, 54' :
                                       '33, 150, 243'}, 0.1)`,
                    border: `1px solid ${feature.color}40`,
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '20px',
                        background: `${feature.color}20`,
                        border: `2px solid ${feature.color}40`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        color: feature.color,
                      }}
                    >
                      {React.cloneElement(feature.icon, { sx: { fontSize: 40 } })}
                    </Box>

                    <Typography 
                      variant="h5" 
                      sx={{ 
                        mb: 2, 
                        color: 'text.primary',
                        fontWeight: 600,
                      }}
                    >
                      {feature.title}
                    </Typography>

                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'text.secondary',
                        lineHeight: 1.6,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </AnimatedCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Tech Stack */}
        <Box textAlign="center">
          <Typography 
            variant="h4" 
            sx={{
              mb: 4,
              color: 'text.primary',
              fontWeight: 600,
            }}
          >
            Built With Modern Technologies
          </Typography>
          
          <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap" mb={4}>
            {[
              'Anime.js', 
              'React TypeScript', 
              'Material-UI v5', 
              'React Query',
              'Zustand',
              'Glass-morphism',
              'CSS Gradients',
              'Backdrop Filter'
            ].map((tech, index) => (
              <Chip
                key={tech}
                label={tech}
                sx={{
                  background: `linear-gradient(45deg, 
                    ${index % 4 === 0 ? 'rgba(100, 181, 246, 0.2)' :
                      index % 4 === 1 ? 'rgba(156, 39, 176, 0.2)' :
                      index % 4 === 2 ? 'rgba(0, 230, 118, 0.2)' :
                      'rgba(255, 152, 0, 0.2)'}, 
                    rgba(255, 255, 255, 0.1))`,
                  border: `1px solid ${index % 4 === 0 ? '#64b5f6' :
                                      index % 4 === 1 ? '#ab47bc' :
                                      index % 4 === 2 ? '#00e676' :
                                      '#ff9800'}40`,
                  color: 'text.primary',
                  fontWeight: 600,
                  fontSize: '1rem',
                  py: 1,
                  px: 2,
                  backdropFilter: 'blur(10px)',
                }}
              />
            ))}
          </Box>
        </Box>
      </Container>

      {/* Floating Action Button */}
      <FloatingActionButton
        onClick={triggerDemoAnimation}
        sx={{
          position: 'fixed',
          bottom: 100,
          right: 32,
          zIndex: 1000,
        }}
      >
        <AutoAwesome />
      </FloatingActionButton>
    </Box>
  );
};

export default Showcase;