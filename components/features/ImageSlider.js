'use client';
import { useState, useEffect } from 'react';
import { mockBannerSlides } from '@/lib/mockData';
import styles from './ImageSlider.module.css';

export default function ImageSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % mockBannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.slider}>
      <div 
        className={styles.slides}
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {mockBannerSlides.map((slide) => (
          <div 
            key={slide.id} 
            className={styles.slide}
            style={{ background: slide.bgColor }}
          >
            <div className={styles.content}>
              <div className={styles.icon}>{slide.icon}</div>
              <h2 className={styles.title}>{slide.title}</h2>
              <p className={styles.subtitle}>{slide.subtitle}</p>
            </div>
            {/* Ambient decoration */}
            <div className={styles.decoration} aria-hidden="true" />
          </div>
        ))}
      </div>

      <div className={styles.dots}>
        {mockBannerSlides.map((_, idx) => (
          <button
            key={idx}
            className={`${styles.dot} ${idx === current ? styles.active : ''}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
