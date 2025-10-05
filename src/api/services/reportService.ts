import apiClient from '../client';

interface ReportParams {
  start_date: string;
  end_date: string;
}

export const reportService = {
  getSavingReport: async (params: ReportParams) => {
    const response = await apiClient.get('/api/v1/report/saving', {
      params
    });
    return response.data;
  },

  getExpenseReport: async (params: ReportParams) => {
    const response = await apiClient.get('/api/v1/report/expense', {
      params
    });
    return response.data;
  }
};

export default reportService; 