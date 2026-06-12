import React, { useState } from 'react';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login('fake-jwt-token', { id: '1', email: 'test@prowork.com', role: role || 'freelancer' });
    navigate(role === 'empresa' ? '/mis-proyectos' : '/feed');
  };

  return (
    <div className="w-full relative">
      <div className="flex p-1 bg-gray-100 rounded-lg mb-8 relative">
        <div 
          className={`absolute inset-y-1 w-1/2 bg-white rounded-md shadow-sm transition-transform duration-300 ${mode === 'register' ? 'translate-x-[calc(100%-8px)]' : 'translate-x-0'}`}
        ></div>
        <button
          onClick={() => setMode('login')}
          className={`flex-1 py-2 text-sm font-medium z-10 transition-colors ${mode === 'login' ? 'text-gray-900' : 'text-gray-500'}`}
        >
          Iniciar Sesión
        </button>
        <button
          onClick={() => setMode('register')}
          className={`flex-1 py-2 text-sm font-medium z-10 transition-colors ${mode === 'register' ? 'text-gray-900' : 'text-gray-500'}`}
        >
          Registrarse
        </button>
      </div>

      <div className="relative min-h-[300px]">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                <input type="email" required className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition" placeholder="tu@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input type="password" required className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition" placeholder="••••••••" />
              </div>
              <button type="submit" className="w-full mt-2 px-4 py-3 bg-gray-900 text-white rounded-lg font-semibold shadow-md hover:bg-gray-800 transition">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <input type="text" required className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition" placeholder="Elon Musk" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                <input type="email" required className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition" placeholder="tu@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input type="password" required className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition" placeholder="••••••••" />
              </div>
              <button type="submit" disabled={!role} className="w-full mt-2 px-4 py-3 bg-blue-600 disabled:bg-gray-300 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 transition">
                Crear Cuenta
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
