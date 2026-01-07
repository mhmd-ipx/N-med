import React, { useState } from 'react';
import { HiOutlineXMark, HiOutlineCurrencyDollar } from 'react-icons/hi2';
import { createWithdrawalRequest } from '../../services/walletApi';
import type { CreateWithdrawalRequest } from '../../services/walletApi';

interface WithdrawalRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentBalance: number;
    onSuccess: () => void;
}

const WithdrawalRequestModal: React.FC<WithdrawalRequestModalProps> = ({
    isOpen,
    onClose,
    currentBalance,
    onSuccess,
}) => {
    const [description, setDescription] = useState('برداشت از کیف پول');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const requestData: CreateWithdrawalRequest = {
                amount: currentBalance,
                description: description.trim() || 'برداشت از کیف پول',
            };

            await createWithdrawalRequest(requestData);
            onSuccess();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'خطا در ثبت درخواست');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-xl bg-white shadow-2xl relative">
                <button
                    className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    <HiOutlineXMark className="h-6 w-6" />
                </button>

                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 text-right mb-6">
                        درخواست برداشت از کیف پول
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
                        {/* نمایش موجودی فعلی */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">مبلغ درخواست برداشت:</span>
                                <div className="flex items-center gap-2">
                                    <HiOutlineCurrencyDollar className="text-blue-600" />
                                    <span className="text-lg font-bold text-blue-600">
                                        {new Intl.NumberFormat('fa-IR').format(currentBalance)} تومان
                                    </span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                کل موجودی کیف پول شما درخواست برداشت خواهد شد
                            </p>
                        </div>

                        {/* توضیحات */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                توضیحات (اختیاری)
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={3}
                                placeholder="توضیحات درخواست برداشت..."
                            />
                        </div>

                        {/* نمایش خطا */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* دکمه‌ها */}
                        <div className="flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                disabled={isSubmitting}
                            >
                                انصراف
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
                                disabled={isSubmitting || currentBalance <= 0}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        در حال ثبت...
                                    </>
                                ) : (
                                    'ثبت درخواست'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default WithdrawalRequestModal;
