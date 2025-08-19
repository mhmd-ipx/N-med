import React, { useState, useEffect } from 'react';
import type { Appointment } from '../../../../services/Turnapi';
import { createReferral, getDoctors } from '../../../../services/referralApi';
import type { DoctorsResponse, Doctor } from '../../../../services/referralApi';

// Define CreateReferralRequest type locally if not exported from referralApi
type CreateReferralRequest = {
  patient_id: number;
  referred_doctor_id: number;
  appointment_id: number;
  notes: string;
};
import { HiXMark, HiUser, HiClipboardDocument, HiBuildingOffice, HiClock, HiCheckCircle, HiCreditCard, HiDocumentText, HiPaperClip, HiArrowPath } from 'react-icons/hi2';

const statusTranslations: Record<string, string> = {
  waiting: "در انتظار",
  canceled: "لغو شده",
  finished: "پایان یافته",
};

const paymentStatusTranslations: Record<string, string> = {
  waiting: "در انتظار پرداخت",
  paid: "پرداخت شده",
  failed: "ناموفق",
};

const AppointmentModal: React.FC<{
  appointment: Appointment;
  onClose: () => void;
}> = ({ appointment, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [formData, setFormData] = useState<CreateReferralRequest>({
    patient_id: appointment.patient_id,
    referred_doctor_id: 0,
    appointment_id: appointment.id,
    notes: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await getDoctors();
        setDoctors(response.data);
      } catch (err) {
        setError('خطا در بارگذاری لیست پزشکان');
      }
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await createReferral(formData);
      setSuccess(response.message);
      setFormData({
        patient_id: appointment.patient_id,
        referred_doctor_id: 0,
        appointment_id: appointment.id,
        notes: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای ناشناخته');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: CreateReferralRequest) => ({
      ...prev,
      [name]: name === 'notes' ? value : parseInt(value) || value,
    }));
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

  const parseAttachments = (attachments: string): string[] => {
    try {
      return JSON.parse(attachments) as string[];
    } catch {
      return [];
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="w-full max-w-3xl rounded-xl bg-white shadow-2xl relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <HiXMark className="h-6 w-6" />
        </button>
        <div className="max-h-[80vh] overflow-y-auto p-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 flex items-center justify-center gap-2">
            <HiClipboardDocument className="h-6 w-6 text-blue-600" />
            جزئیات نوبت
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                <HiUser className="h-5 w-5 text-blue-500" />
                <div>
                  <span className="font-semibold text-gray-700">بیمار:</span>{" "}
                  <span className="text-gray-600">
                    {appointment.patient?.user?.name ?? `شناسه بیمار: ${appointment.patient_id}`}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                <HiDocumentText className="h-5 w-5 text-blue-500" />
                <div>
                  <span className="font-semibold text-gray-700">سرویس:</span>{" "}
                  <span className="text-gray-600">{appointment.service?.title ?? "نامشخص"}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                <HiBuildingOffice className="h-5 w-5 text-blue-500" />
                <div>
                  <span className="font-semibold text-gray-700">کلینیک:</span>{" "}
                  <span className="text-gray-600">{appointment.service?.clinic?.name ?? "نامشخص"}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                <HiBuildingOffice className="h-5 w-5 text-blue-500" />
                <div>
                  <span className="font-semibold text-gray-700">آدرس کلینیک:</span>{" "}
                  <span className="text-gray-600">{appointment.service?.clinic?.address ?? "نامشخص"}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                <HiClock className="h-5 w-5 text-blue-500" />
                <div>
                  <span className="font-semibold text-gray-700">زمان شروع:</span>{" "}
                  <span className="text-gray-600">{formatDate(appointment.start_date)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                <HiClock className="h-5 w-5 text-blue-500" />
                <div>
                  <span className="font-semibold text-gray-700">زمان پایان:</span>{" "}
                  <span className="text-gray-600">{formatDate(appointment.end_date)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                <HiCheckCircle className="h-5 w-5 text-blue-500" />
                <div>
                  <span className="font-semibold text-gray-700">وضعیت:</span>{" "}
                  <span className="text-gray-600">{statusTranslations[appointment.status] || appointment.status}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                <HiCreditCard className="h-5 w-5 text-blue-500" />
                <div>
                  <span className="font-semibold text-gray-700">وضعیت پرداخت:</span>{" "}
                  <span className="text-gray-600">{paymentStatusTranslations[appointment.payment_status] || appointment.payment_status}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
              <HiDocumentText className="h-5 w-5 text-blue-500" />
              <div>
                <span className="font-semibold text-gray-700">توضیحات:</span>{" "}
                <span className="text-gray-600">{appointment.description ?? "بدون توضیحات"}</span>
              </div>
            </div>
            {appointment.doctor_description && (
              <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                <HiDocumentText className="h-5 w-5 text-blue-500" />
                <div>
                  <span className="font-semibold text-gray-700">توضیحات پزشک:</span>{" "}
                  <span className="text-gray-600">{appointment.doctor_description}</span>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
              <HiCreditCard className="h-5 w-5 text-blue-500" />
              <div>
                <span className="font-semibold text-gray-700">قیمت:</span>{" "}
                <span className="text-gray-600">{(appointment.service?.price ?? 0).toLocaleString("fa-IR")} تومان</span>
              </div>
            </div>
            {appointment.service?.discount_price && (
              <div className="flex items-center gap-2">
                <HiCreditCard className="h-5 w-5 text-blue-500" />
                <div>
                  <span className="font-semibold text-gray-700">قیمت با تخفیف:</span>{" "}
                  <span className="text-gray-600">{appointment.service?.discount_price.toLocaleString("fa-IR")} تومان</span>
                </div>
              </div>
            )}
          </div>

          

          <div className="mb-6">
            <button
              className="w-full p-4 bg-blue-600 text-white rounded-lg flex justify-between items-center hover:bg-blue-700 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="flex items-center gap-2">
                <HiArrowPath className="h-5 w-5" />
                <span>ارجاع بیمار</span>
              </div>
              <span>{isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen && (
              <div className="p-4 border border-t-0 rounded-b-lg bg-gray-50">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                      <HiUser className="h-5 w-5 text-blue-500" />
                      پزشک ارجاع گیرنده
                    </label>
                    <select
                      name="referred_doctor_id"
                      value={formData.referred_doctor_id}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      required
                    >
                      <option value="">انتخاب پزشک</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.user.name} ({doctor.user.phone})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                      <HiDocumentText className="h-5 w-5 text-blue-500" />
                      یادداشت
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      rows={4}
                    />
                  </div>
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                  {success && <div className="text-green-500 text-sm">{success}</div>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                  >
                    {loading ? 'در حال ارسال...' : 'ثبت ارجاع'}
                  </button>
                </form>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <button
              className="rounded-lg bg-red-500 px-6 py-2 text-white hover:bg-red-600 transition-colors flex items-center gap-2"
              onClick={onClose}
            >
              <HiXMark className="h-5 w-5" />
              بستن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;