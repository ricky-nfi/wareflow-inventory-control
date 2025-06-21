
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SupabaseOrder, SupabaseOrderItem } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';

export const useOrders = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: orders = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            inventory_items (name, item_code)
          ),
          workers (name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
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
    }) => {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          order_number: order.order_number,
          type: order.type,
          assigned_worker_id: order.assigned_worker_id
        }])
        .select()
        .single();
      
      if (orderError) throw orderError;

      if (order.items.length > 0) {
        const orderItems = order.items.map(item => ({
          ...item,
          order_id: orderData.id
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);
        
        if (itemsError) throw itemsError;
      }

      return orderData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Order Created",
        description: "Order has been successfully created.",
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
  };
};
