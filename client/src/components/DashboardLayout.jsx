
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const DashboardLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const adminLinks = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Reports", path: "/reports", icon: "📈" },
    { name: "Attendance", path: "/attendance", icon: "📅" },
    { name: "Trainers", path: "/trainers", icon: "👨‍🏫" },
    { name: "Membership Plans", path: "/membership-plans", icon: "💳" },
    { name: "Payment History", path: "/payment-history", icon: "💰" },
  ];

  const memberLinks = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "My Progress", path: "/progress", icon: "📈" },
    { name: "My Attendance", path: "/my-attendance", icon: "📅" },
    { name: "My Workouts", path: "/workouts", icon: "🏋️" },
    { name: "Diet Plans", path: "/diet-plans", icon: "🥗" },
    { name: "Payment History", path: "/payment-history", icon: "💰" },
    { name: "Membership Plans", path: "/membership-plans", icon: "💳" },
  ];

  const links = role === "admin" ? adminLinks : memberLinks;

  const linkStyle = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
      isActive
        ? "bg-cyan-400 text-black font-bold"
        : "text-zinc-300 hover:bg-zinc-800 hover:text-cyan-400"
    }`;

  return (
    <div className="min-h-screen flex bg-zinc-950 text-white">

      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800 p-5 transform transition-transform duration-300 md:static md:translate-x-0 md:shrink-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h2 className="text-xl font-extrabold mb-8 tracking-wider">
          FIT<span className="text-cyan-400">ZONE</span>
        </h2>

        <p className="text-xs uppercase text-zinc-500 font-bold mb-4">
          {role === "admin" ? "Admin Menu" : "Member Menu"}
        </p>

        <nav className="space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={linkStyle}
            >
              <span>{link.icon}</span>
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            navigate("/login");
            window.location.reload();
          }}
          className="w-full mt-8 bg-red-500 hover:bg-red-400 text-white py-3 rounded-lg font-bold"
        >
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 min-w-0 p-4 md:p-6">

        {/* MOBILE HEADER */}
        <div className="flex items-center gap-4 mb-6 md:hidden">
          <button
            onClick={() => setIsOpen(true)}
            className="text-white text-3xl"
          >
            ☰
          </button>

          <h2 className="font-bold text-lg">
            FIT<span className="text-cyan-400">ZONE</span>
          </h2>
        </div>

        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
