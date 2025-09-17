import React, { useState, useEffect } from 'react';
import { HiXCircle, HiCheck, HiCurrencyDollar, HiCalendar, HiClock } from 'react-icons/hi2';
import Button from '../../../../components/ui/Button/Button';
import { getDoctorAppointments, type Appointment } from '../../../../services/Turnapi';
import { updateCommissionStatus } from '../../../../services/referralsMenuApi';
import type { ReferralsResponse } from '../../../../services/referralsMenuApi';

interface CommissionConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  referral: ReferralsResponse['referrals'][0];
  onSuccess: (updatedReferral: ReferralsResponse['referrals'][0]) => void;
  onError: (error: string) => void;
}

const CommissionConfirmModal: React.FC<CommissionConfirmModalProps> = ({
  isOpen,
  onClose,
  referral,
  onSuccess,
  onError
}) => {
  const [activeTab, setActiveTab] = useState<'amount' | 'appointment'>('amount');
  const [manualAmount, setManualAmount] = useState('');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingAppointments, setFetchingAppointments] = useState(false);

  useEffect(() => {
    if (isOpen && activeTab === 'appointment') {
      fetchAppointments();
    }
  }, [isOpen, activeTab]);

  const fetchAppointments = async () => {
    setFetchingAppointments(true);
    try {
      const response = await getDoctorAppointments();
      // Filter appointments for the referred patient only
      const patientAppointments = response.filter(apt =>
        apt.patient?.id === referral.patient?.user_id
      );
      setAppointments(patientAppointments);
    } catch (error) {
      onError('خطا در دریافت لیست نوبت‌ها');
    } finally {
      setFetchingAppointments(false);
    }
  };

  const handleConfirm = async () => {
    if (activeTab === 'amount' && !manualAmount.trim()) {
      onError('لطفا مبلغ را وارد کنید');
      return;
    }

    if (activeTab === 'appointment' && !selectedAppointmentId) {
      onError('لطفا یک نوبت انتخاب کنید');
      return;
    }

    setLoading(true);
    try {
      let response;
      if (activeTab === 'amount') {
        response = await updateCommissionStatus(
          referral.id,
          'paid',
          parseInt(manualAmount),
          undefined
        );
      } else {
        response = await updateCommissionStatus(
          referral.id,
          'paid',
          undefined,
          selectedAppointmentId!
        );
      }

      onSuccess(response.referral);
      onClose();
      // Reset form
      setManualAmount('');
      setSelectedAppointmentId(null);
      setActiveTab('amount');
    } catch (error) {
      onError(error instanceof Error ? error.message : 'خطا در بروزرسانی کمیسیون');
    } finally {
      setLoading(false);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl relative max-h-[90vh] overflow-hidden">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
          onClick={onClose}
        >
          <HiXCircle className="h-6 w-6" />
        </button>
        <div className="max-h-[90vh] overflow-y-auto p-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 flex items-center justify-center gap-2">
            <HiCurrencyDollar className="h-6 w-6 text-blue-600" />
            تایید کمیسیون ارجاع
          </h2>

          <div className="mb-6">
            <p className="text-gray-600 text-center">
              ارجاع به بیمار <strong>{referral.patient?.user?.name || `بیمار ${referral.patient_id}`}</strong> فاقد نوبت مرتبط است.
              لطفا یکی از روش‌های زیر را برای تعیین مبلغ کمیسیون انتخاب کنید:
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('amount')}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                activeTab === 'amount'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <HiCurrencyDollar className="h-5 w-5 inline mr-2" />
              تعیین دستی مبلغ
            </button>
            <button
              onClick={() => setActiveTab('appointment')}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                activeTab === 'appointment'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <HiCalendar className="h-5 w-5 inline mr-2" />
              انتخاب از نوبت‌ها
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'amount' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  مبلغ کمیسیون (تومان) *
                </label>
                <input
                  type="number"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                  placeholder="مثال: 10000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  dir="ltr"
                  min="0"
                />
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>توجه:</strong> مبلغ وارد شده به عنوان کمیسیون این ارجاع ثبت خواهد شد و وضعیت آن به "پرداخت شده" تغییر می‌کند.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'appointment' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  انتخاب نوبت *
                </label>
                {fetchingAppointments ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <HiCalendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>هیچ نوبتی برای این بیمار یافت نشد</p>
                  </div>
                ) : (
                  <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        onClick={() => setSelectedAppointmentId(appointment.id)}
                        className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedAppointmentId === appointment.id ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <HiCalendar className="h-4 w-4 text-gray-500" />
                              <span className="font-medium text-gray-800">
                                {appointment.patient?.user?.name || `بیمار ${appointment.patient_id}`}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>{appointment.service.title}</span>
                              <span>{formatDate(appointment.start_date)}</span>
                            </div>
                          </div>
                          {selectedAppointmentId === appointment.id && (
                            <HiCheck className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>توجه:</strong> با انتخاب نوبت، مبلغ کمیسیون بر اساس قیمت سرویس تعیین خواهد شد و وضعیت به "پرداخت شده" تغییر می‌کند. تمام نوبت‌های این بیمار نمایش داده شده است.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 mt-8">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="px-6"
            >
              انصراف
            </Button>
            <Button
              variant="solid"
              onClick={handleConfirm}
              disabled={loading || (activeTab === 'amount' && !manualAmount.trim()) || (activeTab === 'appointment' && !selectedAppointmentId)}
              className="px-6 bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 text-primary border-b-2 border-white"></div>
                  در حال ثبت...
                </div>
              ) : (
                'تایید و ثبت'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionConfirmModal;