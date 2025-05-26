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
export interface ExpenditureItem {
  id?: number;
  name: string;
  category_id: number;
  amount: number;
  date: string;
}
export interface ExpenditureCategory {
  id: number;
  name: string;
}

export const expenditureService = {
  getExpenditureList: async () => {
    const response = await apiClient.get('/api/v1/expenditures');
    return response.data.expenditureDataList;
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
  },

  /**
   * サンプルCSVファイルをエクスポートする
   */
  exportSampleCsv: async () => {
    const response = await apiClient.get('/api/v1/expenses/sample');
    return response.data;
  },

  /**
   * 期間を指定して支出データをCSVでエクスポートする
   */
  exportExpenditureCsv: async (startDate: Date, endDate: Date) => {
    const response = await apiClient.get('/api/v1/expenses/download', {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * CSVファイルをアップロードして処理する
   */
  importCsv: async (csvFile: File) => {
    const formData = new FormData();
    formData.append('csv', csvFile);

    const response = await apiClient.post('/api/v1/expenses/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * 支出カテゴリーを取得する
   */
  getExpenditureCategories: async () => {
    const response = await apiClient.get('/api/v1/expenses/categories');
    return response.data.expenditure_category_info_list;
  },

  bulkCreateExpenditure: async (formData: FormData) => {
    const response = await apiClient.post('/api/v1/expenses/bulk-create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default expenditureService; 