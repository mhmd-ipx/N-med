interface ErrorSuccessMessagesProps {
  error?: string;
  success?: string;
}

const ErrorSuccessMessages = ({ error, success }: ErrorSuccessMessagesProps) => (
  <>
    {error && <p className="text-red-500 text-sm">{error}</p>}
    {success && <p className="text-green-500 text-sm">{success}</p>}
  </>
);

export default ErrorSuccessMessages;