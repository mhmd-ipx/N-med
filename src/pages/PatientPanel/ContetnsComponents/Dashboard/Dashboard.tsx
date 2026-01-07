import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { FaUser, FaCalendarCheck, FaFileMedical } from 'react-icons/fa';
import { useUser } from '../../../../components/ui/login/UserDataProvider';
import { getPatientAppointments } from '../../../../services/serverapi';

// تعریف نوع برای دیتای داشبورد بیمار
interface PatientDashboardData {
  appointments_count: number;
  medical_records_count: number;
  referrals_count: number;
}

// داده‌های تستی برای داشبورد بیمار
const mockPatientDashboardData: PatientDashboardData = {
  appointments_count: 5,
  medical_records_count: 12,
  referrals_count: 3,
};

// تابع تبدیل داده‌های API به فرمت داشبورد
const transformApiAppointmentToDashboardAppointment = (apiAppointment: any): Appointment => {
  // تبدیل تاریخ و زمان
  const startDate = new Date(apiAppointment.start_date);

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
  const statusMap: { [key: string]: string } = {
    'waiting': 'تایید شده',
    'finished': 'انجام شده',
    'canceled': 'لغو شده'
  };

  return {
    id: apiAppointment.id,
    doctorName: apiAppointment.doctor?.name || 'پزشک نامشخص',
    specialty: 'پزشک', // در API اطلاعات تخصص موجود نیست
    date: persianDate,
    time: startTime,
    clinic: apiAppointment.service?.clinic?.name || 'کلینیک نامشخص',
    status: statusMap[apiAppointment.status] || 'تایید شده'
  };
};

// تعریف نوع برای نوبت‌ها
interface Appointment {
  id: number;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  clinic: string;
  status: string;
}

const Dashboard: React.FC = () => {
  const { user, isLoading } = useUser();
  const [dashboardData, setDashboardData] = useState<PatientDashboardData>(mockPatientDashboardData);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);

  // لود اولیه دیتا
  useEffect(() => {
    const loadData = async () => {
      // در واقعیت اینجا از API دریافت می‌کنیم
      setDashboardData(mockPatientDashboardData);

      if (user) {
        try {
          const appointments = await getPatientAppointments();
          const transformedAppointments = appointments.map(
            transformApiAppointmentToDashboardAppointment
          );

          // مرتب‌سازی بر اساس تاریخ و ساعت (جدیدترین اول)
          const sortedAppointments = transformedAppointments.sort((a, b) => {
            const dateA = new Date(a.date + ' ' + a.time);
            const dateB = new Date(b.date + ' ' + b.time);
            return dateB.getTime() - dateA.getTime();
          });

          // نمایش 4 نوبت آخر (جدیدترین‌ها)
          setUpcomingAppointments(sortedAppointments.slice(0, 4));
        } catch (error) {
          console.error('Error fetching appointments:', error);
        }
      }
    };

    if (!isLoading) {
      loadData();
    }
  }, [user, isLoading]);

  if (isLoading) {
    return <div className="text-center py-10">در حال بارگذاری...</div>;
  }

  return (
    <div className="px-4 min-h-screen" dir="rtl">
      {/* چهار باکس چارتی */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">

        <Link to="/UserProfile/Appointments" className="block">
          <div className="border border-gray-200 p-4 rounded-xl bg-white flex items-center text-right hover:bg-gray-50 transition-colors">
            <FaFileMedical className="text-3xl text-primary ml-3" />
            <div>
              <h3 className="font-semibold text-gray-700">سوابق پزشکی</h3>
              <p className="text-2xl font-bold text-gray-800">{dashboardData.medical_records_count}</p>
            </div>
          </div>
        </Link>
        <a href="/UserProfile/Support" >
          <div className="border border-gray-200 p-4 rounded-xl bg-white flex items-center text-right hover:bg-gray-50 transition-colors">
            <FaUser className="text-3xl text-primary ml-3" />
            <div>
              <h3 className="font-semibold text-gray-700">ارجاعات دریافتی</h3>
              <p className="text-2xl font-bold text-gray-800">{dashboardData.referrals_count}</p>
            </div>
          </div>

        </a>


      </div>

      {/* دیو برای نوبت‌ها */}
      <div className="mb-4">
        <a href="/UserProfile/Turns" >
          <div className="border p-4 rounded-xl bg-white hover:bg-gray-50">
            <h3 className="font-semibold mb-3 text-gray-700 flex items-center gap-2 text-lg">
              <FaCalendarCheck className="text-2xl text-primary ml-3" />
              نوبت‌های آینده
            </h3>
            <div className="space-y-3">
              {upcomingAppointments.map((appointment: Appointment) => (
                <div key={appointment.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800">{appointment.doctorName}</p>
                      <p className="text-sm text-gray-600">{appointment.specialty}</p>
                      <p className="text-sm text-gray-600">{appointment.clinic}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">{appointment.date}</p>
                      <p className="text-sm text-gray-600">{appointment.time}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${appointment.status === 'تایید شده'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </a>

      </div>

      {/* محل تبلیغات و بنر */}
      <div className="mt-6 mb-4">
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-50 text-center">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">محل تبلیغات و بنر شما</h3>
          <p className="text-sm text-gray-500">این فضا برای نمایش تبلیغات و بنرهای شما در نظر گرفته شده است</p>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;