import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GuestLayout from '../../layouts/GuestLayout';
import { Button } from '../../components/ui/button';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // 実際のアプリでは、ここでAPIリクエストを行います
            // const response = await fetch('/api/login', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ email, password, remember }),
            // });
            // 
            // if (!response.ok) {
            //     const data = await response.json();
            //     throw new Error(data.message || 'ログインに失敗しました');
            // }
            // 
            // const userData = await response.json();
            // localStorage.setItem('user', JSON.stringify(userData.user));

            // モック認証処理（開発用）
            console.log('Login attempt:', { email, password, remember });
            
            // モックユーザー情報の作成と保存
            const mockUser = {
                id: 1,
                name: email.split('@')[0], // メールアドレスからユーザー名を生成
                email: email,
            };
            
            // ユーザー情報をローカルストレージに保存
            localStorage.setItem('user', JSON.stringify(mockUser));
            
            // 認証成功としてダッシュボードへリダイレクト
            setTimeout(() => {
                navigate('/dashboard');
                setIsLoading(false);
            }, 1000);
        } catch (err) {
            setError(err.message || 'ログインに失敗しました');
            setIsLoading(false);
        }
    };

    return (
        <GuestLayout>
            <div className="mb-4 text-sm text-gray-600">
                アカウントをお持ちの方はログインしてください。
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div>
                    <label className="block font-medium text-sm text-gray-700" htmlFor="email">
                        メールアドレス
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoFocus
                    />
                </div>

                <div className="mt-4">
                    <label className="block font-medium text-sm text-gray-700" htmlFor="password">
                        パスワード
                    </label>
                    <input
                        id="password"
                        type="password"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                    />
                </div>

                <div className="block mt-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                        />
                        <span className="ms-2 text-sm text-gray-600">ログイン状態を保存</span>
                    </label>
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Link to="/forgot-password" className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        パスワードをお忘れですか？
                    </Link>

                    <Button 
                        className="ms-4 bg-green-600 hover:bg-green-700" 
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'ログイン中...' : 'ログイン'}
                    </Button>
                </div>
            </form>
        </GuestLayout>
    );
};

export default Login; 