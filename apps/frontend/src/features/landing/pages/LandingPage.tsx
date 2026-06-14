import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LandingSectionProvider } from '../context/LandingSectionContext';
import { Navbar } from '../components/Navbar';
import { SectionContainer } from '../components/SectionContainer';
import Spline from '@splinetool/react-spline';
import { NetworkGraph } from '../3d/NetworkGraph';
import { MousePointer2, Lock, Mouse, Hand, Rotate3d } from 'lucide-react';
import Lenis from 'lenis';

export const LandingPage = () => {
  const [isInteractive, setIsInteractive] = useState(false);

  useEffect(() => {
    // Inicializar Smooth Scroll (Lenis) para que la rueda del ratón sea súper fluida (estilo Mac/Apple)
    const lenis = new Lenis({
      duration: 1.5, // Hace el scroll un poco más prolongado y suave
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Curva de inercia
      smoothWheel: true,
      wheelMultiplier: 1.2, // Acelera un poco la rueda física
    });

    // Exponer la instancia globalmente para usarla en la barra de navegación
    (window as any).lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      delete (window as any).lenis;
    };
  }, []);

  return (
    <LandingSectionProvider>
      {/* Fondo oscuro base */}
      <div className="relative w-full min-h-screen bg-[#d8dfe7] overflow-x-hidden">

        {/* Navbar (z-50, siempre encima de todo) */}
        <Navbar />

        {/* Paneles HTML interactivos (z-50) */}
        <NetworkGraph />

        {/* Controles de Interactividad (Botón + Etiquetas) */}
        <div className="fixed bottom-8 right-8 z-[60] flex flex-col items-end gap-3 pointer-events-none">
          
          <AnimatePresence>
            {isInteractive && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="flex flex-col gap-2 mb-1"
              >
                <div className="flex items-center gap-3 bg-gray-900/80 backdrop-blur-md text-white px-4 py-2 rounded-xl border border-gray-700 shadow-xl pointer-events-auto">
                  <Rotate3d className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold">Rotar cámara <span className="text-gray-400 font-medium ml-1.5">Mantener rueda</span></span>
                </div>
                <div className="flex items-center gap-3 bg-gray-900/80 backdrop-blur-md text-white px-4 py-2 rounded-xl border border-gray-700 shadow-xl pointer-events-auto">
                  <Hand className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold">Desplazar <span className="text-gray-400 font-medium ml-1.5">Click derecho</span></span>
                </div>
                <div className="flex items-center gap-3 bg-gray-900/80 backdrop-blur-md text-white px-4 py-2 rounded-xl border border-gray-700 shadow-xl pointer-events-auto">
                  <Mouse className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold">Zoom <span className="text-gray-400 font-medium ml-1.5">Rueda del ratón</span></span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setIsInteractive(!isInteractive)}
            className={`pointer-events-auto flex items-center gap-2 px-5 py-3 rounded-2xl backdrop-blur-xl border shadow-xl transition-all hover:scale-105 active:scale-95 ${
              isInteractive
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-600/30'
                : 'bg-white/70 text-gray-800 border-white/50 shadow-black/5 hover:bg-white/90'
            }`}
          >
            {isInteractive ? <MousePointer2 className="w-5 h-5" /> : <Lock className="w-5 h-5 text-indigo-600" />}
            <span className="font-bold text-sm">
              {isInteractive ? 'Modo 3D Activado' : 'Interactuar con 3D'}
            </span>
          </button>
        </div>

        {/* Fondo Spline 3D (z-10) - pointer-events depende del estado del botón */}
        <div className={`fixed inset-0 w-full h-full z-10 ${isInteractive ? 'pointer-events-auto cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}>
          <Spline scene="https://prod.spline.design/7RqfRsPahi14GWZc/scene.splinecode?v=3" />
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
