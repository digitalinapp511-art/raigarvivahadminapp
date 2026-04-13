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
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-gray-900 text-white transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h2 className="text-xl font-bold">Admin Panel</h2>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-2xl"
          >
            ✕
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menu.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`block rounded-lg px-4 py-3 transition ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-gray-200 hover:bg-gray-800"
                }`}
              >
                {item.name}
              </Link>
            );
          })}

          <button
            onClick={() => {
              localStorage.removeItem("currentUser");
              window.location.href = "/";
            }}
            className="w-full rounded-lg bg-red-500 px-4 py-3 text-left text-white hover:bg-red-600"
          >
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;