import React, { useState } from 'react';
import InputError from '../../../components/InputError';
import InputLabel from '../../../components/InputLabel';
import TextInput from '../../../components/TextInput';
import userService from '../../../api/services/userService';

export default function UpdatePasswordForm({ className = '' }) {
    const [formData, setFormData] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        
        try {
            await userService.updatePassword(formData);
            setFormData({
                current_password: '',
                password: '',
                password_confirmation: '',
            });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2000);
        } catch (error) {
            console.error('Password update failed:', error);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: 'パスワードの更新に失敗しました。' });
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">パスワード更新</h2>
                <p className="mt-1 text-sm text-gray-600">
                    アカウントのセキュリティを保つため、長くランダムなパスワードを使用してください。
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="current_password" value="現在のパスワード" />
                    <TextInput
                        id="current_password"
                        name="current_password"
                        type="password"
                        className="mt-1 block w-full"
                        value={formData.current_password}
                        onChange={handleChange}
                        autoComplete="current-password"
                    />
                    <InputError message={errors.current_password} />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="新しいパスワード" />
                    <TextInput
                        id="password"
                        name="password"
                        type="password"
                        className="mt-1 block w-full"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password} />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="新しいパスワード（確認）" />
                    <TextInput
                        id="password_confirmation"
                        name="password_confirmation"
                        type="password"
                        className="mt-1 block w-full"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password_confirmation} />
                </div>

                {errors.general && (
                    <div className="text-red-600">{errors.general}</div>
                )}

                <div className="flex items-center gap-4">
                    <button 
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        disabled={processing}
                    >
                        保存
                    </button>

                    {success && (
                        <p className="text-sm text-green-600">保存しました。</p>
                    )}
                </div>
            </form>
        </section>
    );
}
