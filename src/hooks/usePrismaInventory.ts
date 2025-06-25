
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { InventoryItem, CreateInventoryItemInput, UpdateInventoryItemInput } from '@/types/prisma';

// API base URL - this should point to your backend server
const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:3001/api';


export async function fetchInventory() {
  const res = await fetch(`${API_BASE_URL}/api/inventory`);
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
      const response = await fetch(`${API_BASE_URL}/inventory`);
      if (!response.ok) {
        throw new Error(`Failed to fetch inventory: ${response.statusText}`);
      }
      return response.json();
    },
  });

  const createItem = useMutation({
    mutationFn: async (item: CreateInventoryItemInput): Promise<InventoryItem> => {
      const response = await fetch(`${API_BASE_URL}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!response.ok) {
        throw new Error(`Failed to create item: ${response.statusText}`);
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
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateItem = useMutation({
    mutationFn: async ({ id, ...updates }: UpdateInventoryItemInput & { id: string }): Promise<InventoryItem> => {
      const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error(`Failed to update item: ${response.statusText}`);
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
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Failed to delete item: ${response.statusText}`);
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
    deleteItem,
  };
};
