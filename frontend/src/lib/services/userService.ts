import api from '../api';

export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  isAdmin: boolean;
}

export interface UpdateUserData {
  name?: string;
  phone?: string;
  address?: string;
}

const userService = {
  // Get current user profile
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: UpdateUserData): Promise<User> => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  // Get user orders
  getUserOrders: async () => {
    const response = await api.get('/users/orders');
    return response.data;
  },
};

export default userService;
