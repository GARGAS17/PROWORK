import { motion } from 'framer-motion';
import { SectionContainer } from './SectionContainer';

export const FreelancersSection = () => {
  return (
    <SectionContainer id="freelancers">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="flex flex-col gap-6 bg-gray-900/40 backdrop-blur-2xl p-8 md:p-12 rounded-3xl border border-gray-800/80 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-violet-600/20 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold tracking-tight text-white mb-4">
            Construye reputación con código real.
          </h2>
          <p className="text-lg text-gray-400 max-w-lg mb-8 font-light">
            En Prowork, los portfolios vacíos no importan. Lo que importa es cómo resuelves el problema. Postúlate a proyectos desafiantes y demuestra tu valía.
          </p>

          <ul className="space-y-5">
            {['Acceso a proyectos top tier', 'Pagos garantizados en escrow', 'Comunidad de alto rendimiento'].map((item, i) => (
              <li key={i} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                  <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-medium text-gray-200 text-lg">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </SectionContainer>
  );
};
