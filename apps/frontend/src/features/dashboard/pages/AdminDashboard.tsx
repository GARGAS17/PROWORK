import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Loader2, Users, Briefcase, AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface MatchRequest {
  id: string;
  project_id: string;
  freelancer_id: string;
  status: string;
  updated_at: string;
  projects: {
    title: string;
    company_id: string;
    users: { email: string };
  };
  users: {
    email: string;
    profiles?: { full_name: string } | any[];
  };
}

export const AdminDashboard = () => {
  const { token } = useAuth();
  const [requests, setRequests] = useState<MatchRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, [token]);

  const fetchRequests = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/admin/match-requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error al cargar solicitudes');
      setRequests(json.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveMatch = async (applicationId: string, projectId: string) => {
    setIsProcessing(applicationId);
    try {
      const res = await fetch('http://localhost:3000/api/admin/match', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ applicationId, projectId })
      });
      
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error al procesar el emparejamiento');
      
      // Refresh list
      await fetchRequests();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsProcessing(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          Mesa de Curaduría
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Panel de control global de la plataforma Prowork.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 lg:p-6 shadow-sm flex items-center gap-3 lg:gap-4 overflow-hidden">
          <div className="bg-indigo-50 dark:bg-indigo-500/10 p-3 lg:p-4 rounded-full text-indigo-600 dark:text-indigo-400 shrink-0">
            <Users className="w-6 h-6 lg:w-8 lg:h-8" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs lg:text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">Usuarios</h3>
            <p className="text-xl lg:text-2xl font-black text-gray-900 dark:text-white truncate">Global</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 lg:p-6 shadow-sm flex items-center gap-3 lg:gap-4 overflow-hidden">
          <div className="bg-indigo-50 dark:bg-indigo-500/10 p-3 lg:p-4 rounded-full text-indigo-600 dark:text-indigo-400 shrink-0">
            <Briefcase className="w-6 h-6 lg:w-8 lg:h-8" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs lg:text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">Proyectos</h3>
            <p className="text-xl lg:text-2xl font-black text-gray-900 dark:text-white truncate">Auditoría</p>
          </div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-4 lg:p-6 shadow-sm flex items-center gap-3 lg:gap-4 overflow-hidden sm:col-span-2 xl:col-span-1">
          <div className="bg-amber-100 dark:bg-amber-500/20 p-3 lg:p-4 rounded-full text-amber-600 dark:text-amber-400 shrink-0">
            <AlertCircle className="w-6 h-6 lg:w-8 lg:h-8" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xs lg:text-sm font-bold text-amber-700 dark:text-amber-400/80 uppercase tracking-wider truncate">Solicitudes (Match)</h3>
            <p className="text-2xl lg:text-3xl font-black text-amber-600 dark:text-amber-400 truncate">{requests.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-sm mt-8">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-xl font-black text-gray-900 dark:text-white">
            Solicitudes de Emparejamiento (Match) Pendientes
          </h3>
        </div>

        {error ? (
          <div className="bg-red-50 dark:bg-red-500/10 border-l-4 border-red-500 p-4 rounded-xl">
            <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">Todo al día</h4>
            <p className="text-gray-500 dark:text-gray-400">No hay solicitudes de emparejamiento pendientes en este momento.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map(req => {
              const freelancerProfile = Array.isArray(req.users?.profiles) ? req.users.profiles[0] : req.users?.profiles;
              const freelancerName = freelancerProfile?.full_name || 'Freelancer';
              
              return (
                <div key={req.id} className="border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-lg uppercase tracking-wider">
                        Requiere Acción
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(req.updated_at).toLocaleString()}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                      Proyecto: {req.projects?.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-bold text-gray-900 dark:text-gray-300">Empresa:</span> {req.projects?.users?.email}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-bold text-gray-900 dark:text-gray-300">Freelancer Solicitado:</span> {freelancerName} ({req.users?.email})
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-col items-center sm:items-end gap-2 w-full md:w-auto">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Acción Oficial de Prowork</p>
                    <button
                      disabled={isProcessing === req.id}
                      onClick={() => handleApproveMatch(req.id, req.project_id)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white rounded-xl font-bold transition-colors shadow-sm"
                    >
                      {isProcessing === req.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <ShieldCheck className="w-5 h-5" />
                      )}
                      {isProcessing === req.id ? 'Ejecutando...' : 'Aprobar Emparejamiento'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
