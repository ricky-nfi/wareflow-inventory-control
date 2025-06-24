
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// This hook will be ready to use once Prisma is properly set up
// and API endpoints are created to interact with the database

export const usePrismaInventory = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: items = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      // This will call your API endpoint that uses Prisma
      const response = await fetch('/api/inventory');
      if (!response.ok) throw new Error('Failed to fetch inventory');
      return response.json();
    },
  });

  const createItem = useMutation({
    mutationFn: async (item: any) => {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!response.ok) throw new Error('Failed to create item');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast({
        title: "Item Added",
        description: "Inventory item has been successfully added.",
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

  const updateItem = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const response = await fetch(`/api/inventory/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update item');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast({
        title: "Item Updated",
        description: "Inventory item has been successfully updated.",
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
    items,
    isLoading,
    error,
    createItem,
    updateItem,
  };
};
