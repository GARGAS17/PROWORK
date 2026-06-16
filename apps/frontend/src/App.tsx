import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import { LandingPage } from './features/landing/pages/LandingPage';

import { DashboardLayout } from './features/dashboard/layout/DashboardLayout';
import { FreelancerDashboard } from './features/dashboard/pages/FreelancerDashboard';
import { EmpresaDashboard } from './features/dashboard/pages/EmpresaDashboard';
import { AdminDashboard } from './features/dashboard/pages/AdminDashboard';
import { AdminPaymentsPage } from './features/dashboard/pages/AdminPaymentsPage';
import { CreateProjectPage } from './features/projects/pages/CreateProjectPage';
import { ProjectApplicationsPage } from './features/projects/pages/ProjectApplicationsPage';

import { FreelancerSettingsPage } from './features/dashboard/pages/FreelancerSettingsPage';
import { WorkspaceFreelancerPage } from './features/projects/pages/WorkspaceFreelancerPage';
import { WorkspaceEmpresaPage } from './features/projects/pages/WorkspaceEmpresaPage';
import { FreelancerJobsPage } from './features/projects/pages/FreelancerJobsPage';
import { MisPostulacionesPage } from './features/projects/pages/MisPostulacionesPage';
import { WalletFreelancerPage } from './features/projects/pages/WalletFreelancerPage';
import { WalletEmpresaPage } from './features/projects/pages/WalletEmpresaPage';

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
              <Route path="postulaciones" element={<MisPostulacionesPage />} />
              <Route path="trabajos" element={<FreelancerJobsPage />} />
              <Route path="workspace/:id" element={<WorkspaceFreelancerPage />} />
              <Route path="billetera" element={<WalletFreelancerPage />} />
              <Route path="settings" element={<FreelancerSettingsPage />} />
            </Route>
          </Route>

          {/* ========================================== */}
          {/* RUTAS EMPRESA */}
          {/* ========================================== */}
          <Route element={<ProtectedRoute allowedRoles={['empresa']} />}>
            <Route path="/empresa" element={<DashboardLayout />}>
              <Route index element={<EmpresaDashboard />} />
              <Route path="crear" element={<CreateProjectPage />} />
              <Route path="proyecto/:id/postulantes" element={<ProjectApplicationsPage />} />
              <Route path="proyecto/:id/workspace" element={<WorkspaceEmpresaPage />} />
              <Route path="billetera" element={<WalletEmpresaPage />} />
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
              <Route path="pagos" element={<AdminPaymentsPage />} />
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
