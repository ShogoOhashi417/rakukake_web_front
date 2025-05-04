import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GuestLayout from '../../layouts/GuestLayout';
import { Button } from '../../components/ui/button';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setErrors({});
        setIsLoading(true);

        // パスワード一致チェック
        if (password !== passwordConfirmation) {
            setErrors({ password_confirmation: 'パスワードが一致しません' });
            setIsLoading(false);
            return;
        }

        try {
            // 実際のアプリでは、ここでAPIリクエストを行います
            // const response = await fetch('/api/register', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ name, email, password, password_confirmation: passwordConfirmation }),
            // });
            // 
            // if (!response.ok) {
            //     const data = await response.json();
            //     if (data.errors) {
            //         setErrors(data.errors);
            //     } else {
            //         throw new Error(data.message || '登録に失敗しました');
            //     }
            //     return;
            // }
            // 
            // const userData = await response.json();
            // localStorage.setItem('user', JSON.stringify(userData.user));

            // モック認証処理（開発用）
            console.log('Register attempt:', { name, email, password, passwordConfirmation });
            
            // モックユーザー情報の作成と保存
            const mockUser = {
                id: 1,
                name: name,
                email: email,
            };
            
            // ユーザー情報をローカルストレージに保存
            localStorage.setItem('user', JSON.stringify(mockUser));
            
            // 登録成功としてダッシュボードへリダイレクト
            setTimeout(() => {
                navigate('/dashboard');
                setIsLoading(false);
            }, 1000);
        } catch (err) {
            setError(err.message || '登録に失敗しました');
            setIsLoading(false);
        }
    };

    return (
        <GuestLayout>
            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div>
                    <label className="block font-medium text-sm text-gray-700" htmlFor="name">
                        名前
                    </label>
                    <input
                        id="name"
                        type="text"
                        className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.name ? 'border-red-500' : ''}`}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        autoFocus
                        autoComplete="name"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div className="mt-4">
                    <label className="block font-medium text-sm text-gray-700" htmlFor="email">
                        メールアドレス
                    </label>
                    <input
                        id="email"
                        type="email"
                        className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.email ? 'border-red-500' : ''}`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="username"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div className="mt-4">
                    <label className="block font-medium text-sm text-gray-700" htmlFor="password">
                        パスワード
                    </label>
                    <input
                        id="password"
                        type="password"
                        className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.password ? 'border-red-500' : ''}`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                <div className="mt-4">
                    <label className="block font-medium text-sm text-gray-700" htmlFor="password_confirmation">
                        パスワード（確認）
                    </label>
                    <input
                        id="password_confirmation"
                        type="password"
                        className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.password_confirmation ? 'border-red-500' : ''}`}
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        required
                        autoComplete="new-password"
                    />
                    {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>}
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Link to="/login" className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        すでに登録済みですか？
                    </Link>

                    <Button 
                        className="ms-4 bg-green-600 hover:bg-green-700" 
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? '登録中...' : '登録'}
                    </Button>
                </div>
            </form>
        </GuestLayout>
    );
};

export default Register; 