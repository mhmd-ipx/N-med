import React, { useState, useEffect, Component } from "react";
import type { ErrorInfo } from "react";
import { getDoctorDashboard } from "../../../../services/serverapi";
import { getWalletBalance } from "../../../../services/walletApi";
import { FaClinicMedical, FaCalendarCheck, FaExchangeAlt, FaStethoscope, FaMapMarkerAlt, FaDollarSign, FaWallet } from 'react-icons/fa';

// تعریف نوع برای دیتای داشبورد
interface DashboardData {
  clinics_count: number;
  services_count: number;
  appointments_count: number;
  referrals_count: number;
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
  const [clinicsData, setClinicsData] = useState<ClinicsCache | null>(null);
  const [servicesData, setServicesData] = useState<Service[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // تابع برای لود دیتا از API و ذخیره در لوکال استوریج
  const fetchAndUpdateData = async () => {
    try {
      setLoading(true);
      const [dashboard, walletData] = await Promise.all([
        getDoctorDashboard(),
        getWalletBalance().catch(() => ({ data: { balance: 0, formatted_balance: '0 تومان' } }))
      ]);
      // ذخیره دیتا در لوکال استوریج
      localStorage.setItem("dashboardData", JSON.stringify(dashboard));
      setDashboardData(dashboard);
      setWalletBalance(walletData.data.balance);
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
        const storedClinicsData = localStorage.getItem("clinics_cache");
        const storedServicesData = localStorage.getItem("cached_services");

        if (storedDashboardData && storedClinicsData && storedServicesData) {
          try {
            const parsedDashboardData = JSON.parse(storedDashboardData);
            const parsedClinicsData = JSON.parse(storedClinicsData);
            const parsedServicesData = JSON.parse(storedServicesData);
            // اعتبارسنجی ساده
            if (
              parsedDashboardData &&
              typeof parsedDashboardData === "object" &&
              "clinics_count" in parsedDashboardData &&
              parsedClinicsData &&
              typeof parsedClinicsData === "object" &&
              "clinics" in parsedClinicsData &&
              Array.isArray(parsedServicesData)
            ) {
              setDashboardData(parsedDashboardData);
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

  if (loading) {
    return <div className="text-center py-10">در حال بارگذاری...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <DashboardErrorBoundary>
      <div className="px-4 min-h-screen " dir="rtl">

        {/* چهار باکس چارتی */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <a href="/doctor-Profile/Wallet" className="block">
            <div className="border border-gray-200 p-4 rounded-xl bg-white flex items-center text-right hover:bg-gray-50 transition-colors">
              <FaWallet className="text-3xl text-primary ml-3" />
              <div>
                <h3 className="font-semibold text-gray-700">موجودی کیف پول</h3>
                <p className="text-2xl font-bold text-gray-800">{new Intl.NumberFormat('fa-IR').format(walletBalance)} تومان</p>
              </div>
            </div>
          </a>
          <a href="/doctor-Profile/Services" className="block">
            <div className="border border-gray-200 p-4 rounded-xl bg-white flex items-center text-right hover:bg-gray-50 transition-colors">
              <FaExchangeAlt className="text-3xl text-primary ml-3" />
              <div>
                <h3 className="font-semibold text-gray-700">تعداد ارجاعات  </h3>
                <p className="text-2xl font-bold text-gray-800">{dashboardData.referrals_count}</p>
              </div>
            </div>
          </a>
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
              <FaStethoscope className="text-3xl text-primary ml-3" />
              <div>
                <h3 className="font-semibold text-gray-700">تعداد خدمات</h3>
                <p className="text-2xl font-bold text-gray-800">{dashboardData.services_count}</p>
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

        {/* محل تبلیغات و بنر */}
        <div className="mt-6 mb-4">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-50 text-center">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">محل تبلیغات و بنر شما</h3>
            <p className="text-sm text-gray-500">این فضا برای نمایش تبلیغات و بنرهای شما در نظر گرفته شده است</p>
          </div>
        </div>
      </div>
    </DashboardErrorBoundary>
  );
};

export default Dashboard;