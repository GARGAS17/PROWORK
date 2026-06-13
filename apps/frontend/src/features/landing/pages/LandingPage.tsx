import { LandingSectionProvider } from '../context/LandingSectionContext';
import { Navbar } from '../components/Navbar';
import { SectionContainer } from '../components/SectionContainer';
import Spline from '@splinetool/react-spline';
import { NetworkGraph } from '../3d/NetworkGraph';

export const LandingPage = () => {
  return (
    <LandingSectionProvider>
      {/* Fondo oscuro base */}
      <div className="relative w-full min-h-screen bg-[#d8dfe7] overflow-x-hidden">
        
        {/* Navbar (z-50, siempre encima de todo) */}
        <Navbar />

        {/* Paneles HTML interactivos (z-50) */}
        <NetworkGraph />

        {/* Fondo Spline 3D (z-10) */}
        <div className="fixed inset-0 w-full h-full z-10">
          <Spline scene="https://prod.spline.design/7RqfRsPahi14GWZc/scene.splinecode" />
        </div>

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
