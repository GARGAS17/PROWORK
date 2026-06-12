import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import { LandingPage } from './features/landing/pages/LandingPage';

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
            <Route path="/feed" element={<div className="p-10 text-2xl text-green-700 font-bold">Feed de Proyectos (Freelancer)</div>} />
            <Route path="/mis-postulaciones" element={<div className="p-10 text-2xl text-green-700 font-bold">Mis Postulaciones</div>} />
          </Route>

          {/* ========================================== */}
          {/* RUTAS EMPRESA */}
          {/* ========================================== */}
          <Route element={<ProtectedRoute allowedRoles={['empresa']} />}>
            <Route path="/mis-proyectos" element={<div className="p-10 text-2xl text-indigo-700 font-bold">Mis Ofertas Publicadas (Empresa)</div>} />
            <Route path="/crear-proyecto" element={<div className="p-10 text-2xl text-indigo-700 font-bold">Crear Nueva Oferta</div>} />
          </Route>

          {/* ========================================== */}
          {/* RUTAS ADMINISTRADOR */}
          {/* ========================================== */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<div className="p-10 text-2xl text-red-600 font-bold">Panel de Curaduría Global (Admin)</div>} />
          </Route>

          {/* Fallback de error 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
