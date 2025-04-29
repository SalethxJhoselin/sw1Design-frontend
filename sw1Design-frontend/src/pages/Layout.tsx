import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';

const Layout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 🆕 Detectar si estoy en "/canvas"
  const isCanvasPage = location.pathname.startsWith('/canvas');

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div>
        <Navbar onToggleSidebar={isCanvasPage ? toggleSidebar : undefined} />
        <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />{/* Contenido Principal */}
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-y-auto mt-5">
            <Outlet />
          </main>
        </div>
      </div>

    </div>
  );
};

export default Layout;