import axios from 'axios';

const apiClient = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL || ''}`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// リクエスト時の共通処理
apiClient.interceptors.request.use(
  (config) => {
    // 認証トークンを追加するなどの処理をここに実装できます
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンス時の共通処理
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // エラーハンドリングをここに実装できます
    if (error.response?.status === 401) {
      // 未認証エラー処理
      console.error('Authentication error');
    }
    return Promise.reject(error);
  }
);

export default apiClient; 