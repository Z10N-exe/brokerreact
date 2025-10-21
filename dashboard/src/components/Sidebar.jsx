import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  FileText, 
  Settings,
  Shield
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Overview' },
    { path: '/users', icon: Users, label: 'Users' },
    { path: '/deposits', icon: ArrowDownRight, label: 'Deposits' },
    { path: '/withdrawals', icon: ArrowUpRight, label: 'Withdrawals' },
    { path: '/logs', icon: FileText, label: 'Audit Logs' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 z-10">
      <div className="p-6">
        <div className="flex items-center mb-8">
          <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div className="ml-3">
            <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
            <p className="text-xs text-gray-500">Aspire Secure Trade</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-item ${
                  isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center">
            <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-green-700 font-medium">System Online</span>
          </div>
          <p className="text-xs text-green-600 mt-1">All systems operational</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
