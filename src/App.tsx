import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import userService, { User } from './api/services/userService';
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
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/profile" element={<Edit />} />

      <Route path="/report/savings" element={<Report />} />
      <Route path="/report/expenses" element={<ReportExpense />} />
      
      <Route path="/incomes" element={<Income />} />
      <Route path="/incomes/fixed" element={<IncomeFixed />} />

      <Route path="/expenses" element={<Expense 
        auth={{ user: { name: 'ゲスト', email: 'guest@example.com' } }} 
        expenditure_info_list={[]} 
        expenditure_category_info_list={[]} 
      />} />
      <Route path="/expenses/fixed" element={<ExpenseFixed 
        auth={{ user: { name: 'ゲスト', email: 'guest@example.com' } }} 
        expenditure_info_list={[]} 
        expenditure_category_info_list={[]} 
      />} />

      <Route path="/categories" element={<Category />} />

      <Route path="/bulk-operations" element={<BulkOperation />} />
      
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;
