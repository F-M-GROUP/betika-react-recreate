import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useSyncSports = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('sync-sports');
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Sports synced successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to sync sports",
        variant: "destructive",
      });
    },
  });
};

export const useFetchOdds = () => {
  return useMutation({
    mutationFn: async (sportKey?: string) => {
      const { data, error } = await supabase.functions.invoke('fetch-odds', {
        body: { sportKey }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Odds updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch odds",
        variant: "destructive",
      });
    },
  });
};