type ResendButtonProps = {
  canResend: boolean;
  isLoading: boolean;
  handleResendCode: () => void;
};

const ResendButton = ({ canResend, isLoading, handleResendCode }: ResendButtonProps) => (
  canResend && (
    <button
      onClick={handleResendCode}
      className="w-full py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
      disabled={isLoading}
    >
      ارسال مجدد کد
    </button>
  )
);

export default ResendButton;