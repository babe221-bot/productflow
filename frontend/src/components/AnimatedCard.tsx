import React, { useEffect, useRef } from 'react';
import { Card, CardProps } from '@mui/material';
import * as anime from 'animejs';

interface AnimatedCardProps extends CardProps {
  animationType?: 'fadeInUp' | 'scaleIn' | 'slideInLeft' | 'slideInRight';
  delay?: number;
  children: React.ReactNode;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  animationType = 'fadeInUp',
  delay = 0,
  children,
  sx,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    
    // Set initial state
    anime.set(card, {
      opacity: 0,
      translateY: animationType.includes('Up') ? 30 : 0,
      translateX: animationType.includes('Left') ? -30 : animationType.includes('Right') ? 30 : 0,
      scale: animationType === 'scaleIn' ? 0.8 : 1,
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
      delay,
    });

    // Add hover animation
    const handleMouseEnter = () => {
      anime({
        targets: card,
        scale: 1.02,
        translateY: -4,
        duration: 300,
        easing: 'easeOutCubic',
      });
    };

    const handleMouseLeave = () => {
      anime({
        targets: card,
        scale: 1,
        translateY: 0,
        duration: 300,
        easing: 'easeOutCubic',
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [animationType, delay]);

  return (
    <Card
      ref={cardRef}
      sx={{
        position: 'relative',
        overflow: 'visible',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 'inherit',
          background: 'linear-gradient(45deg, rgba(100, 181, 246, 0.1), rgba(156, 39, 176, 0.1))',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          zIndex: -1,
        },
        '&:hover::before': {
          opacity: 1,
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Card>
  );
};

export default AnimatedCard;