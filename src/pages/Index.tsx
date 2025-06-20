
import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/LoginForm';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Dashboard } from '@/components/Dashboard/Dashboard';
import { InventoryList } from '@/components/Inventory/InventoryList';
import { OrdersList } from '@/components/Orders/OrdersList';
import { WorkersList } from '@/components/Workers/WorkersList';
import { Analytics } from '@/components/Analytics/Analytics';
import { Settings } from '@/components/Settings/Settings';

const WMSApp: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!user) {
    return <LoginForm />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <InventoryList />;
      case 'orders':
        return <OrdersList />;
      case 'workers':
        return <WorkersList />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <div className="w-64 flex-shrink-0">
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderCurrentPage()}
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <WMSApp />
    </AuthProvider>
  );
};

export default Index;
