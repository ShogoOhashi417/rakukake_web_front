import apiClient from '../client';

export interface User {
  id: number;
  name: string;
  email: string;
}

interface ProfileUpdateData {
  name: string;
  email: string;
}

interface PasswordUpdateData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

interface DeleteAccountData {
  password: string;
}

export const userService = {
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/api/user');
    return response.data;
  },
  
  updateProfile: async (data: ProfileUpdateData): Promise<User> => {
    const response = await apiClient.put<User>('/api/user/profile', data);
    return response.data;
  },

  updatePassword: async (data: PasswordUpdateData): Promise<void> => {
    await apiClient.put('/api/user/password', data);
  },

  deleteAccount: async (data: DeleteAccountData): Promise<void> => {
    await apiClient.delete('/api/user', { data });
  }
};

export default userService; 