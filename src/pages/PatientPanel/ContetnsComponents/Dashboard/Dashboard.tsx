import React, { useState, useEffect } from "react";
import { FaUser, FaCalendarCheck, FaFileMedical, FaHeart, FaSyncAlt } from 'react-icons/fa';

// تعریف نوع برای دیتای داشبورد بیمار
interface PatientDashboardData {
  appointments_count: number;
  medical_records_count: number;
  referrals_count: number;
  favorites_count: number;
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
  favorites_count: 8,
};

// داده‌های تستی برای نوبت‌های آینده
const mockUpcomingAppointments = [
  {
    id: 1,
    doctorName: 'دکتر علی رضایی',
    specialty: 'قلب و عروق',
    date: '۱۴۰۳/۰۶/۱۵',
    time: '۱۴:۳۰',
    clinic: 'کلینیک قلب تهران',
    status: 'تایید شده'
  },
  {
    id: 2,
    doctorName: 'دکتر مریم احمدی',
    specialty: 'داخلی',
    date: '۱۴۰۳/۰۶/۱۸',
    time: '۱۰:۰۰',
    clinic: 'بیمارستان روزبه',
    status: 'در انتظار'
  },
  {
    id: 3,
    doctorName: 'دکتر رضا کرمی',
    specialty: 'ارتوپدی',
    date: '۱۴۰۳/۰۶/۲۰',
    time: '۱۶:۰۰',
    clinic: 'کلینیک ارتوپدی اصفهان',
    status: 'تایید شده'
  }
];

// داده‌های تستی برای پزشکان مورد علاقه
const mockFavoriteDoctors = [
  { id: 1, name: 'دکتر علی رضایی', specialty: 'قلب و عروق' },
  { id: 2, name: 'دکتر مریم احمدی', specialty: 'داخلی' },
  { id: 3, name: 'دکتر رضا کرمی', specialty: 'ارتوپدی' },
  { id: 4, name: 'دکتر سارا حسینی', specialty: 'زنان و زایمان' },
];

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<PatientDashboardData>(mockPatientDashboardData);
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // لود اولیه دیتا
  useEffect(() => {
    const loadData = () => {
      try {
        setLoading(true);
        // دریافت اطلاعات کاربر از localStorage
        const storedAuthData = localStorage.getItem("authData");
        if (storedAuthData) {
          const parsedAuthData = JSON.parse(storedAuthData);
          setAuthData(parsedAuthData);
        }

        // در واقعیت اینجا از API دریافت می‌کنیم
        setDashboardData(mockPatientDashboardData);
      } catch (err) {
        console.error("خطا در لود اطلاعات داشبورد:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // هندلر دکمه بروزرسانی
  const handleRefresh = () => {
    // در واقعیت اینجا API call می‌کنیم
    // console.log("بروزرسانی داشبورد...");
  };

  if (loading) {
    return <div className="text-center py-10">در حال بارگذاری...</div>;
  }

  return (
    <div className="px-4 min-h-screen" dir="rtl">
      {/* باکس اطلاعات کاربر */}
      <div className="mb-6 border border-gray-200 p-4 rounded-xl bg-primary flex items-center justify-between text-right transition-colors">
        <div>
          <h3 className="font-semibold mb-3 text-gray-700 flex items-center text-white">
            <FaUser className="text-primary bg-white p-2 rounded-3xl text-4xl ml-3" />
            {authData?.user.name || "بیمار گرامی"}
          </h3>
          <p className="text-white">شماره موبایل: {authData?.user.phone || "نامشخص"}</p>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <a href="/UserProfile/Appointments" className="block">
          <div className="border border-gray-200 p-4 rounded-xl bg-white flex items-center text-right hover:bg-gray-50 transition-colors">
            <FaCalendarCheck className="text-3xl text-primary ml-3" />
            <div>
              <h3 className="font-semibold text-gray-700">نوبت‌های فعال</h3>
              <p className="text-2xl font-bold text-gray-800">{dashboardData.appointments_count}</p>
            </div>
          </div>
        </a>
        <a href="/UserProfile/Appointments" className="block">
          <div className="border border-gray-200 p-4 rounded-xl bg-white flex items-center text-right hover:bg-gray-50 transition-colors">
            <FaFileMedical className="text-3xl text-primary ml-3" />
            <div>
              <h3 className="font-semibold text-gray-700">سوابق پزشکی</h3>
              <p className="text-2xl font-bold text-gray-800">{dashboardData.medical_records_count}</p>
            </div>
          </div>
        </a>
        <a href="/UserProfile/References" className="block">
          <div className="border border-gray-200 p-4 rounded-xl bg-white flex items-center text-right hover:bg-gray-50 transition-colors">
            <FaHeart className="text-3xl text-primary ml-3" />
            <div>
              <h3 className="font-semibold text-gray-700">پزشکان مورد علاقه</h3>
              <p className="text-2xl font-bold text-gray-800">{dashboardData.favorites_count}</p>
            </div>
          </div>
        </a>
        <a href="/UserProfile/References" className="block">
          <div className="border border-gray-200 p-4 rounded-xl bg-white flex items-center text-right hover:bg-gray-50 transition-colors">
            <FaUser className="text-3xl text-primary ml-3" />
            <div>
              <h3 className="font-semibold text-gray-700">ارجاعات دریافتی</h3>
              <p className="text-2xl font-bold text-gray-800">{dashboardData.referrals_count}</p>
            </div>
          </div>
        </a>
      </div>

      {/* دیو دو ستونه برای نوبت‌ها و پزشکان مورد علاقه */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <a href="/UserProfile/Appointments" className="block">
          <div className="border p-4 rounded-xl bg-white hover:bg-gray-50">
            <h3 className="font-semibold mb-3 text-gray-700 flex items-center gap-2 text-lg">
              <FaCalendarCheck className="text-2xl text-primary ml-3" />
              نوبت‌های آینده
            </h3>
            <div className="space-y-3">
              {mockUpcomingAppointments.map((appointment) => (
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

        <a href="/UserProfile/References" className="block">
          <div className="border p-4 rounded-xl bg-white hover:bg-gray-50">
            <h3 className="font-semibold mb-3 text-gray-700 flex items-center gap-2 text-lg">
              <FaHeart className="text-2xl text-primary ml-3" />
              پزشکان مورد علاقه
            </h3>
            <div className="space-y-3">
              {mockFavoriteDoctors.map((doctor) => (
                <div key={doctor.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{doctor.name}</p>
                      <p className="text-sm text-gray-600">{doctor.specialty}</p>
                    </div>
                    <FaHeart className="text-red-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </a>
      </div>

      {/* بخش اطلاعات سلامت */}
      <div className="border p-4 rounded-xl bg-white">
        <h3 className="font-semibold mb-3 text-gray-700 flex items-center gap-2 text-lg">
          <FaFileMedical className="text-2xl text-primary ml-3" />
          اطلاعات سلامت شما
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">گروه خونی</h4>
            <p className="text-blue-600">O+</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">آلرژی‌ها</h4>
            <p className="text-green-600">ندارد</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-2">بیماری‌های زمینه‌ای</h4>
            <p className="text-purple-600">فشار خون بالا</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;