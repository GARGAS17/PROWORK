import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Loader2 } from 'lucide-react';
import { ProjectDetailsModal, type Project } from '../../projects/components/ProjectDetailsModal';

export const FreelancerDashboard = () => {
  const { token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/projects/feed', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const json = await res.json();
        
        if (!res.ok) throw new Error(json.error || 'Error al cargar el muro de proyectos');
        
        setProjects(json.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
  }, [token]);

  const handleApplied = () => {
    setSuccessMessage('¡Postulación enviada con éxito! La empresa revisará tu perfil pronto.');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          Muro de Oportunidades
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Explora los proyectos recientes y postúlate a los que encajen con tus habilidades.
        </p>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 dark:bg-emerald-500/10 border-l-4 border-emerald-500 p-4 rounded-xl animate-in slide-in-from-top-2">
          <p className="text-emerald-700 dark:text-emerald-400 font-bold">{successMessage}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-500/10 border-l-4 border-red-500 p-4 rounded-xl">
          <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-12 text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No hay proyectos disponibles</h3>
          <p className="text-gray-500 dark:text-gray-400">Vuelve más tarde para descubrir nuevas ofertas de las empresas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer" onClick={() => setSelectedProject(project)}>
              
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 text-[10px] font-black tracking-wider bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 rounded-full uppercase">
                  Nuevo
                </span>
                <span className="font-black text-gray-900 dark:text-white text-lg">
                  ${project.estimated_budget} <span className="text-xs font-medium text-gray-500">{project.currency || 'USD'}</span>
                </span>
              </div>

              <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                {project.title}
              </h3>
              
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.technologies?.slice(0, 3).map(tech => (
                  <span key={tech} className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-lg">
                    {tech}
                  </span>
                ))}
                {project.technologies?.length > 3 && (
                  <span className="px-2.5 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-500 text-xs font-bold rounded-lg">
                    +{project.technologies.length - 3}
                  </span>
                )}
              </div>

              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 flex-1 line-clamp-3 leading-relaxed">
                {project.description}
              </p>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedProject(project);
                }}
                className="w-full py-3 px-4 font-bold rounded-xl text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white transition-colors"
              >
                Ver Proyecto
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Postulación */}
      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          onApplied={handleApplied}
        />
      )}
    </div>
  );
};
