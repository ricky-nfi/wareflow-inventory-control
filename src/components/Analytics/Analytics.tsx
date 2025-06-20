
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Package, Users, AlertTriangle } from 'lucide-react';

export const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Analytics & Reports</h1>
        <p className="text-slate-600 mt-2">Comprehensive insights into warehouse operations</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Inventory Turnover</p>
                <p className="text-2xl font-bold text-blue-900">4.2x</p>
                <p className="text-xs text-blue-600 mt-1">+12% from last quarter</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Order Fulfillment</p>
                <p className="text-2xl font-bold text-green-900">97.8%</p>
                <p className="text-xs text-green-600 mt-1">+2.1% from last month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Worker Efficiency</p>
                <p className="text-2xl font-bold text-purple-900">94.2%</p>
                <p className="text-xs text-purple-600 mt-1">+5.7% from last month</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Error Rate</p>
                <p className="text-2xl font-bold text-orange-900">1.8%</p>
                <p className="text-xs text-orange-600 mt-1">-0.3% from last month</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Inventory Levels Trend
            </CardTitle>
            <CardDescription>Stock levels over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">Chart visualization would be implemented here</p>
                <p className="text-sm text-slate-500">Using Recharts library</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Order Processing Performance
            </CardTitle>
            <CardDescription>Daily order processing metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">Line chart showing order trends</p>
                <p className="text-sm text-slate-500">Real-time performance data</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Section */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
          <CardDescription>Download detailed reports for analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
              <h3 className="font-semibold mb-2">Inventory Report</h3>
              <p className="text-sm text-slate-600 mb-3">Detailed inventory levels and movements</p>
              <button className="text-blue-600 text-sm hover:text-blue-800">Download CSV</button>
            </div>
            <div className="p-4 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
              <h3 className="font-semibold mb-2">Worker Performance</h3>
              <p className="text-sm text-slate-600 mb-3">Individual and team performance metrics</p>
              <button className="text-blue-600 text-sm hover:text-blue-800">Download CSV</button>
            </div>
            <div className="p-4 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
              <h3 className="font-semibold mb-2">Order Summary</h3>
              <p className="text-sm text-slate-600 mb-3">Order processing and fulfillment data</p>
              <button className="text-blue-600 text-sm hover:text-blue-800">Download CSV</button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
