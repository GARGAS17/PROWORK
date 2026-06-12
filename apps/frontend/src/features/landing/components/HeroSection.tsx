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
        className="flex flex-col items-center text-center gap-8"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-900/50 border border-gray-800 shadow-sm w-fit backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
          <span className="text-sm font-medium text-gray-300">Prowork 2.0 ya está aquí</span>
        </motion.div>

        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-white leading-[1.1] max-w-4xl">
          Tus ideas valen más <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-500">
            que tu CV.
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl leading-relaxed font-light">
          Conecta proyectos reales con talento validado y acelera resultados sin procesos tradicionales de contratación. La plataforma premium para mentes exigentes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-6 w-full">
          <button
            onClick={() => document.getElementById('auth')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-blue-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:bg-blue-500 transition transform hover:-translate-y-1"
          >
            Comenzar ahora
          </button>
          <button
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-gray-900/80 border border-gray-700 backdrop-blur-md rounded-full hover:bg-gray-800 transition"
          >
            Explorar plataforma
          </button>
        </div>
      </motion.div>
    </SectionContainer>
  );
};
