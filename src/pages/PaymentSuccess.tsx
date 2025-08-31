import { useSearchParams, Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const refId = searchParams.get('ref_id');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">پرداخت موفق</h1>
          <p className="text-gray-600">پرداخت شما با موفقیت انجام شد.</p>
        </div>

        {refId && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-500 mb-1">شناسه تراکنش:</p>
            <p className="font-mono text-lg font-semibold text-gray-900">{refId}</p>
          </div>
        )}

        <div className="space-y-3">
          <Link to="/">
            <Button variant="outline" className="w-full">
              بازگشت به خانه
            </Button>
          </Link>
          <Link to="/UserProfile">
            <Button variant="solid" className="w-full">
              مشاهده پنل کاربری
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;