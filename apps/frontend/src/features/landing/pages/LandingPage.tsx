import { lazy, Suspense } from 'react';
import { LandingSectionProvider } from '../context/LandingSectionContext';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { CompaniesSection } from '../components/CompaniesSection';
import { FreelancersSection } from '../components/FreelancersSection';
import { AuthSection } from '../components/AuthSection';

// Carga diferida del canvas 3D para rendimiento
const LandingCanvas = lazy(() => import('../3d/LandingCanvas'));

export const LandingPage = () => {
  return (
    <LandingSectionProvider>
      <div className="relative w-full min-h-screen overflow-x-hidden font-sans">
        <Navbar />
        
        {/* Entorno 3D Inmersivo */}
        <Suspense fallback={null}>
          <LandingCanvas />
        </Suspense>

        {/* Contenido con scroll narrativo */}
        <div className="relative z-10">
          <HeroSection />
          <HowItWorksSection />
          <CompaniesSection />
          <FreelancersSection />
          <AuthSection />
        </div>
      </div>
    </LandingSectionProvider>
  );
};
