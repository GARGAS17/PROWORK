import { type ReactNode } from 'react';
import { useSectionObserver } from '../hooks/useSectionObserver';
import { type LandingSection } from '../types/landing.types';

interface SectionContainerProps {
  id: LandingSection;
  children?: ReactNode;
  className?: string;
}

// Contenedor fantasma — solo activa el IntersectionObserver.
// El contenido visual vive en el espacio 3D vía <Html> de Drei.
export const SectionContainer = ({ id, className = '' }: SectionContainerProps) => {
  const ref = useSectionObserver(id);
  return (
    <section
      ref={ref}
      id={id}
      className={`min-h-[100dvh] w-full snap-start ${className}`}
      aria-label={id}
    />
  );
};
