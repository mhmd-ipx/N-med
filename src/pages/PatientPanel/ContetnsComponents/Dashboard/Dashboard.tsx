import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCalendarCheck, FaFileMedical, FaHeart, FaSyncAlt } from 'react-icons/fa';
import { useUser } from '../../../../components/ui/login/UserDataProvider';
import Userimage from '../../../../assets/images/userimg.png';

// تعریف نوع برای دیتای داشبورد بیمار
interface PatientDashboardData {
  appointments_count: number;
  medical_records_count: number;
  referrals_count: number;
}

// تعریف نوع برای دیتای کاربر از authData
interface AuthData {
  message: string;
  token: string;
  user: {
    id: number;
    name: string;
    phone: string;
    role: string;
    related_data?: {
      id: number;
      avatar?: string;
      address?: string;
      bio?: string;
      created_at: string;
      updated_at: string;
    };
  };
}

// داده‌های تستی برای داشبورد بیمار
const mockPatientDashboardData: PatientDashboardData = {
  appointments_count: 5,
  medical_records_count: 12,
  referrals_count: 3,
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

      // دریافت نوبت‌های آینده
      if (user) {
        try {
          const response = await fetch('/api/patient/appointments', {
            headers: {
              'Authorization': `Bearer ${(user as any).token}`,
              'Content-Type': 'application/json'
            }
          });
          if (response.ok) {
            const appointments = await response.json();
            setUpcomingAppointments(appointments);
          } else {
            console.error('Failed to fetch appointments');
          }
        } catch (error) {
          console.error('Error fetching appointments:', error);
        }
      }
    };
    if (!isLoading) {
      loadData();
    }
  }, [user, isLoading]);

  // هندلر دکمه بروزرسانی
  const handleRefresh = () => {
    // در واقعیت اینجا API call می‌کنیم
    // console.log("بروزرسانی داشبورد...");
  };

  if (isLoading) {
    return <div className="text-center py-10">در حال بارگذاری...</div>;
  }

  const profileImage = user?.related_data?.avatar || Userimage;

  return (
    <div className="px-4 min-h-screen" dir="rtl">
      {/* باکس اطلاعات کاربر */}
      <div className="mb-6 border border-gray-200 p-4 rounded-xl bg-primary flex items-center justify-between text-right transition-colors">
        <div>
          <h3 className="font-semibold mb-3 text-gray-700 flex items-center text-white">
            <img src={profileImage} alt="پروفایل کاربر" className="w-12 h-12 rounded-3xl ml-3 object-contain bg-white p-1" />
            {user?.name || "بیمار گرامی"}
          </h3>
          <p className="text-white">شماره موبایل: {user?.phone || "نامشخص"}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="bg-white text-white p-3 rounded-lg transition-colors flex items-center gap-2"
          >
            <FaSyncAlt className="text-primary" />
          </button>
          <a href="/UserProfile/Edit-account" className="block">
            <button className="bg-white text-primary px-4 py-2 rounded-lg">
              تنظیمات حساب کاربری
            </button>
          </a>
        </div>
      </div>

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
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        appointment.status === 'تایید شده'
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

    </div>
  );
};

export default Dashboard;