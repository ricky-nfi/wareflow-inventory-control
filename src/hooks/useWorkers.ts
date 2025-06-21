
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SupabaseWorker } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';

export const useWorkers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: workers = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['workers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as SupabaseWorker[];
    },
  });

  const createWorker = useMutation({
    mutationFn: async (worker: Omit<SupabaseWorker, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('workers')
        .insert([worker])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
      toast({
        title: "Worker Added",
        description: "Worker has been successfully added.",
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
  };
};
