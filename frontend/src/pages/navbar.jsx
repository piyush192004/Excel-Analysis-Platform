import React from "react";

function Navbar() {
  return (
    <nav className="bg-blue-700 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold">Excel Analytics</div>
        <div className="space-x-6">
          <a href="/dashboard" className="hover:text-blue-200 transition">
            Dashboard
          </a>
          <a href="/login" className="hover:text-blue-200 transition">
            Login
          </a>
          <a href="/register" className="hover:text-blue-200 transition">
            Register
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
