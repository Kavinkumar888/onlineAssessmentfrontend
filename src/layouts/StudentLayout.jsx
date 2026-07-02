import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/student", label: "🏠 Dashboard" },
  { to: "/student/exams", label: "📝 Available Exams" },
  { to: "/student/results", label: "📊 Results" },
];

export default function StudentLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">

      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-blue-900 via-sky-800 to-cyan-900 text-black flex flex-col shadow-2xl">

        {/* Logo */}
        <div className="p-6 border-b border-white/20">
          <h2 className="text-3xl font-bold">🎓 Student Portal</h2>
          <p className="text-blue-100 mt-2 text-sm">
            Online Examination System
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-5 space-y-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/student"}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-white text-blue-700 shadow-lg"
                    : "hover:bg-white/20 hover:translate-x-2"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-5">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Topbar */}
        <header className="bg-white shadow-md px-8 py-5 flex justify-between items-center">

          <div>
            <h1 className="text-3xl font-bold text-blue-700">
              Welcome, {user?.name} 👋
            </h1>
            <p className="text-gray-500 mt-1">
              Best of luck for your exams.
            </p>
          </div>

          <div className="flex items-center gap-4">

            <div className="text-right">
              <h3 className="font-semibold text-gray-800">
                {user?.name}
              </h3>
              <p className="text-blue-600 text-sm">
                Student
              </p>
            </div>

            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="bg-white rounded-3xl shadow-xl p-6 min-h-full">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}