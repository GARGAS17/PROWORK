import { Briefcase, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface RoleSelectorProps {
  selectedRole: 'empresa' | 'freelancer' | null;
  onSelect: (role: 'empresa' | 'freelancer') => void;
}

export const RoleSelector = ({ selectedRole, onSelect }: RoleSelectorProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 mb-2">
      <button
        type="button"
        onClick={() => onSelect('empresa')}
        className={`relative p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
          selectedRole === 'empresa' 
            ? 'border-blue-500 bg-blue-900/20 shadow-inner' 
            : 'border-gray-800 bg-gray-950/50 hover:border-gray-600'
        }`}
      >
        {selectedRole === 'empresa' && (
          <motion.div layoutId="role-glow" className="absolute inset-0 rounded-xl ring-1 ring-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]" />
        )}
        <Briefcase className={`w-6 h-6 z-10 ${selectedRole === 'empresa' ? 'text-blue-400' : 'text-gray-500'}`} />
        <span className={`text-sm font-semibold z-10 ${selectedRole === 'empresa' ? 'text-white' : 'text-gray-400'}`}>Empresa</span>
      </button>

      <button
        type="button"
        onClick={() => onSelect('freelancer')}
        className={`relative p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
          selectedRole === 'freelancer' 
            ? 'border-violet-500 bg-violet-900/20 shadow-inner' 
            : 'border-gray-800 bg-gray-950/50 hover:border-gray-600'
        }`}
      >
        {selectedRole === 'freelancer' && (
          <motion.div layoutId="role-glow" className="absolute inset-0 rounded-xl ring-1 ring-violet-500/50 shadow-[0_0_15px_rgba(139,92,246,0.2)]" />
        )}
        <Code2 className={`w-6 h-6 z-10 ${selectedRole === 'freelancer' ? 'text-violet-400' : 'text-gray-500'}`} />
        <span className={`text-sm font-semibold z-10 ${selectedRole === 'freelancer' ? 'text-white' : 'text-gray-400'}`}>Freelancer</span>
      </button>
    </div>
  );
};
