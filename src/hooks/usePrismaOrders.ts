
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// API base URL - pointing to Vercel backend
const API_BASE_URL = 'https://wms-be-rickys-projects-c4ec1528.vercel.app/api';

interface PrismaOrderItem {
  id?: string;
  item_id: string;
  quantity: number;
  unit_price: number;
  inventory_items?: {
    name: string;
    item_code: string;
  };
}

interface PrismaOrder {
  id: string;
  order_number: string;
  type: 'inbound' | 'outbound';
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  assigned_worker_id?: string;
  created_at: string;
  updated_at: string;
  order_items: PrismaOrderItem[];
  workers?: {
    name: string;
  };
}

export const usePrismaOrders = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: orders = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['prisma-orders'],
    queryFn: async (): Promise<PrismaOrder[]> => {
      console.log('Fetching orders from:', `${API_BASE_URL}/orders`);
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Orders response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Orders fetch error:', errorText);
        throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Orders data received:', data);
      return data;
    },
    retry: 3,
    retryDelay: 1000,
  });

  const createOrder = useMutation({
    mutationFn: async (order: {
      order_number: string;
      type: 'inbound' | 'outbound';
      assigned_worker_id?: string;
      items: Array<{
        item_id: string;
        quantity: number;
        unit_price: number;
      }>;
    }): Promise<PrismaOrder> => {
      console.log('Creating order:', order);
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Create order error:', errorText);
        throw new Error(`Failed to create order: ${response.status} ${response.statusText}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prisma-orders'] });
      toast({
        title: "Order Created",
        description: "Order has been successfully created via Prisma API.",
      });
    },
    onError: (error: any) => {
      console.error('Create order mutation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create order",
        variant: "destructive",
      });
    },
  });

  const updateOrder = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PrismaOrder> & { id: string }): Promise<PrismaOrder> => {
      console.log('Updating order:', id, updates);
      const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update order error:', errorText);
        throw new Error(`Failed to update order: ${response.status} ${response.statusText}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prisma-orders'] });
      toast({
        title: "Order Updated",
        description: "Order has been successfully updated via Prisma API.",
      });
    },
    onError: (error: any) => {
      console.error('Update order mutation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update order",
        variant: "destructive",
      });
    },
  });

  const deleteOrder = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      console.log('Deleting order:', id);
      const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete order error:', errorText);
        throw new Error(`Failed to delete order: ${response.status} ${response.statusText}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prisma-orders'] });
      toast({
        title: "Order Deleted",
        description: "Order has been successfully deleted.",
      });
    },
    onError: (error: any) => {
      console.error('Delete order mutation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete order",
        variant: "destructive",
      });
    },
  });

  return {
    orders,
    isLoading,
    error,
    createOrder,
    updateOrder,
    deleteOrder,
  };
};
