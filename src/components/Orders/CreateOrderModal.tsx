
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { usePrismaOrders } from '@/hooks/usePrismaOrders';
import { usePrismaWorkers } from '@/hooks/usePrismaWorkers';
import { usePrismaInventory } from '@/hooks/usePrismaInventory';

interface OrderItem {
  item_id: string;
  quantity: number;
  unit_price: number;
}

export const CreateOrderModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [orderType, setOrderType] = useState<'inbound' | 'outbound'>('inbound');
  const [assignedWorkerId, setAssignedWorkerId] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { item_id: '', quantity: 1, unit_price: 0 }
  ]);
  const { createOrder } = usePrismaOrders();
  const { workers } = usePrismaWorkers();
  const { items } = usePrismaInventory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const orderNumber = `ORD-${String(Date.now()).slice(-6)}`;
      
      await createOrder.mutateAsync({
        order_number: orderNumber,
        type: orderType,
        assigned_worker_id: assignedWorkerId || undefined,
        items: orderItems.filter(item => item.item_id)
      });
      
      // Reset form
      setOrderType('inbound');
      setAssignedWorkerId('');
      setOrderItems([{ item_id: '', quantity: 1, unit_price: 0 }]);
      setOpen(false);
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const addOrderItem = () => {
    setOrderItems([...orderItems, { item_id: '', quantity: 1, unit_price: 0 }]);
  };

  const removeOrderItem = (index: number) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, i) => i !== index));
    }
  };

  const updateOrderItem = (index: number, field: keyof OrderItem, value: string | number) => {
    const updated = orderItems.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setOrderItems(updated);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Create Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
          <DialogDescription>
            Create a new inbound or outbound order for inventory management.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orderType">Order Type</Label>
              <Select value={orderType} onValueChange={(value: 'inbound' | 'outbound') => setOrderType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inbound">Inbound (Receiving)</SelectItem>
                  <SelectItem value="outbound">Outbound (Shipping)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignedWorker">Assigned Worker</Label>
              <Select value={assignedWorkerId} onValueChange={setAssignedWorkerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select worker" />
                </SelectTrigger>
                <SelectContent>
                  {workers.map((worker) => (
                    <SelectItem key={worker.id} value={worker.id}>
                      {worker.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Order Items</Label>
              <Button type="button" variant="outline" size="sm" onClick={addOrderItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
            
            {orderItems.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-5 space-y-1">
                  <Label className="text-xs">Item</Label>
                  <Select
                    value={item.item_id}
                    onValueChange={(value) => {
                      updateOrderItem(index, 'item_id', value);
                      const selectedItem = items.find(i => i.id === value);
                      if (selectedItem) {
                        updateOrderItem(index, 'unit_price', selectedItem.unit_price);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select item" />
                    </SelectTrigger>
                    <SelectContent>
                      {items.map((inventoryItem) => (
                        <SelectItem key={inventoryItem.id} value={inventoryItem.id}>
                          {inventoryItem.item_code} - {inventoryItem.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs">Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value))}
                    required
                  />
                </div>
                <div className="col-span-3 space-y-1">
                  <Label className="text-xs">Unit Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.unit_price}
                    onChange={(e) => updateOrderItem(index, 'unit_price', parseFloat(e.target.value))}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeOrderItem(index)}
                    disabled={orderItems.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={createOrder.isPending}
            >
              {createOrder.isPending ? 'Creating...' : 'Create Order'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
