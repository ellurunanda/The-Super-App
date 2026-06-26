import { Navigate, Route, Routes } from 'react-router-dom';
import Register from '../pages/Register';
import Login from '../pages/Login';
import Categories from '../pages/Categories';
import Dashboard from '../pages/Dashboard';
import Movies from '../pages/Movies';
import { useStore } from '../store/useStore';

function ProtectedRoute({ children, requiresCategories = false }) {
  const isRegistered = useStore((state) => state.isRegistered);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const hasCategories = useStore((state) => state.categories.length >= 3);

  if (!isRegistered) {
    return <Navigate to="/" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiresCategories && !hasCategories) {
    return <Navigate to="/categories" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute requiresCategories><Dashboard /></ProtectedRoute>} />
      <Route path="/movies" element={<ProtectedRoute requiresCategories><Movies /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}