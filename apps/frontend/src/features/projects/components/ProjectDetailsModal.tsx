import { useState } from 'react';
import { X, Loader2, Send } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export interface Project {
  id: string;
  title: string;
  description: string;
  estimated_budget: number;
  currency: string;
  technologies: string[];
  status: string;
}

interface ProjectDetailsModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onApplied: () => void;
}

export const ProjectDetailsModal = ({ project, isOpen, onClose, onApplied }: ProjectDetailsModalProps) => {
  const { token } = useAuth();
  const [proposalText, setProposalText] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [bidAmount, setBidAmount] = useState<number | ''>('');
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (proposalText.length < 50) {
      setError('Tu propuesta debe tener al menos 50 caracteres.');
      return;
    }

    setIsApplying(true);

    try {
      const response = await fetch('http://localhost:3000/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          project_id: project.id,
          resume_pdf_url: resumeUrl,
          proposal_text: proposalText,
          bid_amount: Number(bidAmount)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar la postulación.');
      }

      onApplied();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-100 dark:border-gray-800">
          <div>
            <span className="px-3 py-1 text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 rounded-full mb-3 inline-block">
              {project.status.replace('_', ' ').toUpperCase()}
            </span>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
              {project.title}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* Detalles Rápidos */}
          <div className="flex flex-wrap gap-6 p-4 bg-gray-50 dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800">
            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Presupuesto</p>
              <p className="text-xl font-black text-gray-900 dark:text-white">
                ${project.estimated_budget} <span className="text-sm font-medium text-gray-500">{project.currency || 'USD'}</span>
              </p>
            </div>
            <div className="w-px bg-gray-200 dark:bg-gray-800 hidden sm:block"></div>
            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Tecnologías Requeridas</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.technologies.map(tech => (
                  <span key={tech} className="px-2 py-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-lg">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">Acerca del Proyecto</h3>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">
              {project.description}
            </p>
          </div>

          <hr className="border-gray-200 dark:border-gray-800" />

          {/* Formulario de Postulación */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-indigo-500" />
              Enviar tu Propuesta
            </h3>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-500/10 border-l-4 border-red-500 p-3 rounded-md text-sm text-red-700 dark:text-red-400">
                {error}
              </div>
            )}

            <form id="apply-form" onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  URL de tu CV o Portafolio (PDF/Web)
                </label>
                <input
                  type="url"
                  required
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/tu-perfil"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Tu Oferta Económica (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                  <input
                    type="number"
                    required
                    min={1}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    placeholder="Ej. 500"
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Carta de Presentación / Propuesta
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Explica por qué eres la persona ideal para este proyecto (Mínimo 50 caracteres).
                </p>
                <textarea
                  required
                  minLength={50}
                  rows={4}
                  value={proposalText}
                  onChange={(e) => setProposalText(e.target.value)}
                  placeholder="Hola, me encantaría participar en este proyecto porque tengo experiencia en..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                />
              </div>
            </form>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/50 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="apply-form"
            disabled={isApplying}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {isApplying ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Enviando...
              </>
            ) : (
              'Postularme Ahora'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
