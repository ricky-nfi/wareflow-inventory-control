
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  Warehouse,
  Package,
  Truck,
  Users,
  ClipboardList,
  BarChart3,
  Settings,
  LogOut,
  Home,
  RotateCcw
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, permission: 'all' },
  { id: 'inventory', label: 'Inventory', icon: Package, permission: 'inventory' },
  { id: 'orders', label: 'Orders', icon: ClipboardList, permission: 'orders' },
  { id: 'workers', label: 'Workers', icon: Users, permission: 'workers' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, permission: 'reports' },
  { id: 'settings', label: 'Settings', icon: Settings, permission: 'all' },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const { user, logout, clearAllAndReload, hasPermission } = useAuth();

  const filteredMenuItems = menuItems.filter(item => 
    item.permission === 'all' || hasPermission(item.permission) || user?.role === 'admin'
  );

  return (
    <div className="h-full bg-slate-900 border-r border-slate-700 flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Warehouse className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-white font-semibold">WMS</h2>
            <p className="text-slate-400 text-sm">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={currentPage === item.id ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start text-left',
                currentPage === item.id
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              )}
              onClick={() => onPageChange(item.id)}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700 space-y-2">
        <div className="mb-3">
          <p className="text-sm text-slate-400">Signed in as</p>
          <p className="text-white font-medium">{user?.email}</p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
          onClick={logout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sign Out
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
          onClick={clearAllAndReload}
        >
          <RotateCcw className="mr-3 h-4 w-4" />
          Clear & Reload
        </Button>
      </div>
    </div>
  );
};
