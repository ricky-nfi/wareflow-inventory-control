
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// API base URL - this should point to your backend server
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://wms-be-rickys-projects-c4ec1528.vercel.app';

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
      console.log('Fetching workers from:', `${API_BASE_URL}/workers`);
      const response = await fetch(`${API_BASE_URL}/workers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Workers response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Workers fetch error:', errorText);
        throw new Error(`Failed to fetch workers: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Workers data received:', data);
      return data;
    },
    retry: 3,
    retryDelay: 1000,
  });

  const createWorker = useMutation({
    mutationFn: async (worker: Omit<PrismaWorker, 'id' | 'created_at'>): Promise<PrismaWorker> => {
      console.log('Creating worker:', worker);
      const response = await fetch(`${API_BASE_URL}/workers`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(worker),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Create worker error:', errorText);
        throw new Error(`Failed to create worker: ${response.status} ${response.statusText}`);
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
      console.error('Create worker mutation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create worker",
        variant: "destructive",
      });
    },
  });

  const updateWorker = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PrismaWorker> & { id: string }): Promise<PrismaWorker> => {
      console.log('Updating worker:', id, updates);
      const response = await fetch(`${API_BASE_URL}/workers/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update worker error:', errorText);
        throw new Error(`Failed to update worker: ${response.status} ${response.statusText}`);
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
      console.error('Update worker mutation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update worker",
        variant: "destructive",
      });
    },
  });

  const deleteWorker = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      console.log('Deleting worker:', id);
      const response = await fetch(`${API_BASE_URL}/workers/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete worker error:', errorText);
        throw new Error(`Failed to delete worker: ${response.status} ${response.statusText}`);
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
      console.error('Delete worker mutation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete worker",
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
