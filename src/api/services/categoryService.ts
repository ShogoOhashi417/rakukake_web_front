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
  
  getExpenditureCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/api/v1/expenditure-categories');
    return response.data;
  },
  
  addExpenditureCategory: async (name: string): Promise<Category> => {
    const response = await apiClient.post<Category>('/api/v1/expenditure-categories', { name });
    return response.data;
  },
  
  updateExpenditureCategory: async (id: number, name: string): Promise<Category> => {
    const response = await apiClient.put<Category>(`/api/v1/expenditure-categories/${id}`, { name });
    return response.data;
  },
  
  deleteExpenditureCategory: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/v1/expenditure-categories/${id}`);
  }
};

export default categoryService; 