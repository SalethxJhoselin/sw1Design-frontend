import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar
        onToggleSidebar={toggleSidebar}
      />

      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

        {/* Contenido Principal */}
        <div className="flex-1 flex flex-col">
          <main className="p-6 flex-1 overflow-y-auto mt-16">
            <Outlet />
          </main>
        </div>
      </div>

    </div>
  );
};

export default Layout;