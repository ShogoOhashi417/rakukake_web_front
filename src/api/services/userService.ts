import apiClient from '../client';

export interface User {
  id: number;
  name: string;
  email: string;
}

export const userService = {
  // ユーザー情報を取得
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/user');
    return response.data;
  },
  
  // その他のユーザー関連APIメソッドを追加できます
};

export default userService; 