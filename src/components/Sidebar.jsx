import { Link, useLocation } from "react-router-dom";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Users", path: "/users" },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-gray-900 text-white transform transition-transform duration-300 flex flex-col
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        {/* TOP */}
        <div className="px-5 py-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold">Admin Panel</h2>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-2xl"
          >
            ✕
          </button>
        </div>

        {/* MENU (flex-1 push karta hai logout ko niche) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {menu.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`block px-4 py-3 rounded-lg transition ${
                  active
                    ? "bg-blue-600"
                    : "hover:bg-gray-800 text-gray-200"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* 🔥 LOGOUT (BOTTOM FIXED) */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => {
              localStorage.removeItem("currentUser");
              window.location.href = "/";
            }}
            className="w-full bg-red-500 py-3 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;