import { useEffect, useState } from 'react';
import InputError from '../../components/InputError';
import InputLabel from '../../components/InputLabel';
import { Button } from "../../components/ui/button";
import TextInput from '../../components/TextInput';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet } from "lucide-react";

export default function Register() {
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const setFormData = (key, value) => {
        setData(prevData => ({
            ...prevData,
            [key]: value
        }));
    };

    const reset = (...fields) => {
        setData(prevData => {
            const newData = { ...prevData };
            fields.forEach(field => {
                newData[field] = '';
            });
            return newData;
        });
    };

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        setProcessing(true);
        
        // バリデーション
        const newErrors = {};
        if (!data.name) newErrors.name = '名前は必須です';
        if (!data.email) newErrors.email = 'メールアドレスは必須です';
        if (!data.password) newErrors.password = 'パスワードは必須です';
        if (data.password !== data.password_confirmation) {
            newErrors.password_confirmation = 'パスワードが一致しません';
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setProcessing(false);
            return;
        }
        
        // TODO: APIを使用して実際の登録処理を実装
        // ここではダミーのAPI呼び出しをシミュレート
        setTimeout(() => {
            localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email }));
            navigate('/report/savings');
            setProcessing(false);
        }, 1000);
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
                    <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">新規アカウント登録</h2>

                    <form onSubmit={submit}>
                        <div className="space-y-6">
                            <div>
                                <InputLabel htmlFor="name" value="お名前" className="text-gray-700" />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full rounded-md border-gray-300"
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={(e) => setFormData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="メールアドレス" className="text-gray-700" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full rounded-md border-gray-300"
                                    autoComplete="username"
                                    onChange={(e) => setFormData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="パスワード" className="text-gray-700" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full rounded-md border-gray-300"
                                    autoComplete="new-password"
                                    onChange={(e) => setFormData('password', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password_confirmation" value="パスワード（確認）" className="text-gray-700" />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-1 block w-full rounded-md border-gray-300"
                                    autoComplete="new-password"
                                    onChange={(e) => setFormData('password_confirmation', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password_confirmation} className="mt-2" />
                            </div>

                            <div className="flex flex-col items-center gap-4">
                                <Button 
                                    className="w-full bg-green-600 hover:bg-green-700" 
                                    disabled={processing}
                                >
                                    アカウントを作成
                                </Button>

                                <Link
                                    to="/login"
                                    className="text-sm text-gray-600 hover:text-green-600"
                                >
                                    すでにアカウントをお持ちの方はこちら
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
