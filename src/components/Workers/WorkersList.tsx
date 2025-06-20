
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Users, Plus, Filter, TrendingUp } from 'lucide-react';
import { Worker } from '@/types';

const mockWorkers: Worker[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@warehouse.com',
    position: 'Senior Warehouse Associate',
    performance: {
      ordersProcessed: 156,
      accuracy: 98.5,
      productivity: 95.2
    },
    isActive: true,
    shift: 'Morning (6AM-2PM)'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@warehouse.com',
    position: 'Warehouse Associate',
    performance: {
      ordersProcessed: 142,
      accuracy: 96.8,
      productivity: 88.7
    },
    isActive: true,
    shift: 'Afternoon (2PM-10PM)'
  },
  {
    id: '3',
    name: 'Mike Davis',
    email: 'mike.davis@warehouse.com',
    position: 'Forklift Operator',
    performance: {
      ordersProcessed: 89,
      accuracy: 99.1,
      productivity: 92.3
    },
    isActive: true,
    shift: 'Morning (6AM-2PM)'
  },
  {
    id: '4',
    name: 'Lisa Chen',
    email: 'lisa.chen@warehouse.com',
    position: 'Warehouse Associate',
    performance: {
      ordersProcessed: 134,
      accuracy: 97.2,
      productivity: 91.5
    },
    isActive: true,
    shift: 'Night (10PM-6AM)'
  },
  {
    id: '5',
    name: 'Robert Brown',
    email: 'robert.brown@warehouse.com',
    position: 'Team Lead',
    performance: {
      ordersProcessed: 98,
      accuracy: 98.9,
      productivity: 93.8
    },
    isActive: false,
    shift: 'Morning (6AM-2PM)'
  }
];

export const WorkersList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredWorkers, setFilteredWorkers] = useState(mockWorkers);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = mockWorkers.filter(worker =>
      worker.name.toLowerCase().includes(term.toLowerCase()) ||
      worker.email.toLowerCase().includes(term.toLowerCase()) ||
      worker.position.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredWorkers(filtered);
  };

  const getPerformanceScore = (performance: Worker['performance']) => {
    return ((performance.accuracy + performance.productivity) / 2).toFixed(1);
  };

  const getPerformanceBadge = (score: number) => {
    if (score >= 95) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (score >= 90) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
    if (score >= 80) return <Badge variant="secondary">Average</Badge>;
    return <Badge variant="destructive">Needs Improvement</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Worker Management</h1>
          <p className="text-slate-600 mt-2">Manage warehouse staff and performance</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Worker
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Workers</p>
                <p className="text-2xl font-bold">{mockWorkers.filter(w => w.isActive).length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Avg Performance</p>
                <p className="text-2xl font-bold">
                  {mockWorkers.reduce((acc, w) => acc + parseFloat(getPerformanceScore(w.performance)), 0) / mockWorkers.length}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Orders Processed</p>
                <p className="text-2xl font-bold">
                  {mockWorkers.reduce((acc, w) => acc + w.performance.ordersProcessed, 0)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Workers
          </CardTitle>
          <CardDescription>Manage warehouse workers and view performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search workers by name, email, or position..."
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
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead>Orders Processed</TableHead>
                  <TableHead>Accuracy</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkers.map((worker) => {
                  const performanceScore = parseFloat(getPerformanceScore(worker.performance));
                  return (
                    <TableRow key={worker.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div>
                          <p className="font-medium">{worker.name}</p>
                          <p className="text-sm text-slate-600">{worker.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{worker.position}</TableCell>
                      <TableCell>
                        <span className="text-sm bg-slate-100 px-2 py-1 rounded">
                          {worker.shift}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{worker.performance.ordersProcessed}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{worker.performance.accuracy}%</span>
                      </TableCell>
                      <TableCell>
                        {getPerformanceBadge(performanceScore)}
                        <p className="text-sm text-slate-600 mt-1">{performanceScore}%</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={worker.isActive ? 'default' : 'secondary'}>
                          {worker.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
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
