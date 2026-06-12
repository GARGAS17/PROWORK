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
            ? 'border-indigo-500 bg-indigo-50/50 shadow-inner' 
            : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
        }`}
      >
        {selectedRole === 'empresa' && (
          <motion.div layoutId="role-glow" className="absolute inset-0 rounded-xl ring-2 ring-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]" />
        )}
        <Briefcase className={`w-6 h-6 z-10 ${selectedRole === 'empresa' ? 'text-indigo-600' : 'text-gray-400'}`} />
        <span className={`text-sm font-semibold z-10 ${selectedRole === 'empresa' ? 'text-indigo-900' : 'text-gray-600'}`}>Empresa</span>
      </button>

      <button
        type="button"
        onClick={() => onSelect('freelancer')}
        className={`relative p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
          selectedRole === 'freelancer' 
            ? 'border-violet-500 bg-violet-50/50 shadow-inner' 
            : 'border-gray-200 hover:border-violet-300 hover:bg-gray-50'
        }`}
      >
        {selectedRole === 'freelancer' && (
          <motion.div layoutId="role-glow" className="absolute inset-0 rounded-xl ring-2 ring-violet-500/50 shadow-[0_0_15px_rgba(139,92,246,0.2)]" />
        )}
        <Code2 className={`w-6 h-6 z-10 ${selectedRole === 'freelancer' ? 'text-violet-600' : 'text-gray-400'}`} />
        <span className={`text-sm font-semibold z-10 ${selectedRole === 'freelancer' ? 'text-violet-900' : 'text-gray-600'}`}>Freelancer</span>
      </button>
    </div>
  );
};
