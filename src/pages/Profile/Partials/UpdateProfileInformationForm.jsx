import React, { useState } from 'react';
import InputError from '../../../components/InputError';
import InputLabel from '../../../components/InputLabel';
import TextInput from '../../../components/TextInput';
import userService from '../../../api/services/userService';

export default function UpdateProfileInformation({ user, className = '' }) {
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
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
            await userService.updateProfile(formData);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2000);
        } catch (error) {
            console.error('Update failed:', error);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: 'プロフィールの更新に失敗しました。' });
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">プロフィール情報</h2>
                <p className="mt-1 text-sm text-gray-600">
                    アカウントのプロフィール情報とメールアドレスを更新します。
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="名前" />
                    <TextInput
                        id="name"
                        name="name"
                        className="mt-1 block w-full"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        autoComplete="name"
                    />
                    <InputError message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="メールアドレス" />
                    <TextInput
                        id="email"
                        name="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="username"
                    />
                    <InputError message={errors.email} />
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
