import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Loader2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Project {
  id: string;
  title: string;
  description: string;
  estimated_budget: number;
  status: string;
  technologies: string[];
  currency?: string;
}

export const EmpresaDashboard = () => {
  const { token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/projects/mis-proyectos', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const json = await res.json();
        
        if (!res.ok) throw new Error(json.error || 'Error al cargar los proyectos');
        
        setProjects(json.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [token]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Mis Proyectos
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Gestiona las ofertas que has publicado para buscar talento.
          </p>
        </div>
        
        <Link 
          to="/empresa/crear"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Nueva Oferta
        </Link>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-500/10 border-l-4 border-red-500 p-4 rounded-md">
          <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-12 text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Aún no tienes proyectos publicados</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Empieza publicando tu primera oferta para encontrar talento de élite.</p>
          <Link 
            to="/empresa/crear"
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-6 py-3 rounded-xl font-bold transition-all"
          >
            Publicar mi primer proyecto
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-xl text-gray-900 dark:text-white">{project.title}</h3>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                  project.status === 'abierto' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300' :
                  project.status === 'en_progreso' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300' :
                  'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}>
                  {project.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies?.map(tech => (
                  <span key={tech} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-md">
                    {tech}
                  </span>
                ))}
              </div>

              <p className="text-gray-500 dark:text-gray-400 mb-6 flex-1 line-clamp-3">
                {project.description}
              </p>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800">
                <span className="font-black text-gray-900 dark:text-white">
                  ${project.estimated_budget} <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{project.currency || 'USD'}</span>
                </span>
                {project.status === 'in_progress' || project.status === 'completed' || project.status === 'asignado' || project.status === 'en_progreso' ? (
                  <Link 
                    to={`/empresa/proyecto/${project.id}/workspace`}
                    className="px-4 py-2 bg-indigo-100 dark:bg-indigo-500/20 hover:bg-indigo-200 dark:hover:bg-indigo-500/30 text-indigo-700 dark:text-indigo-400 rounded-lg text-sm font-bold transition-colors"
                  >
                    Espacio de Trabajo
                  </Link>
                ) : (
                  <Link 
                    to={`/empresa/proyecto/${project.id}/postulantes`}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-bold transition-colors"
                  >
                    Ver postulantes
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
