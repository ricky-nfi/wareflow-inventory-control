
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Package, Plus, Filter } from 'lucide-react';
import { InventoryItem } from '@/types';

const mockInventoryItems: InventoryItem[] = [
  {
    id: '1',
    itemCode: 'ITM-001',
    name: 'Industrial Bearings',
    description: 'Heavy-duty ball bearings for machinery',
    category: 'Mechanical Parts',
    currentStock: 5,
    minStockLevel: 20,
    unitPrice: 45.99,
    location: 'A1-B2-C3',
    lastUpdated: '2024-01-15',
    method: 'FIFO'
  },
  {
    id: '2',
    itemCode: 'ITM-002',
    name: 'Steel Bolts M12',
    description: 'M12 x 50mm steel bolts',
    category: 'Fasteners',
    currentStock: 150,
    minStockLevel: 100,
    unitPrice: 0.85,
    location: 'B2-C1-D4',
    lastUpdated: '2024-01-14',
    method: 'FIFO'
  },
  {
    id: '3',
    itemCode: 'ITM-003',
    name: 'Safety Helmets',
    description: 'OSHA approved safety helmets',
    category: 'Safety Equipment',
    currentStock: 8,
    minStockLevel: 25,
    unitPrice: 25.50,
    location: 'C3-D2-E1',
    lastUpdated: '2024-01-13',
    method: 'FIFO'
  },
  {
    id: '4',
    itemCode: 'ITM-004',
    name: 'Work Gloves',
    description: 'Cut-resistant work gloves',
    category: 'Safety Equipment',
    currentStock: 22,
    minStockLevel: 30,
    unitPrice: 12.75,
    location: 'C3-D2-E2',
    lastUpdated: '2024-01-12',
    method: 'FIFO'
  },
  {
    id: '5',
    itemCode: 'ITM-005',
    name: 'Hydraulic Oil',
    description: 'High-performance hydraulic fluid',
    category: 'Fluids',
    currentStock: 45,
    minStockLevel: 20,
    unitPrice: 89.99,
    location: 'D1-E2-F3',
    lastUpdated: '2024-01-11',
    method: 'FEFO'
  }
];

export const InventoryList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState(mockInventoryItems);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = mockInventoryItems.filter(item =>
      item.name.toLowerCase().includes(term.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(term.toLowerCase()) ||
      item.category.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const getStockStatus = (current: number, min: number) => {
    if (current <= min * 0.5) return 'critical';
    if (current <= min) return 'low';
    return 'good';
  };

  const getStockBadge = (status: string) => {
    switch (status) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'low':
        return <Badge variant="secondary">Low Stock</Badge>;
      default:
        return <Badge variant="default">Good</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Inventory Management</h1>
          <p className="text-slate-600 mt-2">Track and manage your warehouse inventory</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Inventory Items
          </CardTitle>
          <CardDescription>Manage your warehouse inventory items</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search items by name, code, or category..."
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
                  <TableHead>Item Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Min Level</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => {
                  const stockStatus = getStockStatus(item.currentStock, item.minStockLevel);
                  return (
                    <TableRow key={item.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium">{item.itemCode}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-slate-600">{item.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <span className={stockStatus === 'critical' ? 'text-red-600 font-semibold' : 
                                       stockStatus === 'low' ? 'text-orange-600 font-semibold' : 'text-green-600'}>
                          {item.currentStock}
                        </span>
                      </TableCell>
                      <TableCell>{item.minStockLevel}</TableCell>
                      <TableCell>${item.unitPrice}</TableCell>
                      <TableCell>
                        <code className="bg-slate-100 px-2 py-1 rounded text-sm">{item.location}</code>
                      </TableCell>
                      <TableCell>{getStockBadge(stockStatus)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
