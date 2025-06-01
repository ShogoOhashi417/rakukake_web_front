import axios from 'axios';

const apiClient = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL || ''}`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// CSRFトークンを取得するための関数
const getCsrfToken = async () => {
  try {
    const response = await apiClient.get('/api/csrf-token');
    return response.data.token;
  } catch (error) {
    console.error('CSRFトークン取得エラー:', error);
    return null;
  }
};

// リクエスト時の共通処理
apiClient.interceptors.request.use(
  async (config) => {
    // GETリクエストはCSRFトークンが不要
    if (config.method !== 'get') {
      try {
        const token = await getCsrfToken();
        if (token) {
          config.headers['X-CSRF-TOKEN'] = token;
        }
      } catch (error) {
        console.error('インターセプターエラー:', error);
      }
    }
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