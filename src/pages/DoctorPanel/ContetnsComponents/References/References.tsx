import React, { useEffect, useState } from 'react';
import { getReferrals, getReceivedReferrals, type ReferralsResponse } from '../../../../services/referralsMenuApi';
import Button from '../../../../components/ui/Button/Button';
import {
  HiEye,
  HiUser,
  HiUserGroup,
  HiDocumentText,
  HiClock,
  HiCurrencyDollar,
  HiCheckCircle,
  HiXCircle,
  HiArrowRight,
  HiArrowLeft,
  HiExclamationTriangle
} from 'react-icons/hi2';

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
  const [selectedReferral, setSelectedReferral] = useState<ReferralsResponse['referrals'][0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

    // Fetch both sent and received referrals
    const fetchReferrals = async () => {
      try {
        // Fetch sent referrals (referrals sent by current doctor)
        const sentResponse = await getReferrals();
        const sent = sentResponse.referrals.filter(
          (referral) => referral.referring_doctor_id === currentUserId
        );
        setSentReferrals(sent);

        // Fetch received referrals (referrals received by current doctor)
        const receivedResponse = await getReceivedReferrals();
        const received = receivedResponse.referrals.filter(
          (referral) => referral.referred_doctor_id === currentUserId
        );
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <HiCheckCircle className="h-4 w-4" />;
      case 'pending':
        return <HiExclamationTriangle className="h-4 w-4" />;
      default:
        return <HiXCircle className="h-4 w-4" />;
    }
  };

  const openModal = (referral: ReferralsResponse['referrals'][0]) => {
    setSelectedReferral(referral);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReferral(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // For sent referrals
  const sentCompleted = sentReferrals.filter(r => r.commission_status === 'paid');
  const sentPending = sentReferrals.filter(r => r.commission_status === 'pending');

  // For received referrals
  const receivedApproved = receivedReferrals.filter(r => r.commission_status === 'paid');
  const receivedPending = receivedReferrals.filter(r => r.commission_status === 'pending');

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
          <HiXCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <HiArrowRight className="h-8 w-8 text-blue-600" />
          مدیریت ارجاعات
        </h1>
        <p className="text-gray-600">مشاهده و مدیریت ارجاعات ارسالی و دریافتی</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sent Referrals Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <HiArrowLeft className="h-6 w-6 text-blue-600" />
              ارجاعات صادر شده
            </h2>

            {/* Completed Sent Referrals */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-green-700 flex items-center gap-2">
                <HiCheckCircle className="h-5 w-5" />
                تکمیل شده ({sentCompleted.length})
              </h3>
              {sentCompleted.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <HiDocumentText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>ارجاع تکمیل شده‌ای وجود ندارد</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sentCompleted.map((referral) => (
                    <div key={referral.id} className="bg-green-50 border border-green-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <HiUser className="h-4 w-4 text-green-600" />
                            <span className="font-medium text-gray-800">
                              {referral.patient ? `بیمار ${referral.patient.id}` : `بیمار ${referral.patient_id}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <HiUserGroup className="h-4 w-4 text-blue-600" />
                            <span className="text-gray-700">
                              {referral.referred_doctor?.name || `دکتر ${referral.referred_doctor_id}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <HiDocumentText className="h-4 w-4 text-purple-600" />
                            <span className="text-gray-700 text-sm">
                              {referral.appointment?.description || `سرویس ${referral.appointment?.service_id}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(referral.commission_status)}`}>
                              {getStatusIcon(referral.commission_status)}
                              {translateStatus(referral.commission_status)}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          icon={<HiEye />}
                          onClick={() => openModal(referral)}
                          className="ml-3"
                        >
                          مشاهده
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pending Sent Referrals */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-yellow-700 flex items-center gap-2">
                <HiExclamationTriangle className="h-5 w-5" />
                در انتظار ({sentPending.length})
              </h3>
              {sentPending.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <HiDocumentText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>ارجاع در انتظار وجود ندارد</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sentPending.map((referral) => (
                    <div key={referral.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <HiUser className="h-4 w-4 text-yellow-600" />
                            <span className="font-medium text-gray-800">
                              {referral.patient ? `بیمار ${referral.patient.id}` : `بیمار ${referral.patient_id}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <HiUserGroup className="h-4 w-4 text-blue-600" />
                            <span className="text-gray-700">
                              {referral.referred_doctor?.name || `دکتر ${referral.referred_doctor_id}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <HiDocumentText className="h-4 w-4 text-purple-600" />
                            <span className="text-gray-700 text-sm">
                              {referral.appointment?.description || `سرویس ${referral.appointment?.service_id}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(referral.commission_status)}`}>
                              {getStatusIcon(referral.commission_status)}
                              {translateStatus(referral.commission_status)}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          icon={<HiEye />}
                          onClick={() => openModal(referral)}
                          className="ml-3"
                        >
                          مشاهده
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Received Referrals Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <HiArrowRight className="h-6 w-6 text-green-600" />
              ارجاعات دریافتی
            </h2>

            {/* Approved Received Referrals */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-green-700 flex items-center gap-2">
                <HiCheckCircle className="h-5 w-5" />
                تایید شده ({receivedApproved.length})
              </h3>
              {receivedApproved.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <HiDocumentText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>ارجاع تایید شده‌ای وجود ندارد</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {receivedApproved.map((referral) => (
                    <div key={referral.id} className="bg-green-50 border border-green-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <HiUser className="h-4 w-4 text-green-600" />
                            <span className="font-medium text-gray-800">
                              {referral.patient ? `بیمار ${referral.patient.id}` : `بیمار ${referral.patient_id}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <HiUserGroup className="h-4 w-4 text-blue-600" />
                            <span className="text-gray-700">
                              دکتر ارجاع دهنده ID: {referral.referring_doctor_id}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <HiDocumentText className="h-4 w-4 text-purple-600" />
                            <span className="text-gray-700 text-sm">
                              {referral.appointment?.description || `سرویس ${referral.appointment?.service_id}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(referral.commission_status)}`}>
                              {getStatusIcon(referral.commission_status)}
                              {translateStatus(referral.commission_status)}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          icon={<HiEye />}
                          onClick={() => openModal(referral)}
                          className="ml-3"
                        >
                          مشاهده
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pending Received Referrals */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-yellow-700 flex items-center gap-2">
                <HiExclamationTriangle className="h-5 w-5" />
                در انتظار تایید ({receivedPending.length})
              </h3>
              {receivedPending.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <HiDocumentText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>ارجاع در انتظار تایید وجود ندارد</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {receivedPending.map((referral) => (
                    <div key={referral.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <HiUser className="h-4 w-4 text-yellow-600" />
                            <span className="font-medium text-gray-800">
                              {referral.patient ? `بیمار ${referral.patient.id}` : `بیمار ${referral.patient_id}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <HiUserGroup className="h-4 w-4 text-blue-600" />
                            <span className="text-gray-700">
                              دکتر ارجاع دهنده ID: {referral.referring_doctor_id}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <HiDocumentText className="h-4 w-4 text-purple-600" />
                            <span className="text-gray-700 text-sm">
                              {referral.appointment?.description || `سرویس ${referral.appointment?.service_id}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(referral.commission_status)}`}>
                              {getStatusIcon(referral.commission_status)}
                              {translateStatus(referral.commission_status)}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          icon={<HiEye />}
                          onClick={() => openModal(referral)}
                          className="ml-3"
                        >
                          مشاهده
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Referral Details Modal */}
      {isModalOpen && selectedReferral && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="w-full max-w-4xl rounded-xl bg-white shadow-2xl relative max-h-[90vh] overflow-hidden">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
              onClick={closeModal}
            >
              <HiXCircle className="h-6 w-6" />
            </button>
            <div className="max-h-[90vh] overflow-y-auto p-8">
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 flex items-center justify-center gap-2">
                <HiEye className="h-6 w-6 text-blue-600" />
                جزئیات ارجاع
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                    <HiUser className="h-5 w-5 text-blue-500" />
                    <div>
                      <span className="font-semibold text-gray-700">بیمار:</span>{" "}
                      <span className="text-gray-600">
                        {selectedReferral.patient ? `بیمار ${selectedReferral.patient.id}` : `بیمار ${selectedReferral.patient_id}`}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                    <HiUserGroup className="h-5 w-5 text-blue-500" />
                    <div>
                      <span className="font-semibold text-gray-700">دکتر ارجاع گیرنده:</span>{" "}
                      <span className="text-gray-600">
                        {selectedReferral.referred_doctor?.name || `دکتر ${selectedReferral.referred_doctor_id}`}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                    <HiUserGroup className="h-5 w-5 text-blue-500" />
                    <div>
                      <span className="font-semibold text-gray-700">دکتر ارجاع دهنده:</span>{" "}
                      <span className="text-gray-600">
                        {selectedReferral.referring_doctor_id ? `دکتر ${selectedReferral.referring_doctor_id}` : 'نامشخص'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                    <HiDocumentText className="h-5 w-5 text-blue-500" />
                    <div>
                      <span className="font-semibold text-gray-700">توضیحات ارجاع:</span>{" "}
                      <span className="text-gray-600">{selectedReferral.notes || "بدون توضیحات"}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                    <HiClock className="h-5 w-5 text-blue-500" />
                    <div>
                      <span className="font-semibold text-gray-700">تاریخ ارجاع:</span>{" "}
                      <span className="text-gray-600">{formatDate(selectedReferral.referral_date)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                    <HiCurrencyDollar className="h-5 w-5 text-blue-500" />
                    <div>
                      <span className="font-semibold text-gray-700">مبلغ کمیسیون:</span>{" "}
                      <span className="text-gray-600">{selectedReferral.commission_amount} تومان</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                    <HiCheckCircle className="h-5 w-5 text-blue-500" />
                    <div>
                      <span className="font-semibold text-gray-700">وضعیت کمیسیون:</span>{" "}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(selectedReferral.commission_status)}`}>
                        {getStatusIcon(selectedReferral.commission_status)}
                        {translateStatus(selectedReferral.commission_status)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                    <HiClock className="h-5 w-5 text-blue-500" />
                    <div>
                      <span className="font-semibold text-gray-700">تاریخ ایجاد:</span>{" "}
                      <span className="text-gray-600">{formatDate(selectedReferral.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <HiDocumentText className="h-5 w-5 text-purple-600" />
                  جزئیات نوبت
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <HiClock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">زمان شروع: {formatDate(selectedReferral.appointment.start_date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HiClock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">زمان پایان: {formatDate(selectedReferral.appointment.end_date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HiCheckCircle className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">وضعیت: {selectedReferral.appointment.status}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <HiCurrencyDollar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">وضعیت پرداخت: {selectedReferral.appointment.payment_status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HiDocumentText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">توضیحات: {selectedReferral.appointment.description || 'بدون توضیحات'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  icon={<HiXCircle />}
                  onClick={closeModal}
                  className="px-8"
                >
                  بستن
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default References;