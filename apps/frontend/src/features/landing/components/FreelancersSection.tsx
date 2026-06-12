import { motion } from 'framer-motion';
import { SectionContainer } from './SectionContainer';

export const FreelancersSection = () => {
  return (
    <SectionContainer id="freelancers">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="flex flex-col gap-6 bg-emerald-500/5 p-8 md:p-10 rounded-3xl border border-emerald-500/20 relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 w-fit">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-sm font-medium text-emerald-300">Para Freelancers</span>
        </div>

        <h2 className="text-4xl font-bold tracking-tight text-white">
          Construye reputación con código real.
        </h2>
        <p className="text-lg text-gray-400 max-w-lg">
          Tu nodo en el grafo crece con cada proyecto completado. Más conexiones, más visibilidad, más proyectos de alto impacto.
        </p>

        <ul className="space-y-4 mt-2">
          {[
            { label: 'Proyectos top tier garantizados', color: 'emerald' },
            { label: 'Pagos en escrow — cobras siempre', color: 'emerald' },
            { label: 'Reputación on-chain verificable', color: 'emerald' },
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="font-medium text-gray-200">{item.label}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </SectionContainer>
  );
};
