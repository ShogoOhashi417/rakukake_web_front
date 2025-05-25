import apiClient from '../client';

export interface FixedIncomeData {
  income_name: string;
  income_category_id: number;
  income_amount: number;
  cycle_unit: number;
  payment_day: number;
  payment_month: number | null;
  period_start_date: string | null;
  period_end_date: string | null;
}

export const fixedIncomeService = {
  getFixedIncomes: async () => {
        const response = await apiClient.get('/api/v1/fixed-incomes/get');
    return response.data.fixedIncomes;
  },
  
  createFixedIncome: async (data: FixedIncomeData) => {
    const response = await apiClient.post('/api/v1/fixed-incomes/add', data);
    return response.data;
  },
  
  updateFixedIncome: async (id: number, data: FixedIncomeData) => {
    const response = await apiClient.put(`/api/v1/fixed-incomes/update/${id}`, data);
    return response.data;
  },
  
  deleteFixedIncome: async (id: number) => {
    const response = await apiClient.delete(`/api/v1/fixed-incomes/${id}`);
    return response.data;
  }
};

export default fixedIncomeService; 