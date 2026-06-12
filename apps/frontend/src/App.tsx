import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ========================================== */}
          {/* RUTAS PÚBLICAS */}
          {/* ========================================== */}
          <Route path="/" element={
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
              <h1 className="text-4xl font-bold mb-4">Bienvenido a Prowork</h1>
              <a href="/login" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">Iniciar Sesión</a>
            </div>
          } />
          <Route path="/login" element={<div className="p-10 text-2xl font-bold">Página de Login (No Protegida)</div>} />
          <Route path="/register" element={<div className="p-10 text-2xl font-bold">Página de Registro (No Protegida)</div>} />

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
