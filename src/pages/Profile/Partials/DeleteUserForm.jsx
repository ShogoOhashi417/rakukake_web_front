import React, { useState } from 'react';
import InputError from '../../../components/InputError';
import InputLabel from '../../../components/InputLabel';
import TextInput from '../../../components/TextInput';
import userService from '../../../api/services/userService';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        setPassword('');
        setError('');
    };

    const deleteUser = async (e) => {
        e.preventDefault();
        setProcessing(true);
        
        try {
            await userService.deleteAccount({ password });
            // Redirect to login or home page after successful deletion
            window.location.href = '/login';
        } catch (error) {
            console.error('Account deletion failed:', error);
            setError('パスワードが正しくないか、アカウント削除中にエラーが発生しました。');
            setPassword('');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">アカウント削除</h2>
                <p className="mt-1 text-sm text-gray-600">
                    アカウントを削除すると、すべてのデータが完全に削除されます。削除前に必要なデータをダウンロードしてください。
                </p>
            </header>

            <button
                type="button"
                className="mt-6 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                onClick={confirmUserDeletion}
            >
                アカウントを削除
            </button>

            {confirmingUserDeletion && (
                <div className="fixed inset-0 overflow-y-auto px-4 py-6 sm:px-0 z-50">
                    <div className="fixed inset-0 transform transition-all bg-gray-500 bg-opacity-75"></div>

                    <div className="mb-6 bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full sm:max-w-md mx-auto mt-16">
                        <form onSubmit={deleteUser} className="p-6">
                            <h2 className="text-lg font-medium text-gray-900">
                                本当にアカウントを削除しますか？
                            </h2>

                            <p className="mt-1 text-sm text-gray-600">
                                アカウントを削除すると、すべてのデータが完全に削除されます。パスワードを入力して、アカウントを削除することを確認してください。
                            </p>

                            <div className="mt-6">
                                <InputLabel htmlFor="password" value="パスワード" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full"
                                    autoFocus
                                    required
                                />
                                {error && <InputError message={error} />}
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 mr-3"
                                    onClick={closeModal}
                                >
                                    キャンセル
                                </button>

                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    disabled={processing}
                                >
                                    アカウントを削除
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
