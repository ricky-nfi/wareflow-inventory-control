
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// API base URL - this should point to your backend server
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

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
      const response = await fetch(`${API_BASE_URL}/orders`);
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.statusText}`);
      }
      return response.json();
    },
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
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
      if (!response.ok) {
        throw new Error(`Failed to create order: ${response.statusText}`);
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
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateOrder = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PrismaOrder> & { id: string }): Promise<PrismaOrder> => {
      const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error(`Failed to update order: ${response.statusText}`);
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
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteOrder = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Failed to delete order: ${response.statusText}`);
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
      toast({
        title: "Error",
        description: error.message,
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
