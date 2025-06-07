import api from '../api';

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface CreateCategoryData {
  name: string;
  description: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
}

const categoryService = {
  // Get all categories
  getAllCategories: async (): Promise<Category[]> => {
    const response = await api.get('/api/categories');
    return response.data;
  },

  // Create new category
  createCategory: async (data: CreateCategoryData): Promise<Category> => {
    const response = await api.post('/api/categories', data);
    return response.data;
  },

  // Update category
  updateCategory: async (id: number, data: UpdateCategoryData): Promise<Category> => {
    const response = await api.put(`/api/categories/${id}`, data);
    return response.data;
  },

  // Delete category
  deleteCategory: async (id: number): Promise<void> => {
    await api.delete(`/api/categories/${id}`);
  },
};

export default categoryService;
