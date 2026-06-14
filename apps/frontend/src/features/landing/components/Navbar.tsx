import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useActiveSection } from '../hooks/useActiveSection';
import { type LandingSection } from '../types/landing.types';

const navItems: { id: LandingSection; label: string }[] = [
  { id: 'home', label: 'Inicio' },
  { id: 'how-it-works', label: 'Cómo funciona' },
  { id: 'companies', label: 'Empresas' },
  { id: 'freelancers', label: 'Talento' },
];

export const Navbar = () => {
  const { activeSection } = useActiveSection();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleScroll = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      if ((window as any).lenis) {
        // Usa Lenis para el auto-scroll (esto evita que se rompa con Spline)
        (window as any).lenis.scrollTo(element, { duration: 1.5 });
      } else {
        // Fallback nativo
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-gray-950/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleScroll('home')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-indigo-700 shadow-md shadow-indigo-500/30 flex items-center justify-center">
              <span className="text-white font-bold text-lg leading-none">P</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">PROWORK</span>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleScroll(item.id)}
                className="relative px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:text-white"
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-400 rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button onClick={() => handleScroll('auth')} className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition">
              Iniciar sesión
            </button>
            <button
              onClick={() => handleScroll('auth')}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-full shadow-lg shadow-indigo-500/30 hover:bg-indigo-500 transition transform hover:-translate-y-0.5"
            >
              Comenzar ahora
            </button>
          </div>

          <button className="md:hidden p-2 text-gray-400 hover:text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-0 w-full bg-gray-950/95 backdrop-blur-xl border-b border-white/10 z-40 md:hidden flex flex-col p-4"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleScroll(item.id)}
                className={`px-4 py-3 text-left font-medium rounded-lg transition-colors ${
                  activeSection === item.id ? 'bg-indigo-500/10 text-indigo-300' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="h-px bg-white/10 my-2"></div>
            <button onClick={() => handleScroll('auth')} className="px-4 py-3 text-left font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg">
              Iniciar sesión
            </button>
            <button onClick={() => handleScroll('auth')} className="px-4 py-3 text-center font-semibold text-white bg-indigo-600 rounded-lg shadow-md mt-2">
              Comenzar ahora
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
