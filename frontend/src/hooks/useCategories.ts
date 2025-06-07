import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import categoryService, { CreateCategoryData, UpdateCategoryData } from '@/lib/services/categoryService';

export const useCategories = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get all categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAllCategories,
  });

  // Create category mutation
  const createCategory = useMutation({
    mutationFn: (data: CreateCategoryData) => categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: 'Success',
        description: 'Category created successfully',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create category',
      });
    },
  });

  // Update category mutation
  const updateCategory = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoryData }) =>
      categoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: 'Success',
        description: 'Category updated successfully',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update category',
      });
    },
  });

  // Delete category mutation
  const deleteCategory = useMutation({
    mutationFn: (id: number) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete category',
      });
    },
  });

  return {
    categories,
    isLoadingCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
