import { useState } from 'react';
import InputError from '../../components/InputError';
import InputLabel from '../../components/InputLabel';
import { Button } from "../../components/ui/button";
import TextInput from '../../components/TextInput';
import { Link } from 'react-router-dom';
import { Wallet } from "lucide-react";
import apiClient from '../../api/client';

export default function ForgotPassword() {
    const [status, setStatus] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [data, setData] = useState({
        email: '',
    });

    const setFormData = (key, value) => {
        setData(prevData => ({
            ...prevData,
            [key]: value
        }));
    };

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        
        try {
            const response = await apiClient.post('/api/forgot-password', {
                email: data.email
            });
            
            setStatus(response.data.message || 'パスワードリセットのリンクをメールで送信しました。');
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                setStatus('パスワードリセットリンクの送信に失敗しました。再度お試しください。');
                console.error('Forgot password error:', error);
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
            <div className="container mx-auto px-4 py-12">
                <header className="flex justify-center items-center mb-12">
                    <div className="flex items-center gap-2">
                        <Wallet className="h-6 w-6 text-green-600" />
                        <h1 className="text-2xl font-bold text-green-800">かけいぼ</h1>
                    </div>
                </header>

                <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">パスワードをお忘れの方</h2>

                    <div className="mb-4 text-sm text-gray-600">
                        メールアドレスを入力していただくと、パスワードリセット用のリンクをお送りします。
                    </div>

                    {status && <div className="mb-6 text-sm text-green-600 bg-green-50 p-3 rounded-md">{status}</div>}

                    <form onSubmit={submit}>
                        <div className="space-y-6">
                            <div>
                                <InputLabel htmlFor="email" value="メールアドレス" className="text-gray-700" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full rounded-md border-gray-300"
                                    isFocused={true}
                                    onChange={(e) => setFormData('email', e.target.value)}
                                />

                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end">
                                <Button 
                                    className="w-full bg-green-600 hover:bg-green-700" 
                                    disabled={processing}
                                >
                                    パスワードリセットリンクを送信
                                </Button>
                            </div>
                        </div>
                    </form>
                    
                    <div className="flex flex-col items-center gap-2 text-sm mt-4">
                        <Link
                            to="/login"
                            className="text-gray-600 hover:text-green-600"
                        >
                            ログイン画面に戻る
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
