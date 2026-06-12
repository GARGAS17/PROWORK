import { lazy, Suspense } from 'react';
import { LandingSectionProvider } from '../context/LandingSectionContext';
import { Navbar } from '../components/Navbar';
import { SectionContainer } from '../components/SectionContainer';

const LandingCanvas = lazy(() => import('../3d/LandingCanvas'));

export const LandingPage = () => {
  return (
    <LandingSectionProvider>
      {/* Fondo oscuro base */}
      <div className="relative w-full min-h-screen bg-gray-950 overflow-x-hidden">
        
        {/* Navbar (z-50, siempre encima del canvas) */}
        <Navbar />

        {/* Canvas 3D (z-10, primer plano, el Html de nodos emerge aquí) */}
        <Suspense fallback={null}>
          <LandingCanvas />
        </Suspense>

        {/* Secciones fantasma (z-0, debajo del canvas) — solo para el scroll y el observer */}
        <div className="relative z-0">
          <SectionContainer id="home" />
          <SectionContainer id="how-it-works" />
          <SectionContainer id="companies" />
          <SectionContainer id="freelancers" />
          <SectionContainer id="auth" />
        </div>
      </div>
    </LandingSectionProvider>
  );
};
