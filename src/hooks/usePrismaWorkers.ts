
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// API base URL - this should point to your backend server
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

interface PrismaWorker {
  id: string;
  name: string;
  email: string;
  position: string;
  shift?: string;
  is_active: boolean;
  orders_processed: number;
  accuracy: number;
  productivity: number;
  created_at: string;
}

export const usePrismaWorkers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: workers = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['prisma-workers'],
    queryFn: async (): Promise<PrismaWorker[]> => {
      const response = await fetch(`${API_BASE_URL}/workers`);
      if (!response.ok) {
        throw new Error(`Failed to fetch workers: ${response.statusText}`);
      }
      return response.json();
    },
  });

  const createWorker = useMutation({
    mutationFn: async (worker: Omit<PrismaWorker, 'id' | 'created_at'>): Promise<PrismaWorker> => {
      const response = await fetch(`${API_BASE_URL}/workers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(worker),
      });
      if (!response.ok) {
        throw new Error(`Failed to create worker: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prisma-workers'] });
      toast({
        title: "Worker Added",
        description: "Worker has been successfully added via Prisma API.",
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

  const updateWorker = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PrismaWorker> & { id: string }): Promise<PrismaWorker> => {
      const response = await fetch(`${API_BASE_URL}/workers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error(`Failed to update worker: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prisma-workers'] });
      toast({
        title: "Worker Updated",
        description: "Worker has been successfully updated via Prisma API.",
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

  const deleteWorker = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/workers/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Failed to delete worker: ${response.statusText}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prisma-workers'] });
      toast({
        title: "Worker Deleted",
        description: "Worker has been successfully deleted.",
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
    workers,
    isLoading,
    error,
    createWorker,
    updateWorker,
    deleteWorker,
  };
};
