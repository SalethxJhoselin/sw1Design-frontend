import { useNavigate } from "react-router-dom";
import { menuItems } from "./menuItems";

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();  // Cierra el sidebar al navegar
  };

  return (
    <div
      className={`fixed top-16 left-0 w-64 h-[calc(100vh-64px)] bg-[#1e293b] text-white transform transition-transform duration-300 z-40 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4 border-b border-white/10 bg-[#334155]">
        <h2 className="text-xl font-bold text-center">Menú</h2>
      </div>

      <div className="p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => handleNavigation(item.path)}
            className="w-full text-left px-3 py-2 rounded hover:bg-[#475569] transition"
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="absolute bottom-0 w-full p-3 text-center text-xs bg-[#334155]">
        © {new Date().getFullYear()} Editor Visual
      </div>
    </div>
  );
};

export default Sidebar;
