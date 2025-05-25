import ErrorSuccessMessages from './ErrorSuccessMessages';

interface OtpInputFormProps {
  otp: string;
  setOtp: (otp: string) => void;
  handleOtpSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  error?: string;
  success?: string;
  isLoading: boolean;
  handleBackToPhone: () => void;
}

const OtpInputForm: React.FC<OtpInputFormProps> = ({ 
  otp, 
  setOtp, 
  handleOtpSubmit, 
  error, 
  success, 
  isLoading,
  handleBackToPhone 
}) => (
  <div className="space-y-4 w-80">
    <form onSubmit={handleOtpSubmit} className="space-y-4">
      <div>
        <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
          کد تأیید خود را وارد کنید
        </label>
        <input
          type="text"
          id="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="* * * * * *"
          maxLength={6}
          className="mt-1 block w-full px-3 py-2 border rounded-full bg-light shadow-sm focus:outline-none focus:border-primary"
          required
        />
      </div>
      <ErrorSuccessMessages error={error} success={success} />
      <button
        type="submit"
        className="w-full py-2 px-4 bg-primary text-white rounded-full focus:outline-none"
        disabled={isLoading}
      >
        تأیید کد
      </button>
    </form>
    <button
      onClick={handleBackToPhone}
      className="w-full text-sm text-indigo-600 hover:text-indigo-800 focus:outline-none"
      disabled={isLoading}
    >
      تغییر شماره موبایل
    </button>
  </div>
);

export default OtpInputForm;