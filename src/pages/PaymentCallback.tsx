import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Loading from '../components/ui/Loading/Loading';

const PaymentCallback = () => {
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const authority = searchParams.get('Authority');
      const status = searchParams.get('Status');

      console.log('Payment Callback Params:', { authority, status });

      if (!authority || !status) {
        navigate('/payment/failed?message=پارامترهای پرداخت نامعتبر هستند');
        return;
      }

      if (status === 'OK') {
        navigate(`/payment/success?ref_id=${authority}`);
      } else {
        navigate('/payment/failed?message=پرداخت ناموفق بوده است');
      }

      setLoading(false);
    };

    handleCallback();
  }, [searchParams, navigate]);

  if (loading) {
    return <Loading />;
  }

  return null;
};

export default PaymentCallback;