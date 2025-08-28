import React, { useState, useEffect } from "react";
import { FaCalendarCheck, FaClock, FaMapMarkerAlt, FaUserMd, FaEye, FaTimes, FaCheck, FaHourglassHalf } from 'react-icons/fa';
import { getPatientAppointments, cancelPatientAppointment } from '../../../../services/serverapi';
import type { Appointment } from '../../../../types/types';

// تعریف نوع برای نوبت بیمار
interface PatientAppointment {
  id: number;
  doctorName: string;
  specialty: string;
  clinicName: string;
  clinicAddress: string;
  date: string;
  time: string;
  service: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  notes?: string;
  price: number;
  paymentStatus: 'paid' | 'pending' | 'refunded';
}

// تابع تبدیل داده‌های API به فرمت کامپوننت
const transformApiAppointmentToPatientAppointment = (apiAppointment: any): PatientAppointment => {
  // تبدیل تاریخ و زمان
  const startDate = new Date(apiAppointment.start_date);
  const endDate = new Date(apiAppointment.end_date);

  // تبدیل به تاریخ شمسی (تقریبی)
  const persianDate = startDate.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const startTime = startDate.toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // تبدیل وضعیت
  const statusMap: { [key: string]: 'confirmed' | 'pending' | 'completed' | 'cancelled' } = {
    'waiting': 'pending',
    'finished': 'completed',
    'canceled': 'cancelled'
  };

  const paymentStatusMap: { [key: string]: 'paid' | 'pending' | 'refunded' } = {
    'paid': 'paid',
    'waiting': 'pending',
    'refunded': 'refunded'
  };

  return {
    id: apiAppointment.id,
    doctorName: apiAppointment.doctor?.name || 'پزشک نامشخص',
    specialty: 'پزشک', // در API اطلاعات تخصص موجود نیست
    clinicName: apiAppointment.service?.clinic?.name || 'کلینیک نامشخص',
    clinicAddress: apiAppointment.service?.clinic?.address || 'آدرس نامشخص',
    date: persianDate,
    time: startTime,
    service: apiAppointment.service?.title || 'خدمات نامشخص',
    status: statusMap[apiAppointment.status] || 'pending',
    notes: apiAppointment.description || apiAppointment.doctor_description || undefined,
    price: apiAppointment.service?.price || 0,
    paymentStatus: paymentStatusMap[apiAppointment.payment_status] || 'pending'
  };
};

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<PatientAppointment | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState<number | null>(null);

  // بارگذاری داده‌های نوبت‌ها از API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiAppointments = await getPatientAppointments();
        const transformedAppointments = apiAppointments.map(transformApiAppointmentToPatientAppointment);
        setAppointments(transformedAppointments);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError(err instanceof Error ? err.message : 'خطا در بارگذاری نوبت‌ها');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // فیلتر کردن نوبت‌ها بر اساس وضعیت
  const filteredAppointments = appointments.filter(appointment => {
    if (filterStatus === 'all') return true;
    return appointment.status === filterStatus;
  });

  // گروه‌بندی نوبت‌ها به آینده و گذشته
  const upcomingAppointments = filteredAppointments.filter(app =>
    app.status === 'pending'
  );
  const pastAppointments = filteredAppointments.filter(app =>
    app.status === 'completed' || app.status === 'cancelled'
  );

  // هندلر لغو نوبت
  const handleCancelAppointment = async (appointmentId: number) => {
    if (window.confirm('آیا مطمئن هستید که می‌خواهید این نوبت را لغو کنید؟')) {
      try {
        setCancelLoading(appointmentId);
        await cancelPatientAppointment(appointmentId);

        // بروزرسانی لیست نوبت‌ها بعد از لغو موفق
        const updatedAppointments = await getPatientAppointments();
        const transformedAppointments = updatedAppointments.map(transformApiAppointmentToPatientAppointment);
        setAppointments(transformedAppointments);

        alert('نوبت با موفقیت لغو شد');
      } catch (err) {
        console.error('Error canceling appointment:', err);
        alert(err instanceof Error ? err.message : 'خطا در لغو نوبت');
      } finally {
        setCancelLoading(null);
      }
    }
  };

  // آیکون و رنگ وضعیت نوبت
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { icon: <FaHourglassHalf />, color: 'text-yellow-600', text: 'در انتظار' };
      case 'completed':
        return { icon: <FaCheck />, color: 'text-blue-600', text: 'انجام شده' };
      case 'cancelled':
        return { icon: <FaTimes />, color: 'text-red-600', text: 'لغو شده' };
      default:
        return { icon: <FaClock />, color: 'text-gray-600', text: 'نامشخص' };
    }
  };

  // آیکون و رنگ وضعیت پرداخت
  const getPaymentStatusInfo = (status: string) => {
    switch (status) {
      case 'paid':
        return { color: 'text-green-600', text: 'پرداخت شده' };
      case 'pending':
        return { color: 'text-yellow-600', text: 'در انتظار پرداخت' };
      case 'refunded':
        return { color: 'text-blue-600', text: 'بازگشت وجه' };
      default:
        return { color: 'text-gray-600', text: 'نامشخص' };
    }
  };

  return (
    <div className="px-4 min-h-screen" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* هدر */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">نوبت‌های من</h2>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={loading}
            >
              <option value="all">همه نوبت‌ها</option>
              <option value="pending">در انتظار</option>
              <option value="completed">انجام شده</option>
              <option value="cancelled">لغو شده</option>
            </select>
          </div>
        </div>

        {/* نمایش خطا */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* نمایش لودینگ */}
        {loading && (
          <div className="mb-6 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {/* نمایش پیام خالی بودن لیست */}
        {!loading && !error && appointments.length === 0 && (
          <div className="text-center py-12">
            <FaCalendarCheck className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">هیچ نوبت‌ای یافت نشد</h3>
            <p className="mt-1 text-sm text-gray-500">شما هنوز هیچ نوبت پزشکی رزرو نکرده‌اید.</p>
          </div>
        )}

        {/* نوبت‌های آینده */}
        {!loading && !error && upcomingAppointments.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">نوبت‌های آینده</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingAppointments.map((appointment) => {
                const statusInfo = getStatusInfo(appointment.status);
                const paymentInfo = getPaymentStatusInfo(appointment.paymentStatus);

                return (
                  <div key={appointment.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">{appointment.doctorName}</h4>
                        <p className="text-sm text-gray-600">{appointment.specialty}</p>
                      </div>
                      <div className={`flex items-center gap-1 ${statusInfo.color}`}>
                        {statusInfo.icon}
                        <span className="text-sm">{statusInfo.text}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-gray-500" />
                        <span>{appointment.clinicName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendarCheck className="text-gray-500" />
                        <span>{appointment.date} - {appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaUserMd className="text-gray-500" />
                        <span>{appointment.service}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className={`text-sm ${paymentInfo.color}`}>
                          {paymentInfo.text}
                        </span>
                        <span className="font-semibold text-primary">
                          {appointment.price.toLocaleString()} تومان
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => setSelectedAppointment(appointment)}
                        className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                      >
                        <FaEye />
                        مشاهده جزئیات
                      </button>
                      {appointment.status === 'pending' && (
                        <button
                          onClick={() => handleCancelAppointment(appointment.id)}
                          disabled={cancelLoading === appointment.id}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {cancelLoading === appointment.id && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          )}
                          لغو نوبت
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* نوبت‌های گذشته */}
        {!loading && !error && pastAppointments.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">تاریخچه نوبت‌ها</h3>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-right font-semibold text-gray-700">پزشک</th>
                      <th className="p-3 text-right font-semibold text-gray-700">خدمات</th>
                      <th className="p-3 text-right font-semibold text-gray-700">کلینیک</th>
                      <th className="p-3 text-right font-semibold text-gray-700">تاریخ و ساعت</th>
                      <th className="p-3 text-right font-semibold text-gray-700">وضعیت</th>
                      <th className="p-3 text-right font-semibold text-gray-700">مبلغ</th>
                      <th className="p-3 text-right font-semibold text-gray-700">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pastAppointments.map((appointment) => {
                      const statusInfo = getStatusInfo(appointment.status);
                      const paymentInfo = getPaymentStatusInfo(appointment.paymentStatus);

                      return (
                        <tr key={appointment.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="p-3">
                            <div>
                              <p className="font-medium text-gray-800">{appointment.doctorName}</p>
                              <p className="text-sm text-gray-600">{appointment.specialty}</p>
                            </div>
                          </td>
                          <td className="p-3 text-gray-700">{appointment.service}</td>
                          <td className="p-3 text-gray-700">{appointment.clinicName}</td>
                          <td className="p-3 text-gray-700">
                            {appointment.date} - {appointment.time}
                          </td>
                          <td className="p-3">
                            <div className={`flex items-center gap-1 ${statusInfo.color}`}>
                              {statusInfo.icon}
                              <span>{statusInfo.text}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{appointment.price.toLocaleString()} تومان</p>
                              <p className={`text-sm ${paymentInfo.color}`}>{paymentInfo.text}</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => setSelectedAppointment(appointment)}
                              className="bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                            >
                              مشاهده
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* مودال جزئیات نوبت */}
        {selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">جزئیات نوبت</h3>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800">{selectedAppointment.doctorName}</h4>
                  <p className="text-sm text-gray-600">{selectedAppointment.specialty}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">کلینیک:</p>
                    <p className="font-medium">{selectedAppointment.clinicName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">آدرس:</p>
                    <p className="font-medium">{selectedAppointment.clinicAddress}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">تاریخ:</p>
                    <p className="font-medium">{selectedAppointment.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">ساعت:</p>
                    <p className="font-medium">{selectedAppointment.time}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">خدمات:</p>
                    <p className="font-medium">{selectedAppointment.service}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">مبلغ:</p>
                    <p className="font-medium">{selectedAppointment.price.toLocaleString()} تومان</p>
                  </div>
                </div>

                {selectedAppointment.notes && (
                  <div>
                    <p className="text-gray-500">یادداشت:</p>
                    <p className="text-sm bg-gray-50 p-2 rounded">{selectedAppointment.notes}</p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-500">وضعیت نوبت:</p>
                    <div className={`flex items-center gap-1 ${getStatusInfo(selectedAppointment.status).color}`}>
                      {getStatusInfo(selectedAppointment.status).icon}
                      <span>{getStatusInfo(selectedAppointment.status).text}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">وضعیت پرداخت:</p>
                    <p className={`font-medium ${getPaymentStatusInfo(selectedAppointment.paymentStatus).color}`}>
                      {getPaymentStatusInfo(selectedAppointment.paymentStatus).text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;