import { motion } from 'framer-motion';
import { SectionContainer } from './SectionContainer';

export const CompaniesSection = () => {
  return (
    <SectionContainer id="companies">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col gap-6 text-center md:text-left"
      >
        <h2 className="text-4xl font-extrabold tracking-tight text-white">
          Escala tu capacidad operativa.
        </h2>
        <p className="text-lg text-gray-400 max-w-lg mx-auto md:mx-0">
          Accede a talento de élite validado por Prowork. Ejecuta proyectos críticos sin la lentitud de expandir tu nómina interna.
        </p>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="p-6 rounded-2xl bg-gray-900/50 backdrop-blur-md border border-gray-800 shadow-sm">
            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mb-1">3x</div>
            <div className="text-sm text-gray-400 font-medium">Velocidad de ejecución</div>
          </div>
          <div className="p-6 rounded-2xl bg-gray-900/50 backdrop-blur-md border border-gray-800 shadow-sm">
            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-violet-600 mb-1">100%</div>
            <div className="text-sm text-gray-400 font-medium">Talento verificado</div>
          </div>
          <div className="p-6 rounded-2xl bg-blue-900/10 border border-blue-900/30 shadow-[0_0_30px_rgba(37,99,235,0.1)] col-span-2 relative overflow-hidden backdrop-blur-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-violet-600/10"></div>
            <div className="relative z-10">
              <div className="text-2xl font-bold text-white mb-2">Enterprise Ready</div>
              <div className="text-sm text-gray-300">Diseñado para integrarse en los flujos de trabajo de las startups más exigentes del mundo.</div>
            </div>
          </div>
        </div>
      </motion.div>
    </SectionContainer>
  );
};
