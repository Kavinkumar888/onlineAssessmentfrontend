import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/student', label: 'Dashboard' },
  { to: '/student/exams', label: 'Available Exams' },
  { to: '/student/results', label: 'Results' }
];

export default function StudentLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h3>Student Portal</h3>
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>{item.label}</NavLink>
        ))}
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </aside>
      <main className="content-area">
        <header className="topbar">
          <div>
            <h2>Welcome, {user?.name}</h2>
            <p>Take your exams securely</p>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
