
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus } from 'lucide-react';
import { useWorkers } from '@/hooks/useWorkers';

export const AddWorkerModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    shift: '',
    is_active: true
  });
  const { createWorker } = useWorkers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createWorker.mutateAsync({
        ...formData,
        orders_processed: 0,
        accuracy: 100,
        productivity: 100
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        position: '',
        shift: '',
        is_active: true
      });
      setOpen(false);
    } catch (error) {
      console.error('Error adding worker:', error);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Worker
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Worker</DialogTitle>
          <DialogDescription>
            Enter the details for the new warehouse worker.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="John Smith"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="john.smith@warehouse.com"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Select value={formData.position} onValueChange={(value) => handleInputChange('position', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Warehouse Associate">Warehouse Associate</SelectItem>
                <SelectItem value="Senior Warehouse Associate">Senior Warehouse Associate</SelectItem>
                <SelectItem value="Forklift Operator">Forklift Operator</SelectItem>
                <SelectItem value="Team Lead">Team Lead</SelectItem>
                <SelectItem value="Supervisor">Supervisor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="shift">Work Shift</Label>
            <Select value={formData.shift} onValueChange={(value) => handleInputChange('shift', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select shift" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Morning (6AM-2PM)">Morning (6AM-2PM)</SelectItem>
                <SelectItem value="Afternoon (2PM-10PM)">Afternoon (2PM-10PM)</SelectItem>
                <SelectItem value="Night (10PM-6AM)">Night (10PM-6AM)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Active Status</Label>
            <Switch
              id="isActive"
              checked={formData.is_active}
              onCheckedChange={(checked) => handleInputChange('is_active', checked)}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={createWorker.isPending}
            >
              {createWorker.isPending ? 'Adding...' : 'Add Worker'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
