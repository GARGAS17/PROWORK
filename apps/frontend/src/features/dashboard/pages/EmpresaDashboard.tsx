export const EmpresaDashboard = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
        Mis Proyectos
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-lg">
        Gestiona las ofertas que has publicado para buscar talento.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Placeholder cards */}
        {[1, 2].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-xl text-gray-900 dark:text-white">Oferta Activa {i}</h3>
              <span className="px-3 py-1 text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 rounded-full">
                Buscando Talento
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Descripción de la oferta de trabajo publicada por la empresa.
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-900 dark:text-white">
                Ver postulantes
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
