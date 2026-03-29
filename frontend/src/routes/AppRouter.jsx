import { Navigate, Route, Routes } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from '../shared/contexts/auth-context';
import AdminLayout      from '../components/layout/AdminLayout';
import LoginPage        from '../pages/LoginPage';
import AuthCallbackPage from '../pages/AuthCallbackPage';
import ProjectsPage     from '../modules/projects/pages/ProjectsPage';
import BlogPage         from '../modules/blog/pages/BlogPage';
import AnalyticsPage    from '../pages/AnalyticsPage';
import AccountPage      from '../pages/AccountPage';
import PersonnelPage    from '../pages/PersonnelPage';
import { ROUTES }       from '../shared/constants/routes';

// Guard: redirect to login if not authenticated
function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#f4f6fb',
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return isLoggedIn ? children : <Navigate to={ROUTES.LOGIN} replace />;
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      {/* Protected — all inside AdminLayout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to={ROUTES.PROJECTS} replace />} />
        <Route path={ROUTES.PROJECTS}  element={<ProjectsPage />} />
        <Route path={ROUTES.BLOG}      element={<BlogPage />} />
        <Route path={ROUTES.ANALYTICS} element={<AnalyticsPage />} />
        <Route path={ROUTES.ACCOUNT}   element={<AccountPage />} />
        <Route path={ROUTES.PERSONNEL} element={<PersonnelPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  );
}
