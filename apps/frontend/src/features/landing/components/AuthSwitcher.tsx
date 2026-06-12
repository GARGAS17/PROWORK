import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type AuthMode } from '../types/landing.types';
import { RoleSelector } from './RoleSelector';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const AuthSwitcher = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [role, setRole] = useState<'empresa' | 'freelancer' | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login('fake-jwt-token', { id: '1', email: 'test@prowork.com', role: role || 'freelancer' });
    navigate(role === 'empresa' ? '/mis-proyectos' : '/feed');
  };

  return (
    <div className="w-full relative">
      <div className="flex p-1 bg-gray-950/80 border border-gray-800 rounded-lg mb-8 relative">
        <div 
          className={`absolute inset-y-1 w-1/2 bg-gray-800 rounded-md shadow-sm transition-transform duration-300 ${mode === 'register' ? 'translate-x-[calc(100%-8px)]' : 'translate-x-0'}`}
        ></div>
        <button
          type="button"
          onClick={() => setMode('login')}
          className={`flex-1 py-2 text-sm font-medium z-10 transition-colors ${mode === 'login' ? 'text-white' : 'text-gray-500'}`}
        >
          Iniciar Sesión
        </button>
        <button
          type="button"
          onClick={() => setMode('register')}
          className={`flex-1 py-2 text-sm font-medium z-10 transition-colors ${mode === 'register' ? 'text-white' : 'text-gray-500'}`}
        >
          Registrarse
        </button>
      </div>

      <div className="relative min-h-[360px]">
        <AnimatePresence mode="wait">
          {mode === 'login' ? (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 absolute w-full"
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Correo Electrónico</label>
                <input type="email" required className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-950/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder-gray-600" placeholder="tu@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Contraseña</label>
                <input type="password" required className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-950/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder-gray-600" placeholder="••••••••" />
              </div>
              <button type="submit" className="w-full mt-4 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:bg-blue-500 transition">
                Entrar
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 absolute w-full"
            >
              <RoleSelector selectedRole={role} onSelect={setRole} />
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Nombre Completo</label>
                <input type="text" required className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-950/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder-gray-600" placeholder="Elon Musk" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Correo</label>
                <input type="email" required className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-950/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder-gray-600" placeholder="tu@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Contraseña</label>
                <input type="password" required className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-950/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder-gray-600" placeholder="••••••••" />
              </div>
              <button type="submit" disabled={!role} className="w-full mt-4 px-4 py-3 bg-blue-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg font-semibold shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:bg-blue-500 transition">
                Crear Cuenta
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
