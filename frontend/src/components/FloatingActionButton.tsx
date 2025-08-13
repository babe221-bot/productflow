import React, { useEffect, useRef } from 'react';
import { Fab, FabProps } from '@mui/material';
import anime from 'animejs';

interface FloatingActionButtonProps extends FabProps {
  floatAnimation?: boolean;
  glowIntensity?: number;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  floatAnimation = true,
  glowIntensity = 0.6,
  sx,
  children,
  ...props
}) => {
  const fabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!fabRef.current || !floatAnimation) return;

    const fab = fabRef.current;
    
    // Float animation
    const floatAnim = anime({
      targets: fab,
      translateY: [-8, 8],
      duration: 3000,
      loop: true,
      direction: 'alternate',
      easing: 'easeInOutSine',
    });

    // Glow pulse
    const glowAnim = anime({
      targets: fab,
      boxShadow: [
        `0 8px 30px rgba(100, 181, 246, ${glowIntensity * 0.3})`,
        `0 12px 40px rgba(100, 181, 246, ${glowIntensity * 0.6})`,
        `0 8px 30px rgba(100, 181, 246, ${glowIntensity * 0.3})`,
      ],
      duration: 2000,
      loop: true,
      easing: 'easeInOutSine',
    });

    return () => {
      floatAnim.pause();
      glowAnim.pause();
    };
  }, [floatAnimation, glowIntensity]);

  return (
    <Fab
      ref={fabRef}
      sx={{
        background: 'linear-gradient(45deg, #1976d2, #9c27b0)',
        color: '#ffffff',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 30px rgba(100, 181, 246, 0.3)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          background: 'linear-gradient(45deg, #1565c0, #8e24aa)',
          transform: 'scale(1.1)',
          boxShadow: '0 12px 40px rgba(100, 181, 246, 0.5)',
        },
        '&:active': {
          transform: 'scale(1.05)',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Fab>
  );
};

export default FloatingActionButton;