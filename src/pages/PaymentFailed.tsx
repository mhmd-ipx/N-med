import { useSearchParams, Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const message = searchParams.get('message') || 'پرداخت ناموفق بود.';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">پرداخت ناموفق</h1>
          <p className="text-gray-600">{message}</p>
        </div>

        <div className="space-y-3">
          <Link to="/">
            <Button variant="outline" className="w-full">
              بازگشت به خانه
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;