
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Users, Filter, TrendingUp } from 'lucide-react';
import { AddWorkerModal } from './AddWorkerModal';
import { useWorkers } from '@/hooks/useWorkers';

export const WorkersList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { workers, isLoading } = useWorkers();

  const filteredWorkers = workers.filter(worker =>
    worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPerformanceScore = (accuracy: number, productivity: number) => {
    return ((accuracy + productivity) / 2).toFixed(1);
  };

  const getPerformanceBadge = (score: number) => {
    if (score >= 95) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (score >= 90) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
    if (score >= 80) return <Badge variant="secondary">Average</Badge>;
    return <Badge variant="destructive">Needs Improvement</Badge>;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Worker Management</h1>
            <p className="text-slate-600 mt-2">Loading workers...</p>
          </div>
        </div>
      </div>
    );
  }

  const activeWorkers = workers.filter(w => w.is_active);
  const avgPerformance = workers.length > 0 
    ? workers.reduce((acc, w) => acc + parseFloat(getPerformanceScore(w.accuracy, w.productivity)), 0) / workers.length 
    : 0;
  const totalOrdersProcessed = workers.reduce((acc, w) => acc + w.orders_processed, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Worker Management</h1>
          <p className="text-slate-600 mt-2">Manage warehouse staff and performance</p>
        </div>
        <AddWorkerModal />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Workers</p>
                <p className="text-2xl font-bold">{activeWorkers.length}</p>
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
                <p className="text-2xl font-bold">{avgPerformance.toFixed(1)}%</p>
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
                <p className="text-2xl font-bold">{totalOrdersProcessed}</p>
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
                  const performanceScore = parseFloat(getPerformanceScore(worker.accuracy, worker.productivity));
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
                        {worker.shift && (
                          <span className="text-sm bg-slate-100 px-2 py-1 rounded">
                            {worker.shift}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{worker.orders_processed}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{worker.accuracy}%</span>
                      </TableCell>
                      <TableCell>
                        {getPerformanceBadge(performanceScore)}
                        <p className="text-sm text-slate-600 mt-1">{performanceScore}%</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={worker.is_active ? 'default' : 'secondary'}>
                          {worker.is_active ? 'Active' : 'Inactive'}
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
