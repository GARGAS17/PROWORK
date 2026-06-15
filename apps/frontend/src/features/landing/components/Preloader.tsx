import { AnimatePresence, motion } from 'framer-motion';
import { useLoading } from '../context/LoadingContext';
import { Loader2 } from 'lucide-react';

export const Preloader = () => {
  const { status } = useLoading();

  return (
    <AnimatePresence>
      {status === 'loading_3d' && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gray-950 text-white"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-gray-950 to-gray-950 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-24 h-24 border border-indigo-500/30 rounded-full animate-[spin_3s_linear_infinite]" />
              <div className="absolute w-16 h-16 border-t-2 border-indigo-500 rounded-full animate-spin" />
              <div className="w-8 h-8 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_30px_rgba(99,102,241,0.5)]" />
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-2xl font-black tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                Prowork
              </h1>
              <div className="flex items-center gap-2 text-indigo-400 font-medium text-sm tracking-widest uppercase">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Iniciando Pipeline</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
