import apiClient from '../client';

export interface FixedExpenseData {
  name: string;
  category_id: number;
  amount: number;
  cycle_unit: number;
  payment_day: number;
  payment_month: number | null;
  start_date: string | null;
  end_date: string | null;
}

export const fixedExpenseService = {
  getFixedExpenses: async () => {
    const response = await apiClient.get('/api/v1/fixed-expenses/get');
    return response.data.expenditureDataList;
  },
  
  createFixedExpense: async (data: FixedExpenseData) => {
    const response = await apiClient.post('/api/v1/fixed-expenses/add', data);
    return response.data;
  },
  
  updateFixedExpense: async (id: number, data: FixedExpenseData) => {
    const response = await apiClient.put(`/api/v1/fixed-expenses/update/${id}`, data);
    return response.data;
  },
  
  deleteFixedExpense: async (id: number) => {
    const response = await apiClient.delete(`/api/v1/fixed-expenses/${id}`);
    return response.data;
  }
};

export default fixedExpenseService; 