import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { ArrowLeft, Loader2, FileText, UserCircle2, ExternalLink, ShieldCheck, X, MessageSquareText } from 'lucide-react';

interface Application {
  id: string;
  project_id: string;
  freelancer_id: string;
  resume_pdf_url: string;
  proposal_text: string;
  status: string;
  created_at: string;
  users: { 
    email: string;
    profiles?: { 
      full_name: string; 
      bio?: string;
      avatar_url: string;
      freelancer_skills?: { skills: { name: string } }[];
    } | any[];
  };
}

export const ProjectApplicationsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [modalState, setModalState] = useState<{ type: 'proposal' | 'bio' | null, app: Application | null }>({ type: null, app: null });
  const [escrowModal, setEscrowModal] = useState<{ isOpen: boolean, app: Application | null, isSubmitting: boolean }>({ isOpen: false, app: null, isSubmitting: false });

  const handleHire = async (app: Application) => {
    setEscrowModal({ ...escrowModal, isSubmitting: true });
    try {
      const res = await fetch(`http://localhost:3000/api/applications/${app.id}/request-contract`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Error al solicitar contratación');
      }
      setEscrowModal({ isOpen: false, app: null, isSubmitting: false });
      
      // Simple reload for now to reflect new status
      window.location.reload();
    } catch (err: any) {
      alert(err.message || err);
      setEscrowModal({ ...escrowModal, isSubmitting: false });
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/applications/proyecto/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const json = await res.json();
        
        if (!res.ok) throw new Error(json.error || 'Error al cargar los postulantes');
        
        setApplications(json.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchApplications();
  }, [id, token]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-200 dark:border-gray-800 pb-6">
        <Link to="/empresa" className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" />
          Volver a Mis Proyectos
        </Link>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mt-2">
          Candidatos del Proyecto
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Revisa las propuestas y elige al mejor talento para tu equipo.
        </p>
      </div>

      {/* Info Alert: Curaduría Prowork */}
      <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-2xl p-4 flex items-start gap-4">
        <div className="bg-indigo-100 dark:bg-indigo-500/20 p-2 rounded-xl text-indigo-600 dark:text-indigo-400 shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-indigo-900 dark:text-indigo-300">Contratación Segura de Prowork</h4>
          <p className="text-sm text-indigo-700 dark:text-indigo-400/80 mt-1">
            Puedes evaluar los perfiles y leer sus propuestas aquí. Una vez estés listo para contratar, ponte en contacto con nuestro equipo de Soporte (Admin) para ejecutar el emparejamiento formal y la transacción financiera de forma 100% segura.
          </p>
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-500/10 border-l-4 border-red-500 p-4 rounded-xl">
          <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-16 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <UserCircle2 className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Aún no hay candidatos</h3>
          <p className="text-gray-500 dark:text-gray-400">Las postulaciones aparecerán aquí en cuanto los freelancers envíen sus propuestas.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
              
              {/* Profile Avatar & Info */}
              <div className="flex items-start gap-4 md:w-1/3 shrink-0">
                {(() => {
                  const profile = Array.isArray(app.users?.profiles) ? app.users.profiles[0] : app.users?.profiles;
                  const skills = profile?.freelancer_skills?.map((fs: any) => fs.skills.name) || [];

                  return (
                    <>
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Avatar" className="w-14 h-14 rounded-full object-cover border border-gray-200 dark:border-gray-700 shrink-0" />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700 shrink-0">
                          <UserCircle2 className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight truncate">
                          {profile?.full_name || 'Freelancer Anónimo'}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {app.users?.email}
                        </p>
                        
                        {/* Skills Chips */}
                        {skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {skills.slice(0, 3).map((skill: string) => (
                              <span key={skill} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300 rounded-md">
                                {skill}
                              </span>
                            ))}
                            {skills.length > 3 && (
                              <span className="px-2 py-0.5 bg-gray-50 dark:bg-gray-800/50 text-xs font-bold text-gray-400 rounded-md">
                                +{skills.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                        
                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mt-3">
                          {new Date(app.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Proposal and Bio Actions */}
              <div className="flex-1 flex flex-col justify-center gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setModalState({ type: 'proposal', app })}
                    className="inline-flex items-center justify-between w-full p-4 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 border border-indigo-100 dark:border-indigo-500/20 rounded-xl text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-100 dark:bg-indigo-500/30 p-2 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <MessageSquareText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-indigo-900 dark:text-indigo-300">Propuesta</h4>
                        <p className="text-xs text-indigo-700 dark:text-indigo-400/80">Leer carta</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setModalState({ type: 'bio', app })}
                    className="inline-flex items-center justify-between w-full p-4 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 border border-emerald-100 dark:border-emerald-500/20 rounded-xl text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-100 dark:bg-emerald-500/30 p-2 rounded-lg text-emerald-600 dark:text-emerald-400">
                        <UserCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-emerald-900 dark:text-emerald-300">Biografía</h4>
                        <p className="text-xs text-emerald-700 dark:text-emerald-400/80">Ver perfil</p>
                      </div>
                    </div>
                  </button>
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <a 
                    href={app.resume_pdf_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-3 sm:py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 transition-colors w-full sm:w-auto justify-center"
                  >
                    <FileText className="w-4 h-4" />
                    Portafolio / CV
                    <ExternalLink className="w-3 h-3 text-gray-400" />
                  </a>
                  
                  {app.status === 'pending_contract' ? (
                    <div className="inline-flex items-center gap-2 px-4 py-3 sm:py-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg text-sm font-bold text-amber-700 dark:text-amber-400 w-full sm:w-auto justify-center">
                      <ShieldCheck className="w-4 h-4" />
                      Contrato Solicitado
                    </div>
                  ) : app.status === 'accepted' || app.status === 'seleccionado' ? (
                    <div className="inline-flex items-center gap-2 px-4 py-3 sm:py-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg text-sm font-bold text-emerald-700 dark:text-emerald-400 w-full sm:w-auto justify-center">
                      <ShieldCheck className="w-4 h-4" />
                      Freelancer Contratado
                    </div>
                  ) : app.status === 'rejected' || app.status === 'rechazado' ? (
                    <div className="inline-flex items-center gap-2 px-4 py-3 sm:py-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-sm font-bold text-red-700 dark:text-red-400 w-full sm:w-auto justify-center">
                      <X className="w-4 h-4" />
                      No Seleccionado
                    </div>
                  ) : (
                    <button 
                      onClick={() => setEscrowModal({ isOpen: true, app, isSubmitting: false })}
                      className="inline-flex items-center gap-2 px-4 py-3 sm:py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-bold text-white transition-colors w-full sm:w-auto justify-center shadow-sm"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Solicitar Contratación
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Generic Modal */}
      {modalState.app && modalState.type && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setModalState({ type: null, app: null })}
          />
          <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-black text-gray-900 dark:text-white">
                {modalState.type === 'proposal' ? 'Carta de Presentación' : 'Biografía del Freelancer'}
              </h3>
              <button 
                onClick={() => setModalState({ type: null, app: null })}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              <div className="bg-gray-50 dark:bg-gray-950 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
                  {modalState.type === 'proposal' 
                    ? modalState.app.proposal_text 
                    : (Array.isArray(modalState.app.users?.profiles) ? modalState.app.users.profiles[0]?.bio : modalState.app.users?.profiles?.bio) || 'El usuario no ha añadido una biografía.'
                  }
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/50 flex justify-end">
              <button
                onClick={() => setModalState({ type: null, app: null })}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-bold transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Escrow Modal */}
      {escrowModal.isOpen && escrowModal.app && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className="mx-auto w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Pago en Garantía</h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Para solicitar la contratación de <span className="font-bold text-gray-900 dark:text-white">{escrowModal.app.users?.profiles ? (Array.isArray(escrowModal.app.users.profiles) ? escrowModal.app.users.profiles[0]?.full_name : escrowModal.app.users.profiles?.full_name) : 'este freelancer'}</span>, 
              debes depositar los fondos en Prowork. El dinero se mantendrá seguro en Escrow y solo será liberado al Freelancer cuando apruebes el trabajo final.
            </p>

            <div className="bg-gray-50 dark:bg-gray-950 rounded-2xl p-6 mb-8 border border-gray-100 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">Monto a Depositar</p>
              <p className="text-4xl font-black text-gray-900 dark:text-white">${escrowModal.app.bid_amount || '0.00'}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setEscrowModal({ isOpen: false, app: null, isSubmitting: false })}
                disabled={escrowModal.isSubmitting}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-xl transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleHire(escrowModal.app!)}
                disabled={escrowModal.isSubmitting}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-indigo-500/30 flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {escrowModal.isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                {escrowModal.isSubmitting ? 'Procesando...' : 'Depositar y Contratar'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
