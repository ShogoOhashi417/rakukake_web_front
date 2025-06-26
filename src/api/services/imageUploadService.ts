import apiClient from '../client';

export interface ImageUploadResponse {
  id: number;
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  extracted_data?: {
    amount?: number;
    date?: string;
    merchant?: string;
    category?: string;
    items?: Array<{
      name: string;
      amount: number;
      quantity?: number;
    }>;
  };
  created_at: string;
  updated_at: string;
}

export interface ImageUploadError {
  message: string;
  errors?: Record<string, string[]>;
}

export const imageUploadService = {
  uploadImage: async (file: File): Promise<ImageUploadResponse> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await apiClient.post<ImageUploadResponse>('/api/v1/receipts/extract', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
};

export default imageUploadService; 