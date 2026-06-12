import { lazy, Suspense } from 'react';
import { LandingSectionProvider } from '../context/LandingSectionContext';
import { Navbar } from '../components/Navbar';
import { SectionContainer } from '../components/SectionContainer';
import { TextOverlay } from '../components/TextOverlay';

const SplineBackground = lazy(() =>
  import('../3d/SplineBackground').then(m => ({ default: m.SplineBackground }))
);

export const LandingPage = () => {
  return (
    <LandingSectionProvider>
      <div className="relative w-full min-h-screen bg-gray-950 overflow-x-hidden">

        {/* CAPA 1 (z-1): Fábrica Spline — canvas propio, sin conflicto */}
        <Suspense fallback={
          <div className="fixed inset-0 z-1 bg-gray-950 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <SplineBackground />
        </Suspense>

        {/* CAPA 2 (z-20): Paneles de texto — React DOM puro, con Framer Motion */}
        <TextOverlay />

        {/* CAPA 3 (z-50): Navbar */}
        <Navbar />

        {/* Secciones fantasma (z-0) — activan IntersectionObserver al hacer scroll */}
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
