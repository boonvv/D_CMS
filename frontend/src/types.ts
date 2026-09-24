import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import SignupPage from './pages/SignupPage';
import { User } from './types';
import { graphqlRequest } from './api';

const meQuery = `
  query Me {
    me {
      id
      email
      username
    }
  }
`;

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('workspace_token');
    if (!token) {
      setLoading(false);
      return;
    }

    graphqlRequest<{ me: User }>(meQuery, {}, token)
      .then((data) => setUser(data.me))
      .catch(() => {
        localStorage.removeItem('workspace_token');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('workspace_token');
    setUser(null);
  };

  if (loading) {
    return <div className="app-shell loading-screen">Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <DashboardPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/projects/:projectId"
        element={user ? <ProjectDetailPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
      />
      <Route path="/login" element={<LoginPage onLogin={setUser} />} />
      <Route path="/signup" element={<SignupPage onLogin={setUser} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
