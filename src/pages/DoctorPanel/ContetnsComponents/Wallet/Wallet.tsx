import React, { useEffect, useState } from 'react';
import { getWalletBalance, getWalletTransactions, type WalletBalanceResponse, type WalletTransactionsResponse, type Transaction } from '../../../../services/walletApi';
import Button from '../../../../components/ui/Button/Button';
import Tabs from '../../../../components/ui/Tabs/Tabs';
import {
  HiCurrencyDollar,
  HiDocumentText,
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiArrowUp,
  HiArrowDown,
  HiEye,
  HiExclamationTriangle
} from 'react-icons/hi2';

const Wallet: React.FC = () => {
  const [balance, setBalance] = useState<WalletBalanceResponse['data'] | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter states for transactions
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchWalletData();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [currentPage]);

  const fetchWalletData = async () => {
    setLoading(true);
    try {
      const balanceResponse = await getWalletBalance();
      setBalance(balanceResponse.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطایی رخ داده است');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const transactionsResponse = await getWalletTransactions(currentPage);
      setTransactions(transactionsResponse.data.transactions);
      setTotalPages(transactionsResponse.data.last_page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطایی رخ داده است');
    }
  };

  const translateType = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'شارژ';
      case 'withdraw':
        return 'برداشت';
      default:
        return type;
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return 'تکمیل شده';
      case 'pending':
        return 'در حال انتظار';
      case 'failed':
        return 'ناموفق';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-800 border border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <HiCheckCircle className="h-4 w-4" />;
      case 'pending':
        return <HiExclamationTriangle className="h-4 w-4" />;
      case 'failed':
        return <HiXCircle className="h-4 w-4" />;
      default:
        return <HiXCircle className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <HiArrowUp className="h-4 w-4 text-green-600" />;
      case 'withdraw':
        return <HiArrowDown className="h-4 w-4 text-red-600" />;
      default:
        return <HiDocumentText className="h-4 w-4" />;
    }
  };

  const openModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  };

  const renderOverview = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!balance) {
      return (
        <div className="text-center py-12">
          <HiCurrencyDollar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-lg">اطلاعات کیف پول یافت نشد</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium mb-2">موجودی کیف پول</h3>
              <p className="text-3xl font-bold">{balance.formatted_balance}</p>
            </div>
            <HiCurrencyDollar className="h-16 w-16 opacity-80" />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <HiDocumentText className="h-5 w-5 text-blue-600" />
            تراکنش‌های اخیر
          </h3>
          {transactions.slice(0, 5).length === 0 ? (
            <p className="text-gray-500 text-center py-8">هیچ تراکنشی یافت نشد</p>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(transaction.type)}
                    <div>
                      <p className="font-medium text-gray-800">{transaction.description}</p>
                      <p className="text-sm text-gray-600">{formatDate(transaction.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className={`font-semibold ${transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'deposit' ? '+' : '-'}{formatAmount(transaction.amount)}
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(transaction.status)}`}>
                      {getStatusIcon(transaction.status)}
                      {translateStatus(transaction.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTransactions = () => {
    // Apply filters
    let filteredTransactions = transactions;

    if (typeFilter) {
      filteredTransactions = filteredTransactions.filter(t => t.type === typeFilter);
    }

    if (statusFilter) {
      filteredTransactions = filteredTransactions.filter(t => t.status === statusFilter);
    }

    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (transactions.length === 0) {
      return (
        <div className="text-center py-12">
          <HiDocumentText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-lg">هیچ تراکنشی یافت نشد</p>
        </div>
      );
    }

    return (
      <div>
        {/* Filters */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نوع تراکنش</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">همه انواع</option>
                <option value="deposit">شارژ</option>
                <option value="withdraw">برداشت</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">وضعیت</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">همه وضعیت‌ها</option>
                <option value="completed">تکمیل شده</option>
                <option value="pending">در حال انتظار</option>
                <option value="failed">ناموفق</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <HiDocumentText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">هیچ تراکنشی مطابق فیلترها یافت نشد</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-right font-medium text-gray-700">نوع</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-700">مبلغ</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-700">توضیحات</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-700">وضعیت</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-700">تاریخ</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-700">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(transaction.type)}
                        <span className="font-medium text-gray-800">{translateType(transaction.type)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'deposit' ? '+' : '-'}{formatAmount(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700">{transaction.description}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(transaction.status)}`}>
                        {getStatusIcon(transaction.status)}
                        {translateStatus(transaction.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600 text-sm">
                        {formatDate(transaction.created_at)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        size="sm"
                        variant="outline"
                        icon={<HiEye />}
                        onClick={() => openModal(transaction)}
                        className="hover:bg-blue-50 hover:border-blue-300"
                      >
                        مشاهده
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                قبلی
              </Button>
              <span className="px-3 py-2 bg-gray-100 rounded-md">
                صفحه {currentPage} از {totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                بعدی
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const tabs = [
    {
      id: 'overview',
      label: 'نمای کلی',
      icon: <HiCurrencyDollar className="h-5 w-5" />,
      content: renderOverview()
    },
    {
      id: 'transactions',
      label: 'تراکنش‌ها',
      icon: <HiDocumentText className="h-5 w-5" />,
      content: renderTransactions()
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
          <HiXCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
          <HiCheckCircle className="h-5 w-5" />
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <Tabs tabs={tabs} />
      </div>

      {/* Transaction Details Modal */}
      {isModalOpen && selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl relative max-h-[90vh] overflow-hidden">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
              onClick={closeModal}
            >
              <HiXCircle className="h-6 w-6" />
            </button>
            <div className="max-h-[90vh] overflow-y-auto p-8">
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 flex items-center justify-center gap-2">
                <HiEye className="h-6 w-6 text-blue-600" />
                جزئیات تراکنش
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                    <HiDocumentText className="h-5 w-5 text-blue-500" />
                    <div>
                      <span className="font-semibold text-gray-700">نوع تراکنش:</span>{" "}
                      <span className="text-gray-600 flex items-center gap-1">
                        {getTypeIcon(selectedTransaction.type)}
                        {translateType(selectedTransaction.type)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                    <HiCurrencyDollar className="h-5 w-5 text-blue-500" />
                    <div>
                      <span className="font-semibold text-gray-700">مبلغ:</span>{" "}
                      <span className={`font-semibold ${selectedTransaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedTransaction.type === 'deposit' ? '+' : '-'}{formatAmount(selectedTransaction.amount)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                    <HiDocumentText className="h-5 w-5 text-blue-500" />
                    <div>
                      <span className="font-semibold text-gray-700">توضیحات:</span>{" "}
                      <span className="text-gray-600">{selectedTransaction.description}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                    <HiCheckCircle className="h-5 w-5 text-blue-500" />
                    <div>
                      <span className="font-semibold text-gray-700">وضعیت:</span>{" "}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(selectedTransaction.status)}`}>
                        {getStatusIcon(selectedTransaction.status)}
                        {translateStatus(selectedTransaction.status)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                    <HiClock className="h-5 w-5 text-blue-500" />
                    <div>
                      <span className="font-semibold text-gray-700">تاریخ ایجاد:</span>{" "}
                      <span className="text-gray-600">{formatDate(selectedTransaction.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                    <HiClock className="h-5 w-5 text-blue-500" />
                    <div>
                      <span className="font-semibold text-gray-700">تاریخ بروزرسانی:</span>{" "}
                      <span className="text-gray-600">{formatDate(selectedTransaction.updated_at)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  icon={<HiXCircle />}
                  onClick={closeModal}
                  className="px-8"
                >
                  بستن
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;