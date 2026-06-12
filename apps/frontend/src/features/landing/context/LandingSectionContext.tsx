import { createContext, useState, type ReactNode } from 'react';
import { type LandingSection } from '../types/landing.types';

interface LandingSectionContextType {
  activeSection: LandingSection;
  setActiveSection: (section: LandingSection) => void;
}

export const LandingSectionContext = createContext<LandingSectionContextType | undefined>(undefined);

export const LandingSectionProvider = ({ children }: { children: ReactNode }) => {
  const [activeSection, setActiveSection] = useState<LandingSection>('home');

  return (
    <LandingSectionContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </LandingSectionContext.Provider>
  );
};
