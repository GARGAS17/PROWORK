import { type ReactNode } from 'react';
import { useSectionObserver } from '../hooks/useSectionObserver';
import { type LandingSection } from '../types/landing.types';

interface SectionContainerProps {
  id: LandingSection;
  children: ReactNode;
  className?: string;
}

export const SectionContainer = ({ id, children, className = '' }: SectionContainerProps) => {
  const ref = useSectionObserver(id);

  return (
    <section
      ref={ref}
      id={id}
      className={`min-h-[100dvh] w-full flex items-center justify-center relative snap-start ${className}`}
    >
      {/* Dark overlay para fusionar el 3D con el tema oscuro de fondo */}
      <div className="absolute inset-0 bg-gray-950/60 backdrop-blur-[4px] pointer-events-none -z-10"></div>

      <div className="w-full max-w-5xl mx-auto px-6 lg:px-12 z-10 flex flex-col items-center pt-20">
        <div className="w-full py-16">
          {children}
        </div>
      </div>
    </section>
  );
};
