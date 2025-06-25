
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { usePrismaInventory } from '@/hooks/usePrismaInventory';

export const AddItemModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    item_code: '',
    name: '',
    description: '',
    category: '',
    current_stock: '',
    min_stock_level: '',
    unit_price: '',
    location: '',
    method: 'FIFO' as 'FIFO' | 'FEFO' | 'LIFO'
  });
  const { createItem } = usePrismaInventory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createItem.mutateAsync({
        item_code: formData.item_code,
        name: formData.name,
        description: formData.description || null,
        category: formData.category,
        current_stock: parseInt(formData.current_stock),
        min_stock_level: parseInt(formData.min_stock_level),
        unit_price: parseFloat(formData.unit_price),
        location: formData.location,
        method: formData.method
      });
      
      // Reset form
      setFormData({
        item_code: '',
        name: '',
        description: '',
        category: '',
        current_stock: '',
        min_stock_level: '',
        unit_price: '',
        location: '',
        method: 'FIFO'
      });
      setOpen(false);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Inventory Item</DialogTitle>
          <DialogDescription>
            Enter the details for the new inventory item.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="item_code">Item Code</Label>
              <Input
                id="item_code"
                value={formData.item_code}
                onChange={(e) => handleInputChange('item_code', e.target.value)}
                placeholder="ITM-001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Item name"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Item description"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="e.g., Safety Equipment"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="method">Stock Method</Label>
              <Select value={formData.method} onValueChange={(value: 'FIFO' | 'FEFO' | 'LIFO') => handleInputChange('method', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FIFO">FIFO</SelectItem>
                  <SelectItem value="FEFO">FEFO</SelectItem>
                  <SelectItem value="LIFO">LIFO</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current_stock">Current Stock</Label>
              <Input
                id="current_stock"
                type="number"
                value={formData.current_stock}
                onChange={(e) => handleInputChange('current_stock', e.target.value)}
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min_stock_level">Min Stock Level</Label>
              <Input
                id="min_stock_level"
                type="number"
                value={formData.min_stock_level}
                onChange={(e) => handleInputChange('min_stock_level', e.target.value)}
                placeholder="10"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit_price">Unit Price ($)</Label>
              <Input
                id="unit_price"
                type="number"
                step="0.01"
                value={formData.unit_price}
                onChange={(e) => handleInputChange('unit_price', e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Storage Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="A1-B2-C3"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={createItem.isPending}
            >
              {createItem.isPending ? 'Adding...' : 'Add Item'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
