import apiClient from '../client';

export interface IncomeData {
  income_name: string;
  income_category_id: number;
  income_amount: number;
  calendar_date?: string | null;
}

export interface IncomeDeleteData {
  id: number;
  income_name?: string;
  income_amount?: number;
}

export const incomeService = {
  getIncomeList: async () => {
    const response = await apiClient.get('/api/v1/incomes/get');
    return response.data.income_info_list;
  },
  
  addIncome: async (data: IncomeData) => {
    const response = await apiClient.post('/api/v1/incomes/add', data);
    return response.data;
  },
  
  updateIncome: async (id: number, data: IncomeData) => {
    const response = await apiClient.put(`/api/v1/incomes/update/${id}`, data);
    return response.data;
  },
  
  deleteIncome: async (data: IncomeDeleteData) => {
    const response = await apiClient.delete('/api/v1/incomes/delete', { data });
    return response.data;
  }
};

export default incomeService; 