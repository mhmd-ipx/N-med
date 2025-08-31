import { useState } from 'react';
import { HiOutlineCreditCard, HiOutlineCheckCircle, HiOutlineX, HiOutlineExclamationCircle } from 'react-icons/hi';
import axios from 'axios';

// Add custom animations for loading dots
const style = document.createElement('style');
style.textContent = `
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
  .animate-bounce {
    animation: bounce 1.4s infinite ease-in-out both;
  }
  .animation-delay-100 {
    animation-delay: -0.16s;
  }
  .animation-delay-200 {
    animation-delay: -0.32s;
  }
`;
document.head.appendChild(style);

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: number;
  amount: number;
  serviceTitle?: string;
  doctorName?: string;
  appointmentDate?: string;
  appointmentTime?: string;
}

interface PaymentResponse {
  success: boolean;
  url?: string;
  message?: string;
}

const PaymentModal = ({
  isOpen,
  onClose,
  appointmentId,
  amount,
  serviceTitle,
  doctorName,
  appointmentDate,
  appointmentTime
}: PaymentModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await axios.post<PaymentResponse>(
        'https://api.niloudarman.ir/api/payment/request',
        {
          amount: amount,
          appointment_id: appointmentId
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authData') ? JSON.parse(localStorage.getItem('authData')!).token : ''}`
          }
        }
      );

      if (response.data.success && response.data.url) {
        // Show processing modal for 2 seconds then redirect
        setTimeout(() => {
          window.location.href = response.data.url!;
        }, 2000);
      } else {
        setError(response.data.message || 'خطا در ایجاد درخواست پرداخت');
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error('Payment request error:', err);
      setError(err.response?.data?.message || 'خطا در اتصال به سرور پرداخت');
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Success Modal */}
      {!isProcessing && !error && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl max-w-lg w-full mx-4 shadow-2xl border border-gray-100 max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <HiOutlineCheckCircle className="text-white text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">نوبت رزرو شد!</h2>
                    <p className="text-emerald-100 text-sm">مرحله نهایی: پرداخت</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200"
                >
                  <HiOutlineX className="text-white text-lg" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[60vh]">
              {/* Success Message */}
              <div className="p-6 text-center bg-gradient-to-b from-emerald-50 to-white">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <HiOutlineCheckCircle className="text-white text-4xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  نوبت شما با موفقیت رزرو شد
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  برای تکمیل فرآیند رزرو، لطفاً پرداخت را انجام دهید
                </p>
              </div>

              {/* Appointment Details */}
              <div className="px-6 pb-4">
                <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-5 border border-gray-100">
                  <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    جزئیات نوبت
                  </h4>
                  <div className="space-y-3">
                    {serviceTitle && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <span className="text-gray-600 font-medium">خدمت:</span>
                        <span className="font-semibold text-gray-800">{serviceTitle}</span>
                      </div>
                    )}
                    {doctorName && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <span className="text-gray-600 font-medium">پزشک:</span>
                        <span className="font-semibold text-gray-800">{doctorName}</span>
                      </div>
                    )}
                    {appointmentDate && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <span className="text-gray-600 font-medium">تاریخ:</span>
                        <span className="font-semibold text-gray-800">{appointmentDate}</span>
                      </div>
                    )}
                    {appointmentTime && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <span className="text-gray-600 font-medium">ساعت:</span>
                        <span className="font-semibold text-gray-800">{appointmentTime}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl px-3 mt-4">
                      <span className="text-gray-700 font-bold">مبلغ کل:</span>
                      <span className="font-bold text-2xl text-blue-600">
                        {amount.toLocaleString()} تومان
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* VPN Warning */}
              <div className="px-6 pb-4">
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <HiOutlineExclamationCircle className="text-amber-600 text-lg" />
                    </div>
                    <div>
                      <h4 className="font-bold text-amber-800 mb-1">نکته مهم</h4>
                      <p className="text-amber-700 text-sm leading-relaxed">
                        اگر از VPN استفاده می‌کنید، لطفاً آن را خاموش کنید تا فرآیند پرداخت به درستی انجام شود.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Button - Fixed at bottom */}
            <div className="p-6 bg-white border-t border-gray-100">
              <button
                onClick={handlePayment}
                className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl shadow-lg flex items-center justify-center gap-3 group"
              >
                <HiOutlineCreditCard className="text-xl group-hover:scale-110 transition-transform duration-200" />
                پرداخت امن {amount.toLocaleString()} تومان
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Processing Modal */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl max-w-sm w-full mx-4 shadow-2xl border border-gray-100">
            <div className="p-8 text-center">
              {/* Animated Loading Icon */}
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto animate-ping opacity-20"></div>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-3">
                در حال انتقال به درگاه پرداخت
              </h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                لطفاً صبر کنید، اتصال شما ایمن است...
              </p>

              {/* Enhanced Loading Dots */}
              <div className="flex justify-center items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce animation-delay-100"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce animation-delay-200"></div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6 bg-gray-200 rounded-full h-1 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full animate-pulse w-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {error && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl max-w-md w-full mx-4 shadow-2xl border border-gray-100 max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-red-500 to-rose-600 p-6 text-white">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <HiOutlineExclamationCircle className="text-white text-2xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">خطا در پرداخت</h2>
                  <p className="text-red-100 text-sm">لطفاً دوباره تلاش کنید</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl p-5 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <HiOutlineExclamationCircle className="text-red-600 text-lg" />
                  </div>
                  <div>
                    <h4 className="font-bold text-red-800 mb-2">مشکل در پردازش پرداخت</h4>
                    <p className="text-red-700 text-sm leading-relaxed">{error}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setError(null);
                    setIsProcessing(false);
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-2xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-3 group"
                >
                  <HiOutlineCreditCard className="text-lg group-hover:scale-110 transition-transform duration-200" />
                  تلاش مجدد
                </button>

                <button
                  onClick={onClose}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-2xl font-medium hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  بازگشت به نوبت‌ها
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentModal;