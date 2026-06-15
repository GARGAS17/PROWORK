export const AdminDashboard = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
        Visión Global
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-lg">
        Panel de control y curaduría global de la plataforma Prowork.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Usuarios</h3>
          <p className="text-3xl font-black text-gray-900 dark:text-white">1,204</p>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Proyectos Activos</h3>
          <p className="text-3xl font-black text-gray-900 dark:text-white">89</p>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Alertas Pendientes</h3>
          <p className="text-3xl font-black text-red-600 dark:text-red-400">3</p>
        </div>
      </div>
    </div>
  );
};
