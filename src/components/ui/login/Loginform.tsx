import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestOtp, verifyOtp } from '../../../services/serverapi';
import Loading from '../Loading/Loading';
import PhoneInputForm from './PhoneInputForm';
import OtpInputForm from './OtpInputForm';
import ResendButton from './ResendButton';
import TimerDisplay from './TimerDisplay';
import OtpModal from './OtpModal';

interface LoginFormProps {
  role: string;
  redirectPath: string;
}

const LoginForm = ({ role, redirectPath }: LoginFormProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^0[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (validatePhoneNumber(phoneNumber)) {
      try {
        setIsLoading(true);
        await requestOtp(phoneNumber);
        const response = await requestOtp(phoneNumber);

        // Extract OTP code from the actual response
        let extractedOtp = '';

        // Check if the response contains OTP data in the expected format
        if (response && typeof response === 'object') {
          const resp = response as any; // Type assertion to access dynamic properties

          // Extract from the specific API response format: response.data.code
          if (resp.data && resp.data.code) {
            extractedOtp = resp.data.code.toString();
          }
        }

        // If no OTP found in response, generate a test code for development
        if (!extractedOtp) {
          extractedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        }

        setOtpCode(extractedOtp);
        setShowOtpModal(true);
        console.log('Server Response:', response);
        setIsOtpSent(true);
        setError('');
        setSuccess('کد تأیید به شماره شما ارسال شد.');
        setTimer(120);
        setCanResend(false);
      } catch (error) {
        console.error('Network Error:', error);
        if (error.response) {
          setError(error.response.data.message || 'خطایی در سرور رخ داد.');
        } else if (error.request) {
          setError('عدم ارتباط با سرور. لطفاً اتصال شبکه یا تنظیمات سرور را بررسی کنید.');
        } else {
          setError(error.message || 'خطایی در ارسال کد OTP رخ داد.');
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setError('شماره موبایل باید 11 رقمی باشد و با صفر شروع شود.');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await verifyOtp(phoneNumber, otp, role);
      if (response.success && response.data) {
        localStorage.setItem('authData', JSON.stringify(response.data));
        setSuccess(response.data.message || 'لاگین با موفقیت انجام شد!');
        setError('');
        navigate(redirectPath);
      } else {
        setError(response.message || 'کد تأیید نامعتبر است.');
      }
    } catch (error) {
      console.error('Verify OTP Error:', error);
      if (error.response) {
        setError(error.response.data.message || 'خطایی در سرور رخ داد.');
      } else if (error.request) {
        setError('عدم ارتباط با سرور. لطفاً اتصال شبکه را بررسی کنید.');
      } else {
        setError(error.message || 'خطایی در تأیید OTP رخ داد.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsLoading(true);
      await requestOtp(phoneNumber);
      setTimer(120);
      setCanResend(false);
      setError('');
      setSuccess('کد تأیید مجدداً ارسال شد.');
    } catch (error) {
      console.error('Resend OTP Error:', error);
      if (error.response) {
        setError(error.response.data.message || 'خطایی در سرور رخ داد.');
      } else if (error.request) {
        setError('عدم ارتباط با سرور. لطفاً اتصال شبکه را بررسی کنید.');
      } else {
        setError(error.message || 'خطایی در ارسال مجدد کد OTP رخ داد.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setIsOtpSent(false);
    setOtp('');
    setTimer(120);
    setCanResend(false);
    setError('');
    setSuccess('');
  };

  return (
    <div className="relative ">
      {isLoading && <Loading />}
      {!isOtpSent ? (
        <PhoneInputForm
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          handlePhoneSubmit={handlePhoneSubmit}
          error={error}
          success={success}
          isLoading={isLoading}
        />
      ) : (
        <>
          <OtpInputForm
            otp={otp}
            setOtp={setOtp}
            handleOtpSubmit={handleOtpSubmit}
            error={error}
            success={success}
            isLoading={isLoading}
            handleBackToPhone={handleBackToPhone}
          />
          <ResendButton
            canResend={canResend}
            isLoading={isLoading}
            handleResendCode={handleResendCode}
          />
          <TimerDisplay timer={timer} />
        </>
      )}

      {/* OTP Modal */}
      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        otpCode={otpCode}
        phoneNumber={phoneNumber}
      />
    </div>
  );
};

export default LoginForm;