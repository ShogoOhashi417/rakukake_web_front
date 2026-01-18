import React, { useState } from "react";
import AuthenticatedLayout from "../../components/AuthenticatedLayout";
import BankAccountCard from "../../components/BankAccountCard";
import BankAccountAddModal from "../../components/BankAccountAddModal";
import BankAccountEditModal from "../../components/BankAccountEditModal";
import { Building2, Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useBankAccounts, useAddBankAccount, useUpdateBankAccount, useDeleteBankAccount } from "../../hooks/useBankAccounts";

export default function Bank() {
    const { data: bankAccounts = [], isLoading, error, refetch } = useBankAccounts();
    const addBankAccountMutation = useAddBankAccount();
    const updateBankAccountMutation = useUpdateBankAccount();
    const deleteBankAccountMutation = useDeleteBankAccount();
    
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);

    const handleEditAccount = (account) => {
        setSelectedAccount(account);
        setIsEditModalOpen(true);
    };

    const handleDeleteAccount = async (accountId) => {
        try {
            await deleteBankAccountMutation.mutateAsync(accountId);
        } catch (error) {
        }
    };

    const handleAddAccount = () => {
        setIsAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedAccount(null);
    };

    const handleSaveBankAccount = async (bankAccountData) => {
        try {
            await addBankAccountMutation.mutateAsync(bankAccountData);
            setIsAddModalOpen(false);
        } catch (error) {
            throw error;
        }
    };

    const handleUpdateBankAccount = async (accountId, bankAccountData) => {
        try {
            await updateBankAccountMutation.mutateAsync({ accountId, bankAccountData });
            setIsEditModalOpen(false);
            setSelectedAccount(null);
        } catch (error) {
            throw error;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    銀行口座管理
                </h2>
            }
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900">
                                    登録済み銀行口座
                                </h3>
                                <Button 
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={handleAddAccount}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    口座を追加
                                </Button>
                            </div>

                            {isLoading ? (
                                <div className="flex justify-center items-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-500"></div>
                                </div>
                            ) : error ? (
                                <div className="text-center py-12">
                                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-red-800">
                                                    エラーが発生しました
                                                </h3>
                                                <div className="mt-2 text-sm text-red-700">
                                                    <p>{error?.message || "銀行口座データの取得に失敗しました。"}</p>
                                                </div>
                                                <div className="mt-4">
                                                    <button
                                                        type="button"
                                                        className="bg-red-100 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                        onClick={() => refetch()}
                                                    >
                                                        再読み込み
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : bankAccounts.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {bankAccounts.map((account) => (
                                        <BankAccountCard
                                            key={account.id}
                                            account={account}
                                            onEdit={handleEditAccount}
                                            onDelete={handleDeleteAccount}
                                            showActions={true}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                                        銀行口座が登録されていません
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        最初の銀行口座を登録してみましょう。
                                    </p>
                                    <div className="mt-6">
                                        <Button 
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                            onClick={handleAddAccount}
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            口座を追加
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            <BankAccountAddModal
                isOpen={isAddModalOpen}
                onClose={handleCloseAddModal}
                onSave={handleSaveBankAccount}
            />
            
            <BankAccountEditModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                onSave={handleUpdateBankAccount}
                bankAccount={selectedAccount}
            />
        </AuthenticatedLayout>
    );
}