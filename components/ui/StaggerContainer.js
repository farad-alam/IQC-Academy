'use client';

import { motion } from 'framer-motion';

export default function StaggerContainer({
  children,
  staggerDelay = 0.1,
  delayChildren = 0,
  className = '',
  as: Component = 'div',
  ...props
}) {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delayChildren,
      },
    },
  };

  const MotionComponent = typeof Component === 'string' ? motion[Component] : motion.create(Component);

  return (
    <MotionComponent
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}

export function StaggerItem({ children, className = '', as: Component = 'div', direction = 'up', duration = 0.5, ...props }) {
  const directions = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { x: 30, y: 0 },
    right: { x: -30, y: 0 },
    none: { x: 0, y: 0 }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      ...directions[direction]
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: duration,
        ease: [0.25, 0.1, 0.25, 1],
      }
    },
  };

  const MotionComponent = typeof Component === 'string' ? motion[Component] : motion.create(Component);

  return (
    <MotionComponent className={className} variants={itemVariants} {...props}>
      {children}
    </MotionComponent>
  );
}
