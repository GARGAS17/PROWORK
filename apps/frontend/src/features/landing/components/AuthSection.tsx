import { motion } from 'framer-motion';
import { SectionContainer } from './SectionContainer';
import { AuthSwitcher } from './AuthSwitcher';

export const AuthSection = () => {
  return (
    <SectionContainer id="auth">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="w-full max-w-md mx-auto"
      >
        <div className="bg-gray-900/80 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Acceso a Prowork</h2>
              <p className="text-sm text-gray-400">Únete a la red de talento y empresas de élite.</p>
            </div>
            <AuthSwitcher />
          </div>
        </div>
      </motion.div>
    </SectionContainer>
  );
};
