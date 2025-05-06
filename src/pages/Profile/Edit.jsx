import React, { useEffect, useState } from 'react';
import userService from '../../api/services/userService';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import DeleteUserForm from './Partials/DeleteUserForm';
import AuthenticatedLayout from '../../components/AuthenticatedLayout';
export default function Edit() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await userService.getProfile();
                setUser(userData);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch user:', err);
                setError('ユーザー情報の取得に失敗しました');
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!user) return <div>ユーザーデータがありません</div>;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    CSV一括処理
                </h2>
            }
        >
            {/* <Header title="プロフィール" /> */}

            <div className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdateProfileInformationForm 
                            user={user}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
