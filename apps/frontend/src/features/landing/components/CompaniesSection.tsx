import { motion } from 'framer-motion';
import { SectionContainer } from './SectionContainer';

export const CompaniesSection = () => {
  return (
    <SectionContainer id="companies">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col gap-6"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 w-fit">
          <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
          <span className="text-sm font-medium text-indigo-300">Para Empresas</span>
        </div>

        <h2 className="text-4xl font-bold tracking-tight text-white">
          Escala tu capacidad operativa.
        </h2>
        <p className="text-lg text-gray-400 max-w-lg">
          Publica un proyecto y observa cómo el grafo de IA conecta tu empresa con el nodo de talento ideal en minutos, no semanas.
        </p>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
            <div className="text-3xl font-bold text-white mb-1">3x</div>
            <div className="text-sm text-gray-400">Velocidad de contratación</div>
          </div>
          <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
            <div className="text-3xl font-bold text-white mb-1">100%</div>
            <div className="text-sm text-gray-400">Talento verificado</div>
          </div>
          <div className="col-span-2 p-5 rounded-2xl bg-gray-900 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full blur-2xl -translate-y-8 translate-x-8"></div>
            <div className="relative z-10">
              <div className="text-sm font-mono text-indigo-400 mb-2">SISTEMA ACTIVO</div>
              <div className="text-white font-bold text-xl">Enterprise Ready</div>
              <div className="text-gray-400 text-sm mt-1">Acuerdos inteligentes · Pagos garantizados · Auditoría completa</div>
            </div>
          </div>
        </div>
      </motion.div>
    </SectionContainer>
  );
};
