import { MenuOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

const Navbar = ({ onToggleSidebar }: {
  onToggleSidebar: () => void;
}) => {


  return (
    <header className="fixed top-0 left-0 right-0 w-full py-3 px-6 flex justify-between items-center bg-white border-b border-gray-200 shadow-sm z-50">
        <Button
          type="text"
          icon={<MenuOutlined className="text-gray-600" />}
          onClick={onToggleSidebar}
          className="hover:bg-gray-100 rounded-lg p-2"
        />

      {/* Logo */}
      <div className="flex-1 text-center">
        <Link to="/" className="text-2xl font-semibold text-gray-800 tracking-tight hover:opacity-80 transition-opacity">
          design <span className="text-[#005BAA]"> Figm</span>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;