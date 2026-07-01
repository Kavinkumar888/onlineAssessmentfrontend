import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import AdminLayout from './layouts/AdminLayout';
import StudentLayout from './layouts/StudentLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentManagement from './pages/admin/StudentManagement';
import ExamManagement from './pages/admin/ExamManagement';
import QuestionManagement from './pages/admin/QuestionManagement';
import ResultsPage from './pages/admin/ResultsPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import StudentDashboard from './pages/student/StudentDashboard';
import AvailableExamsPage from './pages/student/AvailableExamsPage';
import ResultsPageStudent from './pages/student/ResultsPageStudent';
import ExamTakingPage from './pages/student/ExamTakingPage';
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace /> : <LoginPage />} />
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="students" element={<StudentManagement />} />
          <Route path="exams" element={<ExamManagement />} />
          <Route path="questions" element={<QuestionManagement />} />
          <Route path="results" element={<ResultsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>
        <Route path="/student" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
          <Route index element={<StudentDashboard />} />
          <Route path="exams" element={<AvailableExamsPage />} />
          <Route path="results" element={<ResultsPageStudent />} />
          <Route path="take/:examId" element={<ExamTakingPage />} />
        </Route>
        <Route path="*" element={<Navigate to={user?.role === 'admin' ? '/admin' : '/student'} replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
