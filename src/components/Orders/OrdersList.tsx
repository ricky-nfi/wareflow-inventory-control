
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, ClipboardList, Filter, Truck } from 'lucide-react';
import { CreateOrderModal } from './CreateOrderModal';
import { usePrismaOrders } from '@/hooks/usePrismaOrders';

export const OrdersList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { orders, isLoading, error } = usePrismaOrders();

  const filteredOrders = orders.filter(order =>
    order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.workers?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'processing':
        return <Badge variant="default">Processing</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    return type === 'inbound' ? (
      <Badge variant="outline" className="text-blue-600 border-blue-600">
        <Truck className="mr-1 h-3 w-3" />
        Inbound
      </Badge>
    ) : (
      <Badge variant="outline" className="text-orange-600 border-orange-600">
        <Truck className="mr-1 h-3 w-3" />
        Outbound
      </Badge>
    );
  };

  const calculateOrderValue = (items: any[]) => {
    return items.reduce((total, item) => total + (item.quantity * item.unit_price), 0);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg text-red-600">Error loading orders: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Order Management</h1>
          <p className="text-slate-600 mt-2">Track and process warehouse orders</p>
        </div>
        <CreateOrderModal />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ClipboardList className="mr-2 h-5 w-5" />
            Orders
          </CardTitle>
          <CardDescription>Manage inbound and outbound orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search orders by number, worker, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Number</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Assigned Worker</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-slate-500 py-8">
                      No orders found. Create your first order to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium">{order.order_number}</TableCell>
                      <TableCell>{getTypeBadge(order.type)}</TableCell>
                      <TableCell>{getStatusBadge(order.status || 'pending')}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.order_items?.length || 0} items</p>
                          <p className="text-sm text-slate-600">
                            {order.order_items?.slice(0, 2).map(item => 
                              item.inventory_items?.name || `Item ${item.item_id}`
                            ).join(', ')}
                            {(order.order_items?.length || 0) > 2 && '...'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          ${calculateOrderValue(order.order_items || []).toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>{order.workers?.name || 'Unassigned'}</TableCell>
                      <TableCell>
                        {new Date(order.created_at || '').toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
