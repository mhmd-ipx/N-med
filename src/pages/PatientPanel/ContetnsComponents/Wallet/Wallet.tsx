import React, { useEffect, useState } from 'react';
import { getWalletBalance, getWalletTransactions, type WalletBalanceResponse, type WalletTransactionsResponse, type Transaction } from '../../../../services/walletApi';
import { FaWallet, FaMoneyBillWave, FaHistory, FaEye, FaArrowUp, FaArrowDown, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';

const Wallet: React.FC = () => {
  const [balance, setBalance] = useState<WalletBalanceResponse['data'] | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions'>('overview');

  // Filter states for transactions
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchWalletData();
  }, []);

  useEffect(() => {
    if (activeTab === 'transactions') {
      fetchTransactions();
    }
  }, [currentPage, activeTab]);

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

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { icon: <FaCheckCircle />, color: 'text-green-600', text: 'تکمیل شده' };
      case 'pending':
        return { icon: <FaExclamationTriangle />, color: 'text-yellow-600', text: 'در حال انتظار' };
      case 'failed':
        return { icon: <FaTimesCircle />, color: 'text-red-600', text: 'ناموفق' };
      default:
        return { icon: <FaTimesCircle />, color: 'text-gray-600', text: 'نامشخص' };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <FaArrowUp className="text-green-600" />;
      case 'withdraw':
        return <FaArrowDown className="text-red-600" />;
      default:
        return <FaMoneyBillWave className="text-gray-600" />;
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (!balance) {
      return (
        <div className="text-center py-8 text-gray-500">
          <FaWallet className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">اطلاعات کیف پول یافت نشد</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <FaWallet />
                موجودی کیف پول
              </h3>
              <p className="text-3xl font-bold">{balance.formatted_balance}</p>
            </div>
            <FaWallet className="h-16 w-16 opacity-80" />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
            <FaHistory />
            تراکنش‌های اخیر
          </h3>
          {transactions.slice(0, 5).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FaHistory className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>هیچ تراکنشی یافت نشد</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction) => {
                const statusInfo = getStatusInfo(transaction.status);
                return (
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
                      <div className={`flex items-center gap-1 ${statusInfo.color}`}>
                        {statusInfo.icon}
                        <span className="text-sm">{statusInfo.text}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (transactions.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <FaHistory className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">هیچ تراکنشی یافت نشد</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نوع تراکنش</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">همه وضعیت‌ها</option>
                <option value="completed">تکمیل شده</option>
                <option value="pending">در حال انتظار</option>
                <option value="failed">ناموفق</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FaHistory className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">هیچ تراکنشی مطابق فیلترها یافت نشد</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTransactions.map((transaction) => {
              const statusInfo = getStatusInfo(transaction.status);
              return (
                <div key={transaction.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(transaction.type)}
                      <h4 className="font-semibold text-gray-800">{translateType(transaction.type)}</h4>
                    </div>
                    <div className={`flex items-center gap-1 ${statusInfo.color}`}>
                      {statusInfo.icon}
                      <span className="text-sm">{statusInfo.text}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-500">مبلغ:</p>
                      <p className={`font-semibold text-lg ${transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'deposit' ? '+' : '-'}{formatAmount(transaction.amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">توضیحات:</p>
                      <p className="font-medium">{transaction.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-500" />
                      <span>تاریخ: {formatDate(transaction.created_at)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => openModal(transaction)}
                    className="w-full mt-4 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaEye />
                    مشاهده جزئیات
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => prev - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                قبلی
              </button>
              <span className="px-4 py-2 bg-gray-100 rounded-lg">
                صفحه {currentPage} از {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                بعدی
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="px-4 min-h-screen" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaWallet />
            کیف پول
          </h2>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
            <FaTimesCircle />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
            <FaCheckCircle />
            {success}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              نمای کلی
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'transactions'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              تراکنش‌ها
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'transactions' && renderTransactions()}

        {/* Transaction Details Modal */}
        {isModalOpen && selectedTransaction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl relative max-h-[90vh] overflow-hidden">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
                onClick={closeModal}
              >
                <FaTimesCircle className="h-6 w-6" />
              </button>
              <div className="max-h-[90vh] overflow-y-auto p-8">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 flex items-center justify-center gap-2">
                  <FaEye />
                  جزئیات تراکنش
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                      <FaMoneyBillWave className="text-primary" />
                      <div>
                        <span className="font-semibold text-gray-700">نوع تراکنش:</span>{" "}
                        <span className="text-gray-600 flex items-center gap-1">
                          {getTypeIcon(selectedTransaction.type)}
                          {translateType(selectedTransaction.type)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                      <FaWallet className="text-primary" />
                      <div>
                        <span className="font-semibold text-gray-700">مبلغ:</span>{" "}
                        <span className={`font-semibold ${selectedTransaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedTransaction.type === 'deposit' ? '+' : '-'}{formatAmount(selectedTransaction.amount)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                      <FaHistory className="text-primary" />
                      <div>
                        <span className="font-semibold text-gray-700">توضیحات:</span>{" "}
                        <span className="text-gray-600">{selectedTransaction.description}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                      <FaCheckCircle className="text-primary" />
                      <div>
                        <span className="font-semibold text-gray-700">وضعیت:</span>{" "}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusInfo(selectedTransaction.status).color}`}>
                          {getStatusInfo(selectedTransaction.status).icon}
                          {translateStatus(selectedTransaction.status)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                      <FaCalendarAlt className="text-primary" />
                      <div>
                        <span className="font-semibold text-gray-700">تاریخ ایجاد:</span>{" "}
                        <span className="text-gray-600">{formatDate(selectedTransaction.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                      <FaCalendarAlt className="text-primary" />
                      <div>
                        <span className="font-semibold text-gray-700">تاریخ بروزرسانی:</span>{" "}
                        <span className="text-gray-600">{formatDate(selectedTransaction.updated_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={closeModal}
                    className="px-8 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    بستن
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;