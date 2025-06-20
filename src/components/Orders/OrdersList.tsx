
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, ClipboardList, Plus, Filter, Truck } from 'lucide-react';
import { Order } from '@/types';

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    type: 'inbound',
    status: 'processing',
    items: [
      { itemId: '1', itemCode: 'ITM-001', itemName: 'Industrial Bearings', quantity: 20, unitPrice: 45.99 },
      { itemId: '2', itemCode: 'ITM-002', itemName: 'Steel Bolts M12', quantity: 100, unitPrice: 0.85 }
    ],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T11:00:00Z',
    assignedWorker: 'John Smith'
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    type: 'outbound',
    status: 'pending',
    items: [
      { itemId: '3', itemCode: 'ITM-003', itemName: 'Safety Helmets', quantity: 15, unitPrice: 25.50 }
    ],
    createdAt: '2024-01-15T09:15:00Z',
    updatedAt: '2024-01-15T09:15:00Z',
    assignedWorker: 'Sarah Johnson'
  },
  {
    id: '3',
    orderNumber: 'ORD-003',
    type: 'inbound',
    status: 'completed',
    items: [
      { itemId: '4', itemCode: 'ITM-004', itemName: 'Work Gloves', quantity: 50, unitPrice: 12.75 },
      { itemId: '5', itemCode: 'ITM-005', itemName: 'Hydraulic Oil', quantity: 10, unitPrice: 89.99 }
    ],
    createdAt: '2024-01-14T16:45:00Z',
    updatedAt: '2024-01-15T08:30:00Z',
    assignedWorker: 'Mike Davis'
  }
];

export const OrdersList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState(mockOrders);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = mockOrders.filter(order =>
      order.orderNumber.toLowerCase().includes(term.toLowerCase()) ||
      order.assignedWorker?.toLowerCase().includes(term.toLowerCase()) ||
      order.type.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

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

  const calculateOrderValue = (items: Order['items']) => {
    return items.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Order Management</h1>
          <p className="text-slate-600 mt-2">Track and process warehouse orders</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Create Order
        </Button>
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
                onChange={(e) => handleSearch(e.target.value)}
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
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>{getTypeBadge(order.type)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.items.length} items</p>
                        <p className="text-sm text-slate-600">
                          {order.items.slice(0, 2).map(item => item.itemName).join(', ')}
                          {order.items.length > 2 && '...'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        ${calculateOrderValue(order.items).toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>{order.assignedWorker}</TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
