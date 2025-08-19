import React, { useState, useEffect, Component } from "react";
import type { ErrorInfo } from "react";
import { getDoctorDashboard } from "../../../../services/serverapi";
import type { DoctorDashboardResponse } from "../../../../types/types";
import { FaUser, FaClinicMedical, FaCalendarCheck, FaExchangeAlt, FaStethoscope, FaMapMarkerAlt, FaDollarSign, FaSyncAlt } from 'react-icons/fa';

// تعریف نوع برای دیتای داشبورد
interface DashboardData {
  clinics_count: number;
  services_count: number;
  appointments_count: number;
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
    related_data: {
      id: number;
      specialties: null;
      address: null;
      bio: null;
      avatar: null;
      code: null;
      status: string;
      clinics: Clinic[];
      created_at: string;
      updated_at: string;
    };
  };
}

// تعریف نوع برای کلینیک‌ها از clinics_cache
interface ClinicsCache {
  clinics: Clinic[];
  timestamp: number;
}

interface Clinic {
  id: number;
  name: string;
  address: string;
  phone: string;
  description: null | string;
  avatar: null | string;
  geo: string;
  city: {
    id: number;
    province_id: number;
    enname: string;
    faname: string;
    created_at: string;
    updated_at: string;
  };
  province: {
    id: number;
    enname: string;
    faname: string;
    created_at: string;
    updated_at: string;
  };
  created_at: string;
  updated_at: string;
}

// تعریف نوع برای خدمات از cached_services
interface Service {
  id: number;
  clinic: {
    id: number;
    name: string;
    address: string;
    phone: string;
    description: null | string;
    geo: string;
    province_id: number;
    city_id: number;
    created_at: string;
    updated_at: string;
  };
  user: any[];
  thumbnail: string;
  title: string;
  description: null | string;
  time: number;
  price: number;
  discount_price: number;
  created_at: string;
  updated_at: string;
}

// تابع فرضی برای دریافت اطلاعات کاربر (حالا از API واقعی یا فرضی)
const getUserData = async (): Promise<AuthData> => {
  // فرضی: در واقعیت از API بگیرید
  return JSON.parse(localStorage.getItem('authData') || '{}') as AuthData;
};

// تابع فرضی برای دریافت کلینیک‌ها
const getClinicsData = async (): Promise<ClinicsCache> => {
  // فرضی
  return JSON.parse(localStorage.getItem('clinics_cache') || '{}') as ClinicsCache;
};

// تابع فرضی برای دریافت خدمات
const getServicesData = async (): Promise<Service[]> => {
  // فرضی
  return JSON.parse(localStorage.getItem('cached_services') || '[]') as Service[];
};

// Error Boundary
class DashboardErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError(_: Error): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error in Dashboard:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-10 text-red-600" dir="rtl">
          خطایی در نمایش داشبورد رخ داد. لطفاً دوباره تلاش کنید.
        </div>
      );
    }
    return this.props.children;
  }
}

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    clinics_count: 0,
    services_count: 0,
    appointments_count: 0,
    referrals_count: 0,
  });
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [clinicsData, setClinicsData] = useState<ClinicsCache | null>(null);
  const [servicesData, setServicesData] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // تابع برای لود دیتا از API و ذخیره در لوکال استوریج
  const fetchAndUpdateData = async () => {
    try {
      setLoading(true);
      const [dashboard,] = await Promise.all([
        getDoctorDashboard(),

      ]);
      // ذخیره دیتا در لوکال استوریج
      localStorage.setItem("dashboardData", JSON.stringify(dashboard));
      setDashboardData(dashboard);
    } catch (err: any) {
      setError(err.message || "خطایی در دریافت اطلاعات رخ داد");
    } finally {
      setLoading(false);
    }
  };

  // لود اولیه دیتا
  useEffect(() => {
    const loadData = () => {
      try {
        setLoading(true);
        // چک کردن لوکال استوریج
        const storedDashboardData = localStorage.getItem("dashboardData");
        const storedAuthData = localStorage.getItem("authData");
        const storedClinicsData = localStorage.getItem("clinics_cache");
        const storedServicesData = localStorage.getItem("cached_services");

        if (storedDashboardData && storedAuthData && storedClinicsData && storedServicesData) {
          try {
            const parsedDashboardData = JSON.parse(storedDashboardData);
            const parsedAuthData = JSON.parse(storedAuthData);
            const parsedClinicsData = JSON.parse(storedClinicsData);
            const parsedServicesData = JSON.parse(storedServicesData);
            // اعتبارسنجی ساده
            if (
              parsedDashboardData &&
              typeof parsedDashboardData === "object" &&
              "clinics_count" in parsedDashboardData &&
              parsedAuthData &&
              typeof parsedAuthData === "object" &&
              "user" in parsedAuthData &&
              parsedClinicsData &&
              typeof parsedClinicsData === "object" &&
              "clinics" in parsedClinicsData &&
              Array.isArray(parsedServicesData)
            ) {
              setDashboardData(parsedDashboardData);
              setAuthData(parsedAuthData);
              setClinicsData(parsedClinicsData);
              setServicesData(parsedServicesData);
              setLoading(false);
              return;
            }
          } catch (e) {
            console.error("خطا در پارس کردن دیتای لوکال استوریج:", e);
          }
        }
        // اگه دیتا نبود یا نامعتبر بود، از API بگیر
        fetchAndUpdateData();
      } catch (err: any) {
        setError(err.message || "خطایی در لود اطلاعات رخ داد");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // هندلر دکمه بروزرسانی
  const handleRefresh = async () => {
    await fetchAndUpdateData();
  };

  if (loading) {
    return <div className="text-center py-10">در حال بارگذاری...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <DashboardErrorBoundary>
      <div className="px-4 min-h-screen " dir="rtl">


        {/* باکس اطلاعات کاربر */}

        <div className="mb-6 border border-gray-200 p-4 rounded-xl bg-primary flex items-center justify-between text-right transition-colors">
          <div>
            <h3 className="font-semibold mb-3 text-gray-700 flex items-center text-white">
              <FaUser className="text-primary bg-white p-2 rounded-3xl text-4xl ml-3" />
              دکتر {authData?.user.name || "نامشخص"}            </h3>
            <p className="text-white">شماره موبایل: {authData?.user.phone || "نامشخص"}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
            onClick={handleRefresh}
            className="bg-white text-white p-3 rounded-lg  transition-colors flex items-center gap-2"
            >
            <FaSyncAlt className="text-primary "/>
            </button>
            <a href="/account-settings" className="block">
              <button className="bg-white text-primary px-4 py-2 rounded-lg">
                تنظیمات حساب کاربری
              </button>
            </a>
          </div>
          
        </div>


        {/* چهار باکس چارتی */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <a href="/doctor-Profile/Turns" className="block">
            <div className="border border-gray-200 p-4 rounded-xl bg-white flex items-center text-right hover:bg-gray-50 transition-colors">
              <FaCalendarCheck className="text-3xl text-primary ml-3" />
              <div>
                <h3 className="font-semibold text-gray-700">تعداد نوبت‌ها</h3>
                <p className="text-2xl font-bold text-gray-800">{dashboardData.appointments_count}</p>
              </div>
            </div>
          </a>
          <a href="/doctor-Profile/Services" className="block">
            <div className="border border-gray-200 p-4 rounded-xl bg-white flex items-center text-right hover:bg-gray-50 transition-colors">
              <FaClinicMedical className="text-3xl text-primary ml-3" />
              <div>
                <h3 className="font-semibold text-gray-700">تعداد کلینیک‌ها</h3>
                <p className="text-2xl font-bold text-gray-800">{dashboardData.clinics_count}</p>
              </div>
            </div>
          </a>
          <a href="/doctor-Profile/Services" className="block">
            <div className="border border-gray-200 p-4 rounded-xl bg-white flex items-center text-right hover:bg-gray-50 transition-colors">
              <FaStethoscope className="text-3xl text-primary ml-3" />
              <div>
                <h3 className="font-semibold text-gray-700">تعداد خدمات</h3>
                <p className="text-2xl font-bold text-gray-800">{dashboardData.services_count}</p>
              </div>
            </div>
          </a>
          <a href="/doctor-Profile/References" className="block">
            <div className="border border-gray-200 p-4 rounded-xl bg-white flex items-center text-right hover:bg-gray-50 transition-colors">
              <FaExchangeAlt className="text-3xl text-primary ml-3" />
              <div>
                <h3 className="font-semibold text-gray-700">تعداد ارجاعات</h3>
                <p className="text-2xl font-bold text-gray-800">{dashboardData.referrals_count}</p>
              </div>
            </div>
          </a>
        </div>

        {/* دیو دو ستونه برای نوبت‌ها و ارجاعات */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <a href="/doctor-Profile/Turns" className="block">
            <div className="border p-4 rounded-xl  bg-white hover:bg-gray-50">
              <h3 className="font-semibold mb-3 text-gray-700 flex items-center gap-2 text-lg">
                <FaCalendarCheck className="text-2xl text-primary ml-3" />
                آخرین نوبت ها
              </h3>
              {/* فعلا خالی */}
              <p className="text-gray-600">اطلاعاتی موجود نیست.</p>
            </div>
          </a>
          <a href="/doctor-Profile/References" className="block">
            <div className="border p-4 rounded-xl  bg-white hover:bg-gray-50">
              <h3 className="font-semibold mb-3 text-gray-700 flex items-center gap-2 text-lg">
                <FaExchangeAlt className="text-2xl text-primary ml-3" />
                ارجاعات
              </h3>
              {/* فعلا خالی */}
              <p className="text-gray-600">اطلاعاتی موجود نیست.</p>
            </div>
          </a>

          
        </div>

        {/* دیو دو ستونه برای کلینیک‌ها و خدمات */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/doctor-Profile/Services" className="block">
            <div className="border p-4 rounded-xl  bg-white hover:bg-gray-50">
              <h3 className="font-semibold mb-3 text-gray-700 flex items-center gap-2 text-lg">
                <FaMapMarkerAlt className="text-2xl text-primary ml-3" />
                کلینیک‌های من
              </h3>
              <ul className="list-disc pr-1 space-y-2">
                {clinicsData?.clinics && clinicsData.clinics.length > 0 ? (
                  clinicsData.clinics.map((clinic) => (
                    <li key={clinic.id} className="text-gray-600 flex items-center gap-2">
                      <FaClinicMedical className="text-light" />
                      {clinic.name} - {clinic.address}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-600">کلینیکی ثبت نشده است</li>
                )}
              </ul>
            </div>
          </a>
          
          <a href="/doctor-Profile/Services" className="block">
            <div className="border p-4 rounded-xl  bg-white hover:bg-gray-50">
              <h3 className="font-semibold mb-3 text-gray-700 flex items-center gap-2 text-lg">
                <FaStethoscope className="text-2xl text-primary ml-3" />
                خدمات
              </h3>
              <ul className="list-disc pr-1 space-y-2">
                {servicesData.length > 0 ? (
                  servicesData.map((service) => (
                    <li key={service.id} className="text-gray-600 flex items-center gap-2">
                      <FaDollarSign className="text-light" />
                      {service.title} - قیمت: {service.price} - قیمت تخفیفی: {service.discount_price}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-600">سرویسی ثبت نشده است</li>
                )}
              </ul>
            </div>
          </a>
          
        </div>
      </div>
    </DashboardErrorBoundary>
  );
};

export default Dashboard;