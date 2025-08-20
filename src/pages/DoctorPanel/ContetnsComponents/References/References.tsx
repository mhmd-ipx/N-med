import React, { useEffect, useState } from 'react';
import { getReferrals, type ReferralsResponse } from '../../../../services/referralsMenuApi';

interface AuthData {
  message: string;
  token: string;
  user: {
    id: number;
    name: string;
    phone: string;
    role: string;
    related_data: {
      id: number;
      specialties: string | null;
      address: string | null;
      bio: string | null;
      avatar: string | null;
      code: string | null;
      status: string;
      clinics: Array<{
        id: number;
        name: string;
        address: string;
        phone: string;
        description: string | null;
        geo: string;
        province_id: number;
        city_id: number;
        created_at: string;
        updated_at: string;
        pivot: {
          doctor_id: number;
          clinic_id: number;
        };
      }>;
      created_at: string;
      updated_at: string;
    };
  };
}

const References: React.FC = () => {
  const [sentReferrals, setSentReferrals] = useState<ReferralsResponse['referrals']>([]);
  const [receivedReferrals, setReceivedReferrals] = useState<ReferralsResponse['referrals']>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    // Get current user ID from localStorage
    const authData = localStorage.getItem('authData');
    if (authData) {
      const parsedData: AuthData = JSON.parse(authData);
      setCurrentUserId(parsedData.user.id);
    }
  }, []);

  useEffect(() => {
    if (currentUserId === null) return;

    // Fetch referrals
    const fetchReferrals = async () => {
      try {
        const response = await getReferrals();
        // Filter referrals based on current user ID
        const sent = response.referrals.filter(
          (referral) => referral.referring_doctor_id === currentUserId
        );
        const received = response.referrals.filter(
          (referral) => referral.referred_doctor_id === currentUserId
        );
        setSentReferrals(sent);
        setReceivedReferrals(received);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'خطایی رخ داده است');
      }
    };

    fetchReferrals();
  }, [currentUserId]);

  const translateStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return 'در حال انتظار';
      case 'paid':
        return 'پرداخت شده';
      default:
        return status;
    }
  };

  // For sent referrals
  const sentCompleted = sentReferrals.filter(r => r.commission_status === 'paid');
  const sentPending = sentReferrals.filter(r => r.commission_status === 'pending');

  // For received referrals
  const receivedApproved = receivedReferrals.filter(r => r.commission_status === 'paid');
  const receivedPending = receivedReferrals.filter(r => r.commission_status === 'pending');

  return (
    <div className="p-4">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sent Referrals Column */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-bold mb-4">ارجاعات صادر شده</h2>
          
          <h3 className="text-md font-semibold mb-2">تکمیل شده</h3>
          {sentCompleted.length === 0 ? (
            <p>ارجاع تکمیل شده‌ای وجود ندارد</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">نام بیمار</th>
                  <th className="border p-2">نام دکتر</th>
                  <th className="border p-2">خدمات</th>
                  <th className="border p-2">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {sentCompleted.map((referral) => (
                  <tr key={referral.id}>
                    <td className="border p-2">بیمار ID: {referral.patient_id}</td>
                    <td className="border p-2">دکتر ID: {referral.referred_doctor_id}</td>
                    <td className="border p-2">سرویس ID: {referral.appointment.service_id}</td>
                    <td className="border p-2">{translateStatus(referral.commission_status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h3 className="text-md font-semibold mb-2 mt-4">ناتمام</h3>
          {sentPending.length === 0 ? (
            <p>ارجاع ناتمامی وجود ندارد</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">نام بیمار</th>
                  <th className="border p-2">نام دکتر</th>
                  <th className="border p-2">خدمات</th>
                  <th className="border p-2">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {sentPending.map((referral) => (
                  <tr key={referral.id}>
                    <td className="border p-2">بیمار ID: {referral.patient_id}</td>
                    <td className="border p-2">دکتر ID: {referral.referred_doctor_id}</td>
                    <td className="border p-2">سرویس ID: {referral.appointment.service_id}</td>
                    <td className="border p-2">{translateStatus(referral.commission_status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Received Referrals Column */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-bold mb-4">ارجاعات دریافتی</h2>
          
          <h3 className="text-md font-semibold mb-2">تایید شده</h3>
          {receivedApproved.length === 0 ? (
            <p>ارجاع تایید شده‌ای وجود ندارد</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">نام بیمار</th>
                  <th className="border p-2">نام دکتر</th>
                  <th className="border p-2">خدمات</th>
                  <th className="border p-2">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {receivedApproved.map((referral) => (
                  <tr key={referral.id}>
                    <td className="border p-2">بیمار ID: {referral.patient_id}</td>
                    <td className="border p-2">دکتر ID: {referral.referring_doctor_id}</td>
                    <td className="border p-2">سرویس ID: {referral.appointment.service_id}</td>
                    <td className="border p-2">{translateStatus(referral.commission_status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h3 className="text-md font-semibold mb-2 mt-4">در انتظار تایید</h3>
          {receivedPending.length === 0 ? (
            <p>ارجاع در انتظار تایید وجود ندارد</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">نام بیمار</th>
                  <th className="border p-2">نام دکتر</th>
                  <th className="border p-2">خدمات</th>
                  <th className="border p-2">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {receivedPending.map((referral) => (
                  <tr key={referral.id}>
                    <td className="border p-2">بیمار ID: {referral.patient_id}</td>
                    <td className="border p-2">دکتر ID: {referral.referring_doctor_id}</td>
                    <td className="border p-2">سرویس ID: {referral.appointment.service_id}</td>
                    <td className="border p-2">{translateStatus(referral.commission_status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default References;