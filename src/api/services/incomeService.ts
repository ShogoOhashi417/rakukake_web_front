import apiClient from '../client';

export interface Income {
  id: number;
  name: string;
  amount: number;
  category_id: number;
  category_name?: string;
  date?: string | null;
}

export interface IncomeCategory {
  id: number;
  name: string;
}

interface IncomeCreateData {
  income_name: string;
  income_category_id: number;
  income_amount: number;
  calendar_date?: string | null;
}

interface IncomeUpdateData {
  income_name: string;
  income_category_id: number;
  income_amount: number;
  calendar_date?: string | null;
}

interface IncomeDeleteData {
  id: number;
  income_name?: string;
  income_amount?: number;
}

interface IncomeResponse {
  income_info_list: Income[];
}

export const incomeService = {
  // 収入一覧を取得
getIncomeList: async (): Promise<Income[]> => {
    try {
      const response = await apiClient.get<IncomeResponse>('/income/get');
      return response.data.income_info_list || [];
    } catch (error) {
      console.error('Error fetching income data:', error);
      return [];
    }
  },
  
  // 収入を追加
  addIncome: async (data: IncomeCreateData): Promise<any> => {
    const response = await apiClient.post('/income/add', data);
    return response.data;
  },

  // 収入を更新
  updateIncome: async (id: number, data: IncomeUpdateData): Promise<any> => {
    const response = await apiClient.put(`/income/update/${id}`, data);
    return response.data;
  },

  // 収入を削除
  deleteIncome: async (data: IncomeDeleteData): Promise<any> => {
    const response = await apiClient.post('/income/delete', data);
    return response.data;
  }
};

export default incomeService; 