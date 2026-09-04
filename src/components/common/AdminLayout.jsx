import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
    },
    {
      name: "Courses",
      path: "/admin/courses",
    },
    {
      name: "Instructors",
      path: "/admin/instructors",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="hidden w-64 flex-col bg-gray-900 text-white md:flex">

        <div className="border-b border-gray-700 p-6">
          <h1 className="text-xl font-bold">
            Lecture Scheduler
          </h1>

          <p className="mt-1 text-sm text-gray-400">
            Admin Panel
          </p>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-3 transition ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="border-t border-gray-700 p-4">
          <div className="mb-4">
            <p className="font-medium">
              {user?.firstname} {user?.lastname}
            </p>

            <p className="text-sm text-gray-400">
              {user?.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full rounded-lg bg-red-500 px-4 py-2 font-medium transition hover:bg-red-600"
          >
            Logout
          </button>
        </div>

      </aside>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

    </div>
  );
};

export default AdminLayout;