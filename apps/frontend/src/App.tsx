import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import { LandingPage } from './features/landing/pages/LandingPage';

import { DashboardLayout } from './features/dashboard/layout/DashboardLayout';
import { FreelancerDashboard } from './features/dashboard/pages/FreelancerDashboard';
import { EmpresaDashboard } from './features/dashboard/pages/EmpresaDashboard';
import { AdminDashboard } from './features/dashboard/pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ========================================== */}
          {/* RUTAS PÚBLICAS */}
          {/* ========================================== */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Navigate to="/#auth" replace />} />
          <Route path="/register" element={<Navigate to="/#auth" replace />} />

          {/* ========================================== */}
          {/* RUTAS FREELANCER */}
          {/* ========================================== */}
          <Route element={<ProtectedRoute allowedRoles={['freelancer']} />}>
            <Route path="/freelancer" element={<DashboardLayout />}>
              <Route index element={<FreelancerDashboard />} />
              <Route path="postulaciones" element={<div className="p-10 text-2xl font-bold dark:text-white">Mis Postulaciones</div>} />
              <Route path="settings" element={<div className="p-10 text-2xl font-bold dark:text-white">Configuración</div>} />
            </Route>
          </Route>

          {/* ========================================== */}
          {/* RUTAS EMPRESA */}
          {/* ========================================== */}
          <Route element={<ProtectedRoute allowedRoles={['empresa']} />}>
            <Route path="/empresa" element={<DashboardLayout />}>
              <Route index element={<EmpresaDashboard />} />
              <Route path="crear" element={<div className="p-10 text-2xl font-bold dark:text-white">Crear Nueva Oferta</div>} />
              <Route path="talento" element={<div className="p-10 text-2xl font-bold dark:text-white">Talento Guardado</div>} />
              <Route path="settings" element={<div className="p-10 text-2xl font-bold dark:text-white">Configuración</div>} />
            </Route>
          </Route>

          {/* ========================================== */}
          {/* RUTAS ADMINISTRADOR */}
          {/* ========================================== */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<DashboardLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="proyectos" element={<div className="p-10 text-2xl font-bold dark:text-white">Curaduría de Proyectos</div>} />
              <Route path="usuarios" element={<div className="p-10 text-2xl font-bold dark:text-white">Gestión de Usuarios</div>} />
              <Route path="alertas" element={<div className="p-10 text-2xl font-bold dark:text-white">Reportes y Alertas</div>} />
            </Route>
          </Route>

          {/* Fallback de error 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
