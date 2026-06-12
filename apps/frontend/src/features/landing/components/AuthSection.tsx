import { motion } from 'framer-motion';
import { SectionContainer } from './SectionContainer';
import { AuthSwitcher } from './AuthSwitcher';

export const AuthSection = () => {
  return (
    <SectionContainer id="auth" className="min-h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="w-full max-w-md mx-auto"
      >
        <div className="bg-gray-900/60 backdrop-blur-3xl border border-gray-700/50 shadow-2xl shadow-blue-900/20 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-violet-500/10 pointer-events-none"></div>
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Acceso a Prowork</h2>
              <p className="text-sm text-gray-400">Únete a la élite del trabajo independiente.</p>
            </div>
            
            <AuthSwitcher />
            
          </div>
        </div>
      </motion.div>
    </SectionContainer>
  );
};
