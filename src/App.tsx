import React, { useEffect, useState } from 'react';
import './App.css';
import userService, { User } from './api/services/userService';

function App() {
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
}

export default App;
