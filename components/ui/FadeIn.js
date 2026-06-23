'use client';

import { motion } from 'framer-motion';

export default function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  duration = 0.5,
  className = '',
  amount = 0.2, // Amount of element that needs to be in view to trigger
  as: Component = 'div',
  ...props
}) {
  const directions = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { x: 30, y: 0 },
    right: { x: -30, y: 0 },
    none: { x: 0, y: 0 }
  };

  const MotionComponent = typeof Component === 'string' ? motion[Component] : motion.create(Component);

  return (
    <MotionComponent
      className={className}
      initial={{
        opacity: 0,
        ...directions[direction]
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0
      }}
      viewport={{ once: true, amount: amount }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1], // Custom smooth ease
      }}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}
