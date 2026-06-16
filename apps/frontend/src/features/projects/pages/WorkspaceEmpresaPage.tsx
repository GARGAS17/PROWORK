import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Loader2, ArrowLeft, ShieldAlert, FileText, CheckCircle, XCircle, CheckCircle2 } from 'lucide-react';

export const WorkspaceEmpresaPage = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  
  const [deliverables, setDeliverables] = useState<any[]>([]);
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para solicitar cambios
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Modal de confirmación
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, delivRes] = await Promise.all([
          fetch(`http://localhost:3000/api/projects/${id}`),
          fetch(`http://localhost:3000/api/deliverables/proyecto/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
        
        const projJson = await projRes.json();
        const delivJson = await delivRes.json();
        
        if (projRes.ok) setProject(projJson.data);
        if (delivRes.ok) setDeliverables(delivJson.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, token]);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleReview = async (deliverableId: string, status: 'approved' | 'rejected') => {
    if (status === 'approved') {
      setConfirmModal({
        isOpen: true,
        title: 'Aprobar Entregable',
        message: '¿Estás seguro de que quieres aprobar este entregable? Asegúrate de haber revisado los archivos adjuntos.',
        onConfirm: () => executeReview(deliverableId, status)
      });
      return;
    }
    
    if (status === 'rejected' && !feedback.trim()) {
      alert('Debes escribir un mensaje de retroalimentación para solicitar cambios.');
      return;
    }

    executeReview(deliverableId, status);
  };

  const executeReview = async (deliverableId: string, status: 'approved' | 'rejected') => {
    setIsSubmitting(true);
    setConfirmModal({ ...confirmModal, isOpen: false });
    
    try {
      const body: any = { status };
      if (status === 'rejected') body.feedback = feedback;

      const res = await fetch(`http://localhost:3000/api/deliverables/${deliverableId}/review`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error('Error al actualizar entregable');
      
      // Actualizar estado local
      setDeliverables(prev => prev.map(d => d.id === deliverableId ? { ...d, status, feedback: body.feedback } : d));
      
      if (status === 'approved') showSuccess('¡Entregable Aprobado Exitosamente!');
      if (status === 'rejected') {
        setRejectingId(null);
        setFeedback('');
        showSuccess('Se han solicitado los cambios al freelancer.');
      }
    } catch (err) {
      alert('Error: ' + err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalizeProject = async () => {
    setConfirmModal({
      isOpen: true,
      title: 'Finalizar Proyecto',
      message: '¿Estás seguro de que quieres dar el proyecto por TERMINADO? Esta acción es irreversible y cerrará el espacio de trabajo para el Freelancer.',
      onConfirm: executeFinalizeProject
    });
  };

  const executeFinalizeProject = async () => {
    setConfirmModal({ ...confirmModal, isOpen: false });
    try {
      const res = await fetch(`http://localhost:3000/api/projects/${id}/finalizar`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al finalizar el proyecto');
      
      setProject({ ...project, status: 'cerrado' });
      showSuccess('¡Proyecto finalizado exitosamente!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
        <div>
          <Link to="/empresa" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" />
            Volver a Mis Proyectos
          </Link>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-2">
            Espacio de Trabajo del Proyecto
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Revisa las entregas de tu Freelancer y finaliza el proyecto.
          </p>
        </div>

        {project?.status !== 'cerrado' ? (
          <button 
            onClick={handleFinalizeProject}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/30 shrink-0"
          >
            <CheckCircle className="w-5 h-5" />
            Finalizar Proyecto
          </button>
        ) : (
          <div className="bg-emerald-50 text-emerald-700 px-6 py-3 rounded-xl font-black uppercase text-sm tracking-wider">
            Proyecto Terminado
          </div>
        )}
      </div>

      {successMessage && (
        <div className="bg-emerald-50 dark:bg-emerald-500/10 border-l-4 border-emerald-500 p-4 rounded-xl animate-in slide-in-from-top-2 flex items-center gap-3 shadow-sm">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          <p className="text-emerald-800 dark:text-emerald-300 font-bold">{successMessage}</p>
        </div>
      )}

      {deliverables.filter(d => d.status === 'pending_review').length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700 rounded-3xl p-16 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Aún no hay entregas pendientes</h3>
          <p className="text-gray-500 dark:text-gray-400">El freelancer no tiene entregables pendientes de revisión en este momento.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {deliverables.filter(d => d.status === 'pending_review').map(deliv => (
            <div key={deliv.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center font-bold text-indigo-600 overflow-hidden">
                    {deliv.users?.profiles?.avatar_url ? (
                      <img src={deliv.users.profiles.avatar_url} className="w-full h-full object-cover" />
                    ) : (
                      deliv.users?.email?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      {deliv.users?.profiles?.full_name || 'Freelancer'}
                    </h4>
                    <p className="text-xs text-gray-500">{new Date(deliv.created_at).toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-950 p-6 rounded-2xl mb-6">
                  <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{deliv.message}</p>
                </div>

                {deliv.feedback && (
                  <div className="bg-red-50 dark:bg-red-500/10 p-6 rounded-2xl mb-6 border border-red-200 dark:border-red-500/20">
                    <h5 className="font-bold text-red-800 dark:text-red-400 mb-2 flex items-center gap-2">
                      <XCircle className="w-4 h-4" /> Comentarios de la Empresa
                    </h5>
                    <p className="text-red-700 dark:text-red-300 text-sm whitespace-pre-wrap">{deliv.feedback}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-4 items-center">
                  <a 
                    href={deliv.file_url} 
                    target="_blank" 
                    className="px-6 py-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
                  >
                    Descargar Archivo Entregable
                  </a>
                </div>
              </div>

              {/* Status & Actions Box */}
              <div className="md:w-72 shrink-0 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800 pt-6 md:pt-0 md:pl-6 flex flex-col justify-center">
                {deliv.status === 'pending_review' && (
                  <>
                    <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 mb-4 text-center">
                      <ShieldAlert className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                      <p className="text-sm font-bold text-amber-700 dark:text-amber-400">Pendiente de Revisión</p>
                    </div>

                    {rejectingId === deliv.id ? (
                      <div className="animate-in fade-in slide-in-from-top-2">
                        <textarea
                          placeholder="Escribe qué cambios necesitas..."
                          className="w-full text-sm p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white mb-3"
                          rows={3}
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReview(deliv.id, 'rejected')}
                            disabled={isSubmitting}
                            className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm transition-colors"
                          >
                            Enviar
                          </button>
                          <button
                            onClick={() => {
                              setRejectingId(null);
                              setFeedback('');
                            }}
                            className="flex-1 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-lg text-sm transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <button 
                          onClick={() => handleReview(deliv.id, 'approved')}
                          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/30"
                        >
                          <CheckCircle className="w-5 h-5" />
                          Aprobar Entregable
                        </button>
                        <button 
                          onClick={() => setRejectingId(deliv.id)}
                          className="w-full py-3 bg-white dark:bg-gray-900 border-2 border-red-100 hover:border-red-200 dark:border-red-500/20 dark:hover:border-red-500/40 text-red-600 dark:text-red-400 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                        >
                          Solicitar Cambios
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{confirmModal.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">{confirmModal.message}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-indigo-500/30"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
