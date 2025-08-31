import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Loading from '../components/ui/Loading/Loading';
import { paymentCallback } from '../services/publicApi';

const PaymentCallback = () => {
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const authority = searchParams.get('Authority');
      const status = searchParams.get('Status');

      if (!authority || !status) {
        navigate('/payment/failed?message=پارامترهای پرداخت نامعتبر هستند');
        return;
      }

      try {
        const response = await paymentCallback(authority, status);

        if (response.success) {
          navigate(`/payment/success?ref_id=${response.ref_id || ''}`);
        } else {
          navigate(`/payment/failed?message=${encodeURIComponent(response.message)}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'خطای ناشناخته';
        navigate(`/payment/failed?message=${encodeURIComponent(errorMessage)}`);
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  if (loading) {
    return <Loading />;
  }

  return null;
};

export default PaymentCallback;