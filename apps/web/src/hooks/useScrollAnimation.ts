import { useAnimation } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';

interface ScrollAnimationOptions {
  amount?: number;
  triggerOnce?: boolean;
  duration?: number;
  delay?: number;
}

export const useScrollAnimation = (options: ScrollAnimationOptions = {}) => {
  const {
    amount = 0.1,
    triggerOnce = true,
    duration = 0.8,
    delay = 0.2
  } = options;

  const ref = useRef(null);
  const isInView = useInView(ref, { 
    amount,
    once: triggerOnce 
  });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: {
          duration,
          delay,
          ease: [0.4, 0.0, 0.2, 1]
        }
      });
    } else {
      controls.start({
        opacity: 0,
        y: 50
      });
    }
  }, [isInView, controls, duration, delay]);

  return {
    ref,
    controls,
    isInView,
    initial: { opacity: 0, y: 50 },
    animate: controls
  };
};

// Hook específico para animações em seções
export const useSectionAnimation = (delay = 0) => {
  return useScrollAnimation({
    amount: 0.1,
    triggerOnce: true,
    duration: 0.8,
    delay: delay * 0.2
  });
};

// Hook para animações de cards em grid
export const useCardAnimation = (index = 0) => {
  return useScrollAnimation({
    amount: 0.1,
    triggerOnce: true,
    duration: 0.8,
    delay: index * 0.2
  });
};