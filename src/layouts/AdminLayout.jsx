import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const navItems = [
  { to: "/admin", label: "📊 Dashboard" },
  { to: "/admin/students", label: "👨‍🎓 Students" },
  { to: "/admin/exams", label: "📝 Exams" },
  { to: "/admin/questions", label: "❓ Questions" },
  { to: "/admin/results", label: "📈 Results" },
  { to: "/admin/analytics", label: "🎯 Analytics" },
];

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50">

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static
        top-0 left-0
        z-50
        h-full
        w-72
        bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
        shadow-2xl
        transform
        transition-transform
        duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
      >
        {/* Logo */}
        <div className="bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <h1 className="text-2xl font-bold relative z-10 text-white">
            🚀 Online Exam
          </h1>
          <p className="text-cyan-100 text-sm mt-1 relative z-10">
            Admin Dashboard
          </p>
        </div>

        {/* Menu */}
        <nav className="mt-6 px-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `
                flex
                items-center
                px-4
                py-3
                rounded-xl
                font-medium
                transition-all
                duration-200
                ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-500/30"
                    : "text-gray-300 hover:bg-white/10 hover:text-white hover:shadow-lg"
                }
              `
              }
            >
              <span className="mr-3">{item.label.split(' ')[0]}</span>
              <span>{item.label.split(' ').slice(1).join(' ')}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-5 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl py-3 font-semibold transition-all duration-200 hover:scale-105 shadow-lg shadow-red-500/30"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="bg-white/90 backdrop-blur-sm shadow-lg px-6 py-4 flex items-center justify-between border-b-2 border-cyan-200/50">

          <div className="flex items-center gap-4">

            {/* Mobile Menu */}
            <button
              className="lg:hidden text-3xl hover:scale-110 transition-transform text-cyan-600"
              onClick={() => setOpen(true)}
            >
              ☰
            </button>

            <div>
              <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 bg-clip-text">
                Welcome Back! 👋
              </h2>
              <p className="text-gray-500 text-sm">
                {user?.name || "Administrator"}
              </p>
            </div>

          </div>

          {/* Profile */}
          <div className="flex items-center gap-4">

            <div className="text-right">
              <h3 className="font-semibold text-gray-800">
                {user?.name}
              </h3>
              <p className="text-sm text-cyan-600 font-medium">
                ⭐ Admin
              </p>
            </div>

            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-cyan-500/30 ring-2 ring-white">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

          </div>

        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-white/40 backdrop-blur-sm m-4 rounded-2xl shadow-lg border border-white/50">
          <Outlet />
        </main>

      </div>
    </div>
  );
}