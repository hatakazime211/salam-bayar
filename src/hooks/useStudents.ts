import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Student {
  id: string;
  name: string;
  nis: string;
  class: string;
  academic_year: string;
  monthly_fee: number;
  scholarship_discount: number;
  is_active: boolean;
  parent_id?: string;
  created_at: string;
  updated_at: string;
}

export const useStudents = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select(`
          id,
          name,
          nis,
          class,
          academic_year,
          monthly_fee,
          scholarship_discount,
          is_active,
          parent_id,
          created_at,
          updated_at,
          profiles:parent_id (
            id,
            full_name,
            phone
          )
        `)
        .order('name');

      if (error) {
        console.error('Error fetching students:', error);
        toast({
          title: "Error",
          description: "Failed to fetch students",
          variant: "destructive",
        });
        throw error;
      }

      return data as Student[];
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (studentData: Omit<Student, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('students')
        .insert([studentData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Success",
        description: "Student created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create student",
        variant: "destructive",
      });
    },
  });
};