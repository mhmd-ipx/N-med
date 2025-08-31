import React, { useState } from 'react';
import { HiOutlineX, HiOutlineClipboard, HiOutlineCheck } from 'react-icons/hi';

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  otpCode: string;
  phoneNumber: string;
}

const OtpModal: React.FC<OtpModalProps> = ({ isOpen, onClose, otpCode, phoneNumber }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(otpCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-lg sm:text-xl">📱</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">کد تأیید</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <HiOutlineX className="text-lg sm:text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <div className="text-center mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-2xl sm:text-3xl">✅</span>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
              کد تأیید ارسال شد
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm mb-4">
              کد به شماره <span className="font-medium text-gray-800">{phoneNumber}</span> ارسال شد
            </p>
          </div>

          {/* OTP Code Display */}
          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-600 mb-2">کد تأیید شما:</p>
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 tracking-wider mb-4">
                {otpCode}
              </div>
              <button
                onClick={copyToClipboard}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 mx-auto ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {copied ? (
                  <>
                    <HiOutlineCheck className="text-sm" />
                    کپی شد!
                  </>
                ) : (
                  <>
                    <HiOutlineClipboard className="text-sm" />
                    کپی کد
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex items-start gap-2 sm:gap-3">
              <span className="text-yellow-600 text-sm sm:text-base mt-0.5">💡</span>
              <div>
                <h4 className="font-semibold text-yellow-800 mb-1 text-sm sm:text-base">نکته</h4>
                <p className="text-yellow-700 text-xs sm:text-sm">
                  این کد برای تست برنامه نمایش داده شده است. در نسخه نهایی از طریق پیامک ارسال خواهد شد.
                </p>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-200"
          >
            متوجه شدم
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;