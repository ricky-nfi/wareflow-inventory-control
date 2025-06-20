
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Settings as SettingsIcon, Database, Bell, Users, Shield } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-2">Configure your warehouse management system</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Database Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Database Configuration
            </CardTitle>
            <CardDescription>Configure database connection settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="db-type">Database Type</Label>
              <Select defaultValue="postgresql">
                <SelectTrigger>
                  <SelectValue placeholder="Select database type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="postgresql">PostgreSQL</SelectItem>
                  <SelectItem value="mysql">MySQL</SelectItem>
                  <SelectItem value="sqlite">SQLite</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="db-host">Database Host</Label>
              <Input id="db-host" placeholder="localhost" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="db-port">Port</Label>
              <Input id="db-port" placeholder="5432" />
            </div>
            <Button className="w-full">Test Connection</Button>
          </CardContent>
        </Card>

        {/* Alert Thresholds */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Alert Thresholds
            </CardTitle>
            <CardDescription>Configure when to receive alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="low-stock">Low Stock Threshold (%)</Label>
              <Input id="low-stock" type="number" defaultValue="20" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="critical-stock">Critical Stock Threshold (%)</Label>
              <Input id="critical-stock" type="number" defaultValue="10" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-alerts">Email Alerts</Label>
              <Switch id="email-alerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-alerts">SMS Alerts</Label>
              <Switch id="sms-alerts" />
            </div>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              User Management
            </CardTitle>
            <CardDescription>Manage user access and permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input id="session-timeout" type="number" defaultValue="30" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="require-2fa">Require Two-Factor Authentication</Label>
              <Switch id="require-2fa" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password-complexity">Enforce Password Complexity</Label>
              <Switch id="password-complexity" defaultChecked />
            </div>
            <Button variant="outline" className="w-full">Manage Users</Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>Configure security and access controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jwt-expiry">JWT Token Expiry (hours)</Label>
              <Input id="jwt-expiry" type="number" defaultValue="24" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="audit-logs">Enable Audit Logging</Label>
              <Switch id="audit-logs" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="rate-limiting">Enable Rate Limiting</Label>
              <Switch id="rate-limiting" defaultChecked />
            </div>
            <Button variant="outline" className="w-full">View Security Logs</Button>
          </CardContent>
        </Card>
      </div>

      {/* Save Settings */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Save Configuration</h3>
              <p className="text-slate-600">Apply all configuration changes</p>
            </div>
            <div className="space-x-2">
              <Button variant="outline">Reset to Defaults</Button>
              <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
