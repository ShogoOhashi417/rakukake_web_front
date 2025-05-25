import apiClient from '../client';

export interface Category {
  id: number;
  name: string;
}

export const categoryService = {
  getIncomeCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/api/v1/income-categories');
    return response.data;
  },
  
  addIncomeCategory: async (name: string): Promise<Category> => {
    const response = await apiClient.post<Category>('/api/v1/income-categories', { name });
    return response.data;
  },
  
  updateIncomeCategory: async (id: number, name: string): Promise<Category> => {
    const response = await apiClient.put<Category>(`/api/v1/income-categories/${id}`, { name });
    return response.data;
  },
  
  deleteIncomeCategory: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/v1/income-categories/${id}`);
  },
  
  getExpenseCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/api/v1/expense-categories/get');
    return response.data;
  },
  
  addExpenseCategory: async (name: string): Promise<Category> => {
    const response = await apiClient.post<Category>('/api/v1/expense-categories', { name });
    return response.data;
  },
  
  updateExpenseCategory: async (id: number, name: string): Promise<Category> => {
    const response = await apiClient.put<Category>(`/api/v1/expense-categories/${id}`, { name });
    return response.data;
  },
  
  deleteExpenseCategory: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/v1/expense-categories/${id}`);
  }
};

export default categoryService; 