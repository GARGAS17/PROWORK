import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Loader2, FileText, CheckCircle2, XCircle, Clock, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Application {
  id: string;
  project_id: string;
  bid_amount: number;
  status: string;
  created_at: string;
  projects: {
    title: string;
    status: string;
    estimated_budget: number;
  };
}

export const MisPostulacionesPage = () => {
  const { token } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/applications/mis-postulaciones', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();
        if (res.ok) {
          setApplications(json.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyApplications();
  }, [token]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
      case 'seleccionado':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> Aceptada / Contratado</span>;
      case 'pending_contract':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-xs font-bold"><ShieldCheck className="w-3.5 h-3.5" /> Contrato en Proceso</span>;
      case 'rejected':
      case 'rechazado':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-bold"><XCircle className="w-3.5 h-3.5" /> Rechazada</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold"><Clock className="w-3.5 h-3.5" /> Pendiente de Revisión</span>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Mis Postulaciones</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Haz seguimiento a todas las ofertas de trabajo a las que te has postulado.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
      ) : applications.filter(app => app.projects?.status !== 'cerrado').length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700 rounded-3xl p-16 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Aún no te has postulado a proyectos activos</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Busca proyectos en tu muro y envía tu primera propuesta.</p>
          <Link to="/freelancer" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors">
            Explorar Proyectos
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.filter(app => app.projects?.status !== 'cerrado').map((app) => (
            <div key={app.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{app.projects?.title || 'Proyecto Eliminado'}</h3>
                  {getStatusBadge(app.status)}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <p>Presupuesto del Cliente: <span className="font-bold text-gray-700 dark:text-gray-300">${app.projects?.estimated_budget || '0.00'}</span></p>
                  <p>Tu Oferta: <span className="font-bold text-indigo-600 dark:text-indigo-400">${app.bid_amount}</span></p>
                  <p>Postulado el: {new Date(app.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex-shrink-0">
                {(app.status === 'accepted' || app.status === 'seleccionado') ? (
                  <Link 
                    to={`/freelancer/workspace/${app.project_id}`}
                    className="inline-flex px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-500/30"
                  >
                    Ir al Espacio de Trabajo
                  </Link>
                ) : (
                  <button disabled className="inline-flex px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 font-bold rounded-xl cursor-not-allowed">
                    Esperando Respuesta
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
