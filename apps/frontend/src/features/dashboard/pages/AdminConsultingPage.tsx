import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Loader2, ShieldCheck, HeadphonesIcon, CheckCircle2 } from 'lucide-react';

interface ConsultingRequest {
  id: string;
  company_id: string;
  status: string;
  created_at: string;
  companies?: { profiles?: { full_name: string } | { full_name: string }[] };
}

export const AdminConsultingPage = () => {
  const { token } = useAuth();
  const [requests, setRequests] = useState<ConsultingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/consulting/admin/pending', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (res.ok) {
        setRequests(json.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [token]);

  const handleComplete = async (id: string) => {
    setProcessingId(id);
    setSuccessMsg('');
    try {
      const res = await fetch(`http://localhost:3000/api/consulting/admin/${id}/complete`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        throw new Error('Error al marcar como realizada');
      }
      setSuccessMsg('Asesoría marcada como realizada exitosamente.');
      await fetchRequests();
    } catch (err: any) {
      alert(err.message || 'Error al procesar');
    } finally {
      setProcessingId(null);
    }
  };

  const getProfileName = (userObj: any) => {
    if (!userObj?.profiles) return 'Empresa Desconocida';
    return Array.isArray(userObj.profiles) ? userObj.profiles[0]?.full_name : userObj.profiles.full_name;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
          <HeadphonesIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          Solicitudes de Asesoría
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Gestiona las peticiones de las empresas que necesitan ayuda publicando sus proyectos o definiendo requisitos.
        </p>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 dark:bg-emerald-500/10 border-l-4 border-emerald-500 p-4 rounded-r-xl">
          <p className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            {successMsg}
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
      ) : requests.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700 rounded-3xl p-16 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <HeadphonesIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Sin solicitudes pendientes</h3>
          <p className="text-gray-500 dark:text-gray-400">Las empresas no han solicitado asesorías recientemente.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${req.status === 'pending' ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'}`}>
                    {req.status === 'pending' ? 'Pendiente' : 'Realizada'}
                  </span>
                  <span className="text-sm text-gray-500">{new Date(req.created_at).toLocaleString()}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {getProfileName(req.companies)}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Esta empresa ha solicitado acompañamiento. Ponte en contacto con ellos.
                </p>
              </div>

              {req.status === 'pending' && (
                <div className="shrink-0">
                  <button
                    onClick={() => handleComplete(req.id)}
                    disabled={processingId === req.id}
                    className="w-full md:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {processingId === req.id ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Procesando...</>
                    ) : (
                      <><CheckCircle2 className="w-5 h-5" /> Marcar como Realizada</>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
