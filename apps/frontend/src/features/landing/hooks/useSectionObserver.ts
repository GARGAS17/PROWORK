import { useEffect, useRef } from 'react';
import { useActiveSection } from './useActiveSection';
import { type LandingSection } from '../types/landing.types';

export const useSectionObserver = (sectionId: LandingSection) => {
  const ref = useRef<HTMLDivElement>(null);
  const { setActiveSection } = useActiveSection();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(sectionId);
          }
        });
      },
      {
        threshold: 0.6, // Se activa cuando el 60% de la sección es visible
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [sectionId, setActiveSection]);

  return ref;
};
