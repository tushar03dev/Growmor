import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import plantService, { Plant, CreatePlantData, UpdatePlantData } from '@/lib/services/plantService';
import { useToast } from '@/components/ui/use-toast';

export const usePlants = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get all plants
  const { data: plants, isLoading: isLoadingPlants } = useQuery({
    queryKey: ['plants'],
    queryFn: plantService.getAllPlants,
  });

  // Get trending plants
  const { data: trendingPlants, isLoading: isLoadingTrending } = useQuery({
    queryKey: ['plants', 'trending'],
    queryFn: plantService.getTrendingPlants,
  });

  // Get bestseller plants
  const { data: bestSellerPlants, isLoading: isLoadingBestSellers } = useQuery({
    queryKey: ['plants', 'bestsellers'],
    queryFn: plantService.getBestSellerPlants,
  });

  // Create plant mutation
  const createPlant = useMutation({
    mutationFn: plantService.createPlant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plants'] });
      toast({
        title: 'Success',
        description: 'Plant created successfully',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create plant',
      });
    },
  });

  // Update plant mutation
  const updatePlant = useMutation({
    mutationFn: plantService.updatePlant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plants'] });
      toast({
        title: 'Success',
        description: 'Plant updated successfully',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update plant',
      });
    },
  });

  // Delete plant mutation
  const deletePlant = useMutation({
    mutationFn: plantService.deletePlant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plants'] });
      toast({
        title: 'Success',
        description: 'Plant deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete plant',
      });
    },
  });

  // Set trending status mutation
  const setTrendingStatus = useMutation({
    mutationFn: ({ id, isTrending }: { id: number; isTrending: boolean }) =>
      plantService.setTrendingStatus(id, isTrending),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plants'] });
      toast({
        title: 'Success',
        description: 'Trending status updated successfully',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update trending status',
      });
    },
  });

  // Set bestseller status mutation
  const setBestSellerStatus = useMutation({
    mutationFn: ({ id, isBestSeller }: { id: number; isBestSeller: boolean }) =>
      plantService.setBestSellerStatus(id, isBestSeller),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plants'] });
      toast({
        title: 'Success',
        description: 'Bestseller status updated successfully',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update bestseller status',
      });
    },
  });

  return {
    plants,
    trendingPlants,
    bestSellerPlants,
    isLoadingPlants,
    isLoadingTrending,
    isLoadingBestSellers,
    createPlant,
    updatePlant,
    deletePlant,
    setTrendingStatus,
    setBestSellerStatus,
  };
};
