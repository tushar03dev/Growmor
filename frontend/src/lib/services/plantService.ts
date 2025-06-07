import api from '../api';

export interface Plant {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPercentage: number;
  isTrending: boolean;
  isBestSeller: boolean;
  imageUrl: string;
  categoryId: number;
  category?: {
    id: number;
    name: string;
  };
  images?: {
    id: number;
    url: string;
  }[];
  reviews?: {
    id: number;
    rating: number;
    comment: string;
    userId: number;
  }[];
}

export interface CreatePlantData {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  discountPercentage?: number;
  isTrending?: boolean;
  isBestSeller?: boolean;
  image?: File;
}

export interface UpdatePlantData extends Partial<CreatePlantData> {
  id: number;
}

const plantService = {
  // Get all plants
  getAllPlants: async (): Promise<Plant[]> => {
    const response = await api.get('/api/plants');
    return response.data;
  },

  // Get a single plant by ID
  getPlantById: async (id: number): Promise<Plant> => {
    const response = await api.get(`/api/plants/${id}`);
    return response.data;
  },

  // Get trending plants
  getTrendingPlants: async (): Promise<Plant[]> => {
    const response = await api.get('/api/plants/trending');
    return response.data;
  },

  // Get bestseller plants
  getBestSellerPlants: async (): Promise<Plant[]> => {
    const response = await api.get('/api/plants/bestsellers');
    return response.data;
  },

  // Create a new plant (admin only)
  createPlant: async (data: CreatePlantData): Promise<Plant> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await api.post('/api/plants', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update a plant (admin only)
  updatePlant: async (data: UpdatePlantData): Promise<Plant> => {
    const { id, ...updateData } = data;
    const formData = new FormData();
    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await api.put(`/api/plants/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete a plant (admin only)
  deletePlant: async (id: number): Promise<void> => {
    await api.delete(`/api/plants/${id}`);
  },

  // Set trending status (admin only)
  setTrendingStatus: async (id: number, isTrending: boolean): Promise<Plant> => {
    const response = await api.patch(`/api/plants/${id}/trending`, { isTrending });
    return response.data;
  },

  // Set bestseller status (admin only)
  setBestSellerStatus: async (id: number, isBestSeller: boolean): Promise<Plant> => {
    const response = await api.patch(`/api/plants/${id}/bestseller`, { isBestSeller });
    return response.data;
  },
};

export default plantService;
