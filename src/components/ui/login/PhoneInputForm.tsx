import ErrorSuccessMessages from './ErrorSuccessMessages';

interface PhoneInputFormProps {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  handlePhoneSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  error?: string;
  success?: string;
  isLoading: boolean;
}

const PhoneInputForm: React.FC<PhoneInputFormProps> = ({ 
  phoneNumber, 
  setPhoneNumber, 
  handlePhoneSubmit, 
  error, 
  success, 
  isLoading 
}) => {
  const handlePhoneChange = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    if (/^\d{0,11}$/.test(value)) {
      setPhoneNumber(value);
    }
  };

  return (
    <form onSubmit={handlePhoneSubmit} className="space-y-4 w-80">
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          شماره تماس خود را وارد کنید
        </label>
        <input
          type="tel"
          id="phone"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder="09138579706"
          className={`mt-1 block w-full px-3 py-2 border rounded-full bg-light shadow-sm focus:outline-none focus:border-primary ${
            error ? 'border-red-500' : ''
          } `}
          maxLength={11}
          inputMode="numeric"
          required
        />
      </div>
      <ErrorSuccessMessages error={error} success={success} />
      <button
        type="submit"
        className="w-full py-2 px-4 bg-primary text-white rounded-full focus:outline-none"
        disabled={isLoading}
      >
        ورود / ثبت نام
      </button>
    </form>
  );
};

export default PhoneInputForm;