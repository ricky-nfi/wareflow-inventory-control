
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { InventoryItem, CreateInventoryItemInput, UpdateInventoryItemInput } from '@/types/prisma';

// API base URL - pointing to Vercel backend
const API_BASE_URL = 'https://wms-be-rickys-projects-c4ec1528.vercel.app/api';

export async function fetchInventory() {
  const res = await fetch(`${API_BASE_URL}/inventory`);
  if (!res.ok) throw new Error("Failed to fetch inventory");
  return res.json();
}

export const usePrismaInventory = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: items = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['prisma-inventory'],
    queryFn: async (): Promise<InventoryItem[]> => {
      console.log('Fetching inventory from:', `${API_BASE_URL}/inventory`);
      const response = await fetch(`${API_BASE_URL}/inventory`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Inventory response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Inventory fetch error:', errorText);
        throw new Error(`Failed to fetch inventory: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Inventory data received:', data);
      return data;
    },
    retry: 3,
    retryDelay: 1000,
  });

  const createItem = useMutation({
    mutationFn: async (item: CreateInventoryItemInput): Promise<InventoryItem> => {
      console.log('Creating inventory item:', item);
      const response = await fetch(`${API_BASE_URL}/inventory`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Create item error:', errorText);
        throw new Error(`Failed to create item: ${response.status} ${response.statusText}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prisma-inventory'] });
      toast({
        title: "Item Added",
        description: "Inventory item has been successfully added via Prisma API.",
      });
    },
    onError: (error: any) => {
      console.error('Create item mutation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create inventory item",
        variant: "destructive",
      });
    },
  });

  const updateItem = useMutation({
    mutationFn: async ({ id, ...updates }: UpdateInventoryItemInput & { id: string }): Promise<InventoryItem> => {
      console.log('Updating inventory item:', id, updates);
      const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update item error:', errorText);
        throw new Error(`Failed to update item: ${response.status} ${response.statusText}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prisma-inventory'] });
      toast({
        title: "Item Updated",
        description: "Inventory item has been successfully updated via Prisma API.",
      });
    },
    onError: (error: any) => {
      console.error('Update item mutation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update inventory item",
        variant: "destructive",
      });
    },
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      console.log('Deleting inventory item:', id);
      const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete item error:', errorText);
        throw new Error(`Failed to delete item: ${response.status} ${response.statusText}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prisma-inventory'] });
      toast({
        title: "Item Deleted",
        description: "Inventory item has been successfully deleted.",
      });
    },
    onError: (error: any) => {
      console.error('Delete item mutation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete inventory item",
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
    deleteItem,
  };
};
