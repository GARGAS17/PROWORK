export const FreelancerDashboard = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
        Mi Feed
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-lg">
        Aquí verás los proyectos que encajan con tu perfil.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder cards */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center mb-4">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">P{i}</span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Proyecto de Prueba {i}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              Esta es una descripción temporal para visualizar la estructura del feed de trabajo.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
