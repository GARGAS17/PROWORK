import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Loader2, Briefcase, ChevronRight } from 'lucide-react';

export const FreelancerJobsPage = () => {
  const { token } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/applications/mis-postulaciones', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();
        
        if (res.ok) {
          // Filtrar las postulaciones que fueron aceptadas (proyectos en progreso)
          const activeJobs = json.data.filter((app: any) => app.status === 'accepted' || app.status === 'seleccionado');
          setJobs(activeJobs);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [token]);

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          Mis Trabajos Activos
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Proyectos en los que has sido contratado oficialmente. Entra al Espacio de Trabajo para subir tus entregables.
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700 rounded-3xl p-16 text-center">
          <div className="mx-auto w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No tienes trabajos activos</h3>
          <p className="text-gray-500 dark:text-gray-400">Postúlate a proyectos en el Muro de Oportunidades.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {jobs.map(job => (
            <Link 
              key={job.id}
              to={`/freelancer/workspace/${job.project_id}`}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {job.projects?.title}
                    </h3>
                    {job.projects?.status === 'cerrado' && (
                      <span className="px-2 py-0.5 text-xs font-bold bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 rounded-full border border-gray-200 dark:border-gray-700">
                        Terminado
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Presupuesto: ${job.projects?.estimated_budget}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
                Ir al Espacio de Trabajo
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
