import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import userService, { User } from './api/services/userService';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Welcome from './pages/Welcome';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Income from './pages/Income/Index';
import IncomeFixed from './pages/Income/Fixed';
import Expense from './pages/Expense/Index';
import ExpenseFixed from './pages/Expense/Fixed';
import Category from './pages/Category/Index';
import Report from './pages/Report/Saving';
import ReportExpense from './pages/Report/Expense';
import BulkOperation from './pages/BulkOperation/ExpenseBulkOperation';
import Edit from './pages/Profile/Edit';
import ForgotPassword from './pages/Auth/ForgotPassword';
import apiClient from './api/client';

// ユーザープロフィールページのコンポーネント
const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // コンポーネントマウント時にユーザー情報を取得
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const userData = await userService.getProfile();
        setUser(userData);
      } catch (err) {
        console.error('Failed to fetch user:', err);
        setError('ユーザー情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Rakukake API Frontend</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {user && (
          <div className="user-profile">
            <h2>ユーザープロフィール</h2>
            <p>ID: {user.id}</p>
            <p>名前: {user.name}</p>
            <p>Email: {user.email}</p>
          </div>
        )}
        {!loading && !error && !user && (
          <p>ユーザーデータがありません</p>
        )}
      </header>
    </div>
  );
};

// 存在しないページへのアクセス時に表示するコンポーネント
const NotFoundPage: React.FC = () => (
  <div className="App">
    <header className="App-header">
      <h1>404 - ページが見つかりません</h1>
      <p>お探しのページは存在しないか、移動した可能性があります。</p>
    </header>
  </div>
);

// メインのApp関数でルーティングを定義
function App() {
  useEffect(() => {
    // アプリケーション初回ロード時にCSRF Cookieを取得
    const fetchCsrfCookie = async () => {
      try {
        await apiClient.get('/sanctum/csrf-cookie');
        console.log('CSRF cookie fetched successfully.');
      } catch (error) {
        console.error('Failed to fetch CSRF cookie:', error);
        // CSRFトークン取得失敗時のエラーハンドリングをここに追加できます
      }
    };

    fetchCsrfCookie();
  }, []); // 空の依存配列により、マウント時に一度だけ実行

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Edit />
          </ProtectedRoute>
        } />

        <Route path="/report/savings" element={
          <ProtectedRoute>
            <Report />
          </ProtectedRoute>
        } />
        <Route path="/report/expenses" element={
          <ProtectedRoute>
            <ReportExpense />
          </ProtectedRoute>
        } />
        
        <Route path="/incomes" element={
          <ProtectedRoute>
            <Income />
          </ProtectedRoute>
        } />
        <Route path="/incomes/fixed" element={
          <ProtectedRoute>
            <IncomeFixed />
          </ProtectedRoute>
        } />

        <Route path="/expenses" element={
          <ProtectedRoute>
            <Expense 
              auth={{ user: { name: 'ゲスト', email: 'guest@example.com' } }} 
              expenditure_info_list={[]} 
              expenditure_category_info_list={[]} 
            />
          </ProtectedRoute>
        } />
        <Route path="/expenses/fixed" element={
          <ProtectedRoute>
            <ExpenseFixed 
              auth={{ user: { name: 'ゲスト', email: 'guest@example.com' } }} 
              expenditure_info_list={[]} 
              expenditure_category_info_list={[]} 
            />
          </ProtectedRoute>
        } />

        <Route path="/categories" element={
          <ProtectedRoute>
            <Category />
          </ProtectedRoute>
        } />

        <Route path="/bulk-operations" element={
          <ProtectedRoute>
            <BulkOperation />
          </ProtectedRoute>
        } />
        
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
