import React, { useEffect, useState } from 'react';
import { getReferrals, getReceivedReferrals, updateCommissionStatus, type ReferralsResponse } from '../../../../services/referralsMenuApi';
import Button from '../../../../components/ui/Button/Button';
import Tabs from '../../../../components/ui/Tabs/Tabs';
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
  HiExclamationTriangle,
  HiCheck
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
  const [success, setSuccess] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [selectedReferral, setSelectedReferral] = useState<ReferralsResponse['referrals'][0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filter states for sent referrals
  const [sentSearch, setSentSearch] = useState('');
  const [sentDoctorFilter, setSentDoctorFilter] = useState('');
  const [sentStatusFilter, setSentStatusFilter] = useState('');

  // Filter states for received referrals
  const [receivedSearch, setReceivedSearch] = useState('');
  const [receivedDoctorFilter, setReceivedDoctorFilter] = useState('');
  const [receivedStatusFilter, setReceivedStatusFilter] = useState('');

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
      setLoading(true);
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
      } finally {
        setLoading(false);
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
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
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

  const handleConfirm = async (referralId: number) => {
    try {
      setError(null);
      setSuccess(null);
      await updateCommissionStatus(referralId);
      setSuccess('وضعیت کمیسیون با موفقیت بروزرسانی شد');

      // Update local state to move referral from pending to approved
      setReceivedReferrals(prev =>
        prev.map(ref =>
          ref.id === referralId
            ? { ...ref, commission_status: 'paid' }
            : ref
        )
      );

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطایی رخ داده است');
    }
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

  const renderTable = (referrals: ReferralsResponse['referrals'], isReceived: boolean) => {
    // Apply filters
    let filteredReferrals = referrals;

    const searchTerm = isReceived ? receivedSearch : sentSearch;
    const doctorFilter = isReceived ? receivedDoctorFilter : sentDoctorFilter;
    const statusFilter = isReceived ? receivedStatusFilter : sentStatusFilter;

    if (searchTerm) {
      filteredReferrals = filteredReferrals.filter(ref =>
        ref.patient_id.toString().includes(searchTerm) ||
        (ref.notes && ref.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (doctorFilter) {
      if (isReceived) {
        filteredReferrals = filteredReferrals.filter(ref => ref.referring_doctor_id.toString() === doctorFilter);
      } else {
        filteredReferrals = filteredReferrals.filter(ref => ref.referred_doctor_id.toString() === doctorFilter);
      }
    }

    if (statusFilter) {
      filteredReferrals = filteredReferrals.filter(ref => ref.commission_status === statusFilter);
    }

    // Get unique doctors for filter
    const uniqueDoctors = isReceived
      ? [...new Set(filteredReferrals.map(r => r.referring_doctor_id))].map(id => ({
          id: id.toString(),
          name: `دکتر ${id}` // Since referring_doctor name not available
        }))
      : [...new Set(filteredReferrals.map(r => r.referred_doctor_id))].map(id => ({
          id: id.toString(),
          name: filteredReferrals.find(r => r.referred_doctor_id === id)?.referred_doctor?.name || `دکتر ${id}`
        }));

    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (referrals.length === 0) {
      return (
        <div className="text-center py-12">
          <HiDocumentText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-lg">هیچ ارجاعی یافت نشد</p>
        </div>
      );
    }

    return (
      <div>
        {/* Filters */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">جستجو</label>
              <input
                type="text"
                placeholder="بر اساس بیمار یا توضیحات"
                value={searchTerm}
                onChange={(e) => isReceived ? setReceivedSearch(e.target.value) : setSentSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">دکتر</label>
              <select
                value={doctorFilter}
                onChange={(e) => isReceived ? setReceivedDoctorFilter(e.target.value) : setSentDoctorFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">همه دکترها</option>
                {uniqueDoctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">وضعیت</label>
              <select
                value={statusFilter}
                onChange={(e) => isReceived ? setReceivedStatusFilter(e.target.value) : setSentStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">همه وضعیت‌ها</option>
                <option value="pending">در حال انتظار</option>
                <option value="paid">پرداخت شده</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        {filteredReferrals.length === 0 ? (
          <div className="text-center py-12">
            <HiDocumentText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">هیچ ارجاعی مطابق فیلترها یافت نشد</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-right font-medium text-gray-700">بیمار</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-700">دکتر</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-700">وضعیت</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-700">تاریخ</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-700">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredReferrals.map((referral, index) => (
                  <tr key={referral.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-800">
                        {referral.patient ? `بیمار ${referral.patient.id}` : `بیمار ${referral.patient_id}`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700">
                        {isReceived
                          ? `دکتر ${referral.referring_doctor_id}`
                          : (referral.referred_doctor?.name || `دکتر ${referral.referred_doctor_id}`)
                        }
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(referral.commission_status)}`}>
                        {getStatusIcon(referral.commission_status)}
                        {translateStatus(referral.commission_status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600 text-sm">
                        {formatDate(referral.referral_date)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          icon={<HiEye />}
                          onClick={() => openModal(referral)}
                          className="hover:bg-blue-50 hover:border-blue-300"
                        >
                          مشاهده
                        </Button>
                        {isReceived && referral.commission_status === 'pending' && (
                          <Button
                            size="sm"
                            variant="solid"
                            icon={<HiCheck />}
                            onClick={() => handleConfirm(referral.id)}
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            تایید
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const tabs = [
    {
      id: 'sent',
      label: 'ارجاعات صادر شده',
      icon: <HiArrowLeft className="h-5 w-5" />,
      content: renderTable(sentReferrals, false)
    },
    {
      id: 'received',
      label: 'ارجاعات دریافتی',
      icon: <HiArrowRight className="h-5 w-5" />,
      content: renderTable(receivedReferrals, true)
    }
  ];

  return (
    <div className=" bg-gray-50 min-h-screen">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
          <HiXCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
          <HiCheckCircle className="h-5 w-5" />
          {success}
        </div>
      )}



      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <Tabs tabs={tabs} />
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