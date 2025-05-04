import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import userService, { User } from './api/services/userService';
import HomePage from './pages/HomePage';

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
      <Route path="/" element={<HomePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;
