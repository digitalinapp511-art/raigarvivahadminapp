function Navbar({ setSidebarOpen }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg bg-blue-500 px-3 py-2 text-white lg:hidden"
        >
          ☰
        </button>

        <h1 className="text-lg font-semibold text-gray-800">Admin Dashboard</h1>
      </div>

      <div className="text-sm text-gray-500">Welcome Admin</div>
    </header>
  );
}

export default Navbar;