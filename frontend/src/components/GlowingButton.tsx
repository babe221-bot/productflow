import React, { useEffect, useRef } from 'react';
import { Button, ButtonProps } from '@mui/material';
import * as anime from 'animejs';

interface GlowingButtonProps extends ButtonProps {
  glowColor?: string;
  pulseAnimation?: boolean;
}

const GlowingButton: React.FC<GlowingButtonProps> = ({
  glowColor = '#64b5f6',
  pulseAnimation = false,
  children,
  sx,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!buttonRef.current || !pulseAnimation) return;

    const button = buttonRef.current;
    
    const pulseAnim = anime({
      targets: button,
      scale: [1, 1.05, 1],
      boxShadow: [
        `0 4px 15px ${glowColor}40`,
        `0 8px 25px ${glowColor}60`,
        `0 4px 15px ${glowColor}40`,
      ],
      duration: 2000,
      loop: true,
      easing: 'easeInOutSine',
    });

    return () => {
      pulseAnim.pause();
    };
  }, [glowColor, pulseAnimation]);

  return (
    <Button
      ref={buttonRef}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(45deg, ${glowColor}20, ${glowColor}40)`,
        border: `1px solid ${glowColor}60`,
        backdropFilter: 'blur(10px)',
        color: '#ffffff',
        fontWeight: 600,
        textTransform: 'none',
        borderRadius: 2,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: `linear-gradient(90deg, transparent, ${glowColor}30, transparent)`,
          transition: 'left 0.5s ease',
        },
        '&:hover': {
          background: `linear-gradient(45deg, ${glowColor}30, ${glowColor}50)`,
          boxShadow: `0 8px 25px ${glowColor}40`,
          transform: 'translateY(-2px)',
          '&::before': {
            left: '100%',
          },
        },
        '&:active': {
          transform: 'translateY(0px)',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default GlowingButton;