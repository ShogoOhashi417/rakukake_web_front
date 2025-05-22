import apiClient from '../client';

export interface ExpenditureData {
  expenditure_name: string;
  expenditure_category_id: number;
  expenditure_amount: number;
  calendar_date?: string | null;
}

export interface ExpenditureDeleteData {
  id: number;
  expenditure_name?: string;
  expenditure_amount?: number;
}

export const expenditureService = {
  getExpenditureList: async () => {
    const response = await apiClient.get('/api/v1/expenditures');
    return response.data.expenditure_info_list;
  },
  
  addExpenditure: async (data: ExpenditureData) => {
    const response = await apiClient.post('/api/v1/expenditures/add', data);
    return response.data;
  },
  
  updateExpenditure: async (id: number, data: ExpenditureData) => {
    const response = await apiClient.put(`/api/v1/expenditures/update/${id}`, data);
    return response.data;
  },
  
  deleteExpenditure: async (data: ExpenditureDeleteData) => {
    const response = await apiClient.delete('/api/v1/expenditures/delete', { data });
    return response.data;
  }
};

export default expenditureService; 