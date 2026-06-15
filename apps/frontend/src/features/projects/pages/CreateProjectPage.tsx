import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Loader2, ChevronDown } from 'lucide-react';

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'COP', symbol: '$', label: 'COP ($)' },
  { code: 'MXN', symbol: '$', label: 'MXN ($)' },
  { code: 'PEN', symbol: 'S/', label: 'PEN (S/)' },
];

export const CreateProjectPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const currencyRef = useRef<HTMLDivElement>(null);
  
  const selectedCurrencyObj = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setIsCurrencyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const [techInput, setTechInput] = useState('');
  const [technologies, setTechnologies] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && techInput.trim() !== '') {
      e.preventDefault();
      const newTech = techInput.trim();
      if (!technologies.includes(newTech)) {
        setTechnologies([...technologies, newTech]);
      }
      setTechInput('');
    }
  };

  const removeTech = (techToRemove: string) => {
    setTechnologies(technologies.filter(tech => tech !== techToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (technologies.length === 0) {
      setError('Debes incluir al menos una tecnología requerida.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          estimated_budget: Number(budget),
          currency,
          technologies
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear el proyecto. Verifica los datos.');
      }

      // Si todo sale bien, redirigimos a la vista principal del dashboard
      navigate('/empresa');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          Publicar Nueva Oferta
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
          Describe el proyecto para encontrar al mejor talento de Prowork.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border-l-4 border-red-500 p-4 rounded-md">
          <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm">
        
        {/* Título */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
            Título del Proyecto
          </label>
          <input
            type="text"
            required
            minLength={5}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Desarrollo de App Móvil para E-commerce"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Presupuesto y Moneda */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
            Presupuesto Estimado
          </label>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <span className="absolute left-4 top-3 text-gray-500 dark:text-gray-400 font-medium">{selectedCurrencyObj.symbol}</span>
              <input
                type="number"
                required
                min="1"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="1500"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="relative" ref={currencyRef}>
              <button
                type="button"
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="w-36 flex items-center justify-between px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all cursor-pointer"
              >
                <span>{selectedCurrencyObj.label}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isCurrencyOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                  {CURRENCIES.map((curr) => (
                    <button
                      key={curr.code}
                      type="button"
                      onClick={() => {
                        setCurrency(curr.code);
                        setIsCurrencyOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        currency === curr.code
                          ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-bold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {curr.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tecnologías (Chips) */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
            Habilidades Requeridas
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Escribe una tecnología y presiona <kbd className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-700 dark:text-gray-300 font-mono">Enter</kbd> para agregarla.
          </p>
          <div className="min-h-[50px] p-2 flex flex-wrap gap-2 items-center border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-950 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
            {technologies.map(tech => (
              <span key={tech} className="flex items-center gap-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-medium rounded-full text-sm animate-in zoom-in duration-200">
                {tech}
                <button
                  type="button"
                  onClick={() => removeTech(tech)}
                  className="hover:bg-indigo-200 dark:hover:bg-indigo-500/40 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={handleAddTech}
              placeholder={technologies.length === 0 ? "Ej: React, Node.js..." : "Añadir más..."}
              className="flex-1 min-w-[120px] bg-transparent outline-none px-2 py-1 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
            Descripción Detallada
          </label>
          <textarea
            required
            minLength={20}
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe los objetivos del proyecto, qué necesitas construir, plazos esperados, etc..."
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
          />
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Publicando...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Publicar Proyecto
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
