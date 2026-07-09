'use client';
import { motion } from 'framer-motion';

export default function Loader({ variant = 'section', color = 'var(--color-primary)', text }) {
  // variant: 'page' | 'section' | 'button'

  const containerStyles = {
    page: {
      position: 'fixed',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--color-bg)',
      zIndex: 9999,
    },
    section: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
      width: '100%',
    },
    button: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    }
  };

  const dotSize = variant === 'button' ? 6 : 12;
  const gap = variant === 'button' ? '4px' : '8px';

  const dotVariants = {
    initial: { y: 0, opacity: 0.5 },
    animate: { y: [-6, 6, -6], opacity: [0.3, 1, 0.3] },
  };

  const dotTransition = {
    duration: 1.2,
    repeat: Infinity,
    ease: "easeInOut",
  };

  const dots = (
    <div style={{ display: 'flex', gap, alignItems: 'center', justifyContent: 'center' }}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          variants={dotVariants}
          initial="initial"
          animate="animate"
          transition={{ ...dotTransition, delay: index * 0.2 }}
          style={{
            width: dotSize,
            height: dotSize,
            backgroundColor: variant === 'button' ? 'currentColor' : color,
            borderRadius: '50%',
          }}
        />
      ))}
    </div>
  );

  if (variant === 'button') {
    return (
      <div style={containerStyles.button}>
        {dots}
        {text && <span>{text}</span>}
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      style={containerStyles[variant]}
    >
      {dots}
      {text && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ 
            marginTop: '1rem', 
            color: 'var(--color-text-muted)', 
            fontWeight: 500,
            fontSize: '0.95rem' 
          }}
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );
}
