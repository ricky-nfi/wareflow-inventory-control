
import React from 'react';
import { StatsCard } from './StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Truck, Users, BarChart3, AlertTriangle } from 'lucide-react';

const mockStats = {
  totalItems: 1247,
  lowStockItems: 23,
  pendingOrders: 45,
  activeWorkers: 18,
  totalValue: 2847392
};

const mockLowStockItems = [
  { id: '1', name: 'Industrial Bearings', currentStock: 5, minStock: 20, urgency: 'high' },
  { id: '2', name: 'Steel Bolts M12', currentStock: 15, minStock: 50, urgency: 'medium' },
  { id: '3', name: 'Safety Helmets', currentStock: 8, minStock: 25, urgency: 'high' },
  { id: '4', name: 'Work Gloves', currentStock: 22, minStock: 30, urgency: 'low' },
];

const mockRecentOrders = [
  { id: 'ORD-001', type: 'Inbound', status: 'Processing', items: 24, worker: 'John Smith' },
  { id: 'ORD-002', type: 'Outbound', status: 'Pending', items: 12, worker: 'Sarah Johnson' },
  { id: 'ORD-003', type: 'Inbound', status: 'Completed', items: 36, worker: 'Mike Davis' },
  { id: 'ORD-004', type: 'Outbound', status: 'Processing', items: 8, worker: 'Lisa Chen' },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">Welcome back! Here's what's happening in your warehouse.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Items"
          value={mockStats.totalItems.toLocaleString()}
          icon={Package}
          trend={{ value: 5.2, isPositive: true }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
        />
        <StatsCard
          title="Low Stock Alerts"
          value={mockStats.lowStockItems}
          icon={AlertTriangle}
          trend={{ value: -2.1, isPositive: false }}
          className="bg-gradient-to-br from-red-50 to-red-100 border-red-200"
        />
        <StatsCard
          title="Pending Orders"
          value={mockStats.pendingOrders}
          icon={Truck}
          trend={{ value: 8.4, isPositive: true }}
          className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
        />
        <StatsCard
          title="Active Workers"
          value={mockStats.activeWorkers}
          icon={Users}
          className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
              Low Stock Alerts
            </CardTitle>
            <CardDescription>Items that need restocking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockLowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-600">Current: {item.currentStock} | Min: {item.minStock}</p>
                  </div>
                  <Badge 
                    variant={item.urgency === 'high' ? 'destructive' : item.urgency === 'medium' ? 'default' : 'secondary'}
                  >
                    {item.urgency}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="mr-2 h-5 w-5 text-blue-500" />
              Recent Orders
            </CardTitle>
            <CardDescription>Latest order activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockRecentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">{order.id}</p>
                    <p className="text-sm text-slate-600">{order.items} items • {order.worker}</p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={order.type === 'Inbound' ? 'default' : 'secondary'}
                      className="mb-1"
                    >
                      {order.type}
                    </Badge>
                    <p className="text-xs text-slate-600">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warehouse Value Card */}
      <Card className="bg-gradient-to-r from-slate-900 to-blue-900 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Total Warehouse Value</h3>
              <p className="text-3xl font-bold">${mockStats.totalValue.toLocaleString()}</p>
              <p className="text-blue-200 mt-1">Across all inventory items</p>
            </div>
            <BarChart3 className="h-12 w-12 text-blue-300" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
