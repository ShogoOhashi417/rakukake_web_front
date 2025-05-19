import apiClient from '../client';

export interface Category {
  id: number;
  name: string;
}

export const categoryService = {
  getIncomeCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/api/income-categories');
    return response.data;
  },
  
  addIncomeCategory: async (name: string): Promise<Category> => {
    const response = await apiClient.post<Category>('/api/v1/income-categories', { name });
    return response.data;
  },
  
  updateIncomeCategory: async (id: number, name: string): Promise<Category> => {
    const response = await apiClient.put<Category>(`/api/income-categories/${id}`, { name });
    return response.data;
  },
  
  deleteIncomeCategory: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/income-categories/${id}`);
  },
  
  getExpenditureCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/api/expenditure-categories');
    return response.data;
  },
  
  addExpenditureCategory: async (name: string): Promise<Category> => {
    const response = await apiClient.post<Category>('/api/expenditure-categories', { name });
    return response.data;
  },
  
  updateExpenditureCategory: async (id: number, name: string): Promise<Category> => {
    const response = await apiClient.put<Category>(`/api/expenditure-categories/${id}`, { name });
    return response.data;
  },
  
  deleteExpenditureCategory: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/expenditure-categories/${id}`);
  }
};

export default categoryService; 