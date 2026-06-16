import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Loader2, ArrowLeft, Send, CheckCircle2, FileUp, ShieldCheck } from 'lucide-react';

export const WorkspaceFreelancerPage = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  
  const [project, setProject] = useState<any>(null);
  const [deliverables, setDeliverables] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Upload state
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !id) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('project_id', id);
    formData.append('message', message);

    try {
      const res = await fetch(`http://localhost:3000/api/deliverables`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) throw new Error('Error al subir entregable');
      
      const json = await res.json();
      setDeliverables([json.data, ...deliverables]);
      setFile(null);
      setMessage('');
      
      setSuccessMessage('¡Entregable subido con éxito! La empresa ha sido notificada.');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      alert('Error: ' + err);
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2 border-b border-gray-200 dark:border-gray-800 pb-6">
        <Link to="/freelancer/trabajos" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" />
          Volver a Mis Trabajos Activos
        </Link>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-2">
          Espacio de Trabajo
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Sube tus archivos finales para que la empresa los revise y apruebe el proyecto.
        </p>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 dark:bg-emerald-500/10 border-l-4 border-emerald-500 p-4 rounded-xl animate-in slide-in-from-top-2 flex items-center gap-3 shadow-sm">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          <p className="text-emerald-800 dark:text-emerald-300 font-bold">{successMessage}</p>
        </div>
      )}

      <div className="bg-indigo-50 border border-indigo-200 dark:bg-indigo-500/10 dark:border-indigo-500/20 rounded-2xl p-6 flex items-start gap-4">
        <ShieldCheck className="w-8 h-8 text-indigo-600 dark:text-indigo-400 shrink-0" />
        <div>
          <h4 className="font-bold text-indigo-900 dark:text-indigo-300">Entrega Oficial Prowork</h4>
          <p className="text-sm text-indigo-700 dark:text-indigo-400/80 mt-1">
            Al subir tu entregable aquí, la empresa recibirá una notificación. Una vez aprobado, tu pago será liberado.
          </p>
        </div>
      </div>

      {project?.status === 'cerrado' ? (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-500 rounded-3xl p-12 text-center shadow-lg">
          <div className="mx-auto w-20 h-20 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-3xl font-black text-emerald-900 dark:text-emerald-300 mb-4 uppercase tracking-wide">¡Proyecto Terminado!</h3>
          <p className="text-emerald-700 dark:text-emerald-400 text-lg">
            La empresa ha aprobado el proyecto y lo ha dado por finalizado. ¡Excelente trabajo! Prowork liberará tus fondos pronto.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Subir Nuevo Entregable</h3>
          
          <form onSubmit={handleUpload} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Archivo Final (.zip, .pdf, etc)</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  required
                />
                <FileUp className="w-8 h-8 text-gray-400 mb-2" />
                {file ? (
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{file.name}</p>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Haz clic o arrastra tu archivo aquí</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Mensaje para la empresa</label>
              <textarea 
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="Ej: ¡Hola! Aquí adjunto el código fuente y los assets finales..."
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={!file || isUploading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-500/30"
            >
              {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {isUploading ? 'Subiendo...' : 'Enviar Entregable'}
            </button>
          </form>
        </div>
      )}

      {/* Historial de entregables */}
      {deliverables.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Historial de Entregas</h3>
          {deliverables.map(deliv => (
            <div key={deliv.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
              <div className="flex-1 w-full">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{new Date(deliv.created_at).toLocaleString()}</p>
                <p className="font-bold text-gray-900 dark:text-white mb-2">{deliv.message}</p>
                
                {deliv.feedback && (
                  <div className="bg-red-50 dark:bg-red-500/10 p-4 rounded-xl border border-red-200 dark:border-red-500/20 mt-3">
                    <p className="text-xs font-bold text-red-800 dark:text-red-400 mb-1 uppercase tracking-wider">Comentarios de la Empresa:</p>
                    <p className="text-sm text-red-700 dark:text-red-300">{deliv.feedback}</p>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end shrink-0">
                {deliv.status === 'pending_review' && <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase">En Revisión</span>}
                {deliv.status === 'approved' && <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Aprobado</span>}
                {deliv.status === 'rejected' && <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase">Rechazado</span>}
                <a href={deliv.file_url} target="_blank" className="text-indigo-600 hover:text-indigo-400 font-bold text-sm shrink-0">Descargar</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
