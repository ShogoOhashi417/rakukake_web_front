import React, { useState } from 'react';
import { X } from 'lucide-react';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import TextInput from './TextInput';
import InputLabel from './InputLabel';
import InputError from './InputError';

export default function BankAccountAddModal({ isOpen, onClose, onSave }) {
    const [formData, setFormData] = useState({
        bankName: '',
        branchName: '',
        balance: ''
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.bankName.trim()) {
            newErrors.bankName = '銀行名を入力してください';
        }
        
        if (!formData.branchName.trim()) {
            newErrors.branchName = '支店名を入力してください';
        }
        
        if (!formData.balance.trim()) {
            newErrors.balance = '金額を入力してください';
        } else if (isNaN(Number(formData.balance)) || Number(formData.balance) < 0) {
            newErrors.balance = '正しい金額を入力してください';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            const bankAccountData = {
                bank_name: formData.bankName.trim(),
                branch_name: formData.branchName.trim(),
                balance: Number(formData.balance)
            };
            
            await onSave(bankAccountData);
            handleClose();
        } catch (error) {
            console.error('銀行口座の追加に失敗しました:', error);
            setErrors({ submit: '銀行口座の追加に失敗しました。もう一度お試しください。' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({
            bankName: '',
            branchName: '',
            balance: ''
        });
        setErrors({});
        setIsSubmitting(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div 
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={handleClose}
            />
            
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div className="flex items-center justify-between p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">
                        銀行口座を追加
                    </h3>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={isSubmitting}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="bankName" value="銀行名" />
                            <TextInput
                                id="bankName"
                                type="text"
                                className="mt-1 block w-full"
                                value={formData.bankName}
                                onChange={(e) => handleInputChange('bankName', e.target.value)}
                                placeholder="例: 三菱UFJ銀行"
                                disabled={isSubmitting}
                            />
                            <InputError message={errors.bankName} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="branchName" value="支店名" />
                            <TextInput
                                id="branchName"
                                type="text"
                                className="mt-1 block w-full"
                                value={formData.branchName}
                                onChange={(e) => handleInputChange('branchName', e.target.value)}
                                placeholder="例: 新宿支店"
                                disabled={isSubmitting}
                            />
                            <InputError message={errors.branchName} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="balance" value="金額" />
                            <TextInput
                                id="balance"
                                type="number"
                                className="mt-1 block w-full"
                                value={formData.balance}
                                onChange={(e) => handleInputChange('balance', e.target.value)}
                                placeholder="0"
                                min="0"
                                step="1"
                                disabled={isSubmitting}
                            />
                            <InputError message={errors.balance} className="mt-2" />
                        </div>

                        {errors.submit && (
                            <InputError message={errors.submit} className="mt-2" />
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <SecondaryButton
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            キャンセル
                        </SecondaryButton>
                        <PrimaryButton
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? '追加中...' : '追加'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    );
}