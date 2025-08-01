import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Payment {
  id: string;
  student_id: string;
  amount: number;
  payment_method: 'cash' | 'transfer' | 'card';
  payment_date: string;
  due_date: string;
  month_year: string;
  status: 'pending' | 'paid' | 'overdue';
  notes?: string;
  processed_by?: string;
  created_at: string;
  updated_at: string;
}

export const usePayments = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          id,
          student_id,
          amount,
          payment_method,
          payment_date,
          due_date,
          month_year,
          status,
          notes,
          processed_by,
          created_at,
          updated_at,
          students (
            name,
            class,
            nis
          )
        `)
        .order('payment_date', { ascending: false });

      if (error) {
        console.error('Error fetching payments:', error);
        toast({
          title: "Error",
          description: "Failed to fetch payments",
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
    retry: 2,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (paymentData: Omit<Payment, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('payments')
        .insert([paymentData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast({
        title: "Success",
        description: "Payment recorded successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to record payment",
        variant: "destructive",
      });
    },
  });
};