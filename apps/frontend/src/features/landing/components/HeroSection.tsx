import { motion } from 'framer-motion';
import { SectionContainer } from './SectionContainer';

export const HeroSection = () => {
  return (
    <SectionContainer id="home">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex flex-col items-center text-center gap-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 w-fit"
        >
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
          <span className="text-sm font-medium text-indigo-300">Prowork 2.0 ya está aquí</span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
          Tus ideas valen más <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            que tu CV.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed">
          Conecta proyectos reales con talento validado y acelera resultados sin procesos tradicionales de contratación. La plataforma premium para mentes exigentes.
        </p>

        {/* Leyenda del grafo */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm mt-2">
          <span className="flex items-center gap-1.5 text-indigo-300">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-lg shadow-indigo-500/50"></span>
            Empresas
          </span>
          <span className="flex items-center gap-1.5 text-emerald-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-500/50"></span>
            Talento
          </span>
          <span className="flex items-center gap-1.5 text-amber-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-lg shadow-amber-500/50"></span>
            Proyectos
          </span>
          <span className="flex items-center gap-1.5 text-cyan-300">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-500/50"></span>
            Validación IA
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4 w-full">
          <button
            onClick={() => document.getElementById('auth')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-indigo-600 rounded-full shadow-xl shadow-indigo-500/30 hover:bg-indigo-500 transition transform hover:-translate-y-1"
          >
            Comenzar ahora
          </button>
          <button
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-gray-300 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition"
          >
            Explorar plataforma
          </button>
        </div>
      </motion.div>
    </SectionContainer>
  );
};
