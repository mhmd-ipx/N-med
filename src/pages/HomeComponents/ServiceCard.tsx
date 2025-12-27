import { useEffect, useState } from 'react';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import defaultDoctorImage from '../../assets/images/Doctors/doctor1.jpg';

// وارد کردن توابع و تایپ‌ها از referralApi.ts
import {
  getDoctors,
  getDoctorById,
  type Doctor,
  type DoctorsResponse,
  type DoctorResponse
} from '../../services/referralApi';
import {
  getProvinces,
  type Province
} from '../../services/publicApi';

// A new Axios instance for services, if it needs a token
// NOTE: Based on your previous request, all APIs should be public.
// So, we'll use a simplified public API for services as well.
import axios from 'axios';
const publicApi = axios.create({
  baseURL: 'https://api.niloudarman.ir',
  headers: {
    'Content-Type': 'application/json',
  },
});


// TypeScript Interfaces
export interface Clinic {
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
}

export interface Service {
  id: number;
  clinic: Clinic;
  user: any[];
  doctor: {
    id: number;
    user_id: number;
    user?: {
      id: number;
      name: string;
      phone: string;
      role: string | null;
    };
    specialties: string | null;
    address: string | null;
    bio: string | null;
    avatar: string | null;
    code: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    pivot: {
      clinic_id: number;
      doctor_id: number;
    };
  };
  thumbnail: string;
  title: string;
  description: string;
  time: number;
  price: number;
  discount_price: number;
  created_at: string;
  updated_at: string;
}


export const getServices = async (): Promise<Service[]> => {
  try {
    const response = await publicApi.get<{ data: Service[] }>('/api/services');
    return response.data.data;
  } catch (error) {
    if (error instanceof Error && 'response' in error) {
      const axiosError = error as any;
      if (axiosError.response) {
        switch (axiosError.response.status) {
          case 400:
            throw new Error('درخواست نامعتبر است (400)');
          case 401:
            throw new Error('عدم احراز هویت (401)');
          case 403:
            throw new Error('دسترسی غیرمجاز (403)');
          case 422:
            throw new Error('داده‌های ورودی نامعتبر هستند (422)');
          case 500:
            throw new Error('خطای سرور (500)');
          default:
            throw new Error(`خطای ناشناخته API: ${axiosError.response.status}`);
        }
      } else if (axiosError.request) {
        throw new Error('هیچ پاسخی از سرور دریافت نشد');
      }
    }
    throw new Error('خطای ناشناخته در دریافت خدمات');
  }
};


// SingleServiceCard Component
interface SingleServiceCardProps {
  service: Service;
  doctor?: Doctor | undefined;
  province: Province | undefined;
}

const SingleServiceCard = ({ service, doctor, province }: SingleServiceCardProps) => {
  const [fetchedDoctor, setFetchedDoctor] = useState<Doctor | null>(null);
  const [loadingDoctor, setLoadingDoctor] = useState(false);

  // این شرط اکنون props اصلی را بررسی می‌کند
  // تا مطمئن شویم داده‌ها قبل از استفاده وجود دارند و خطایی رخ ندهد.
  if (!service) {
    return null;
  }

  // استفاده از doctor از service اگر موجود باشد، در غیر این صورت از doctor prop
  const doctorData = service.doctor || doctor;

  // اگر doctor data موجود نیست، سعی می‌کنیم از API دریافت کنیم
  useEffect(() => {
    const fetchDoctorData = async () => {
      if (!doctorData && service.doctor?.id) {
        try {
          setLoadingDoctor(true);
          const response = await getDoctorById(service.doctor.id);
          setFetchedDoctor(response.data);
        } catch (error) {
          console.error('Error fetching doctor:', error);
        } finally {
          setLoadingDoctor(false);
        }
      }
    };

    fetchDoctorData();
  }, [service.doctor?.id, doctorData]);

  // استفاده از doctor data - اولویت با prop، سپس fetched، سپس service.doctor
  const finalDoctorData = doctor || fetchedDoctor || doctorData;

  if (!finalDoctorData) {
    return null;
  }

  // استفاده از نام واقعی اگر موجود باشد، در غیر این صورت استفاده از ID
  const doctorName = 'name' in finalDoctorData && finalDoctorData.name ? `دکتر ${finalDoctorData.name}` : finalDoctorData.user?.name ? `دکتر ${finalDoctorData.user.name}` : `دکتر ${finalDoctorData.id}`;
console.log (finalDoctorData);
  // از "Nullish Coalescing" (|| 0) استفاده می‌کنیم تا مطمئن شویم
  // اگر service.discount_price وجود نداشت، به جای آن از صفر استفاده شود.
  const discountAmount = service.price - (service.discount_price || 0);

  // برای جلوگیری از خطای تقسیم بر صفر، ابتدا price را بررسی می‌کنیم.
  const discountPercentage = (service.price > 0 && service.discount_price > 0)
    ? ((1 - (service.discount_price / service.price)) * 100).toFixed(0)
    : '0';

  return (
    // در این قسمت، `service.id` کاملاً ایمن است زیرا وجود `service` را در بالا بررسی کرده‌ایم.
    <Link to={`/service/${service.id}`}>
      <div className="flex w-full flex-col bg-white border border-light hover:bg-light text-black rounded-2xl p-3 items-center justify-between shadow-lg">
        <div className="flex gap-4 w-full">
          {/* نام ویژگی‌های تصویر و عنوان را مطابق با API شما تغییر دادم */}
          <img src={service.thumbnail} alt={service.title} className="w-20 h-20 object-cover rounded-xl" />
          <div className="flex flex-1 flex-col justify-between">
            <h3 className="text-base font-bold">{service.title}</h3>
            <div className="flex justify-between mt-2">
              <div className="flex items-center justify-center gap-2">
                {/* نام ویژگی‌ها را مطابق با ساختار API شما تغییر دادم */}
                <img src={finalDoctorData.avatar || '/n-med-logo.png'} alt={doctorName} className="w-9 h-9 object-cover rounded-full" />
                <p className="text-sm">{doctorName}</p>
              </div>
              <div className="flex flex-row items-center text-sm gap-1 text-gray-500">
                <HiOutlineLocationMarker className="text-lg" />
                {/* از Optional Chaining (?.) استفاده می‌کنیم.
                    اگر `province` وجود نداشته باشد، `province?.name` به `undefined` تبدیل می‌شود.
                    سپس از `|| 'نامشخص'` استفاده می‌کنیم تا مقدار پیش‌فرض را نمایش دهد. */}
                <p>{province?.faname || 'نامشخص'}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-full h-2 my-2">
          <div className="absolute top-1/2 w-full border-t border-light"></div>
        </div>
        <div className="flex justify-between w-full items-center">
          <Button
            variant="outline"
            iconAlignment="start"
            size="sm"
            className="text-sm px-4"
          >
            نوتاش رزرو
          </Button>
          <div>
            {/* نام ویژگی را مطابق با API تغییر دادم */}
            {service.discount_price > 0 && discountAmount > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-xs line-through">{service.price.toLocaleString()}</span>
                <div className="flex items-center">
                  <span className="font-bold text-xl">{service.discount_price.toLocaleString()}</span>
                  <span className="text-sm mr-1">تومان</span>
                </div>
                <span className="bg-red-500 rounded-2xl p-1 px-2 text-white">{discountPercentage}%</span>
              </div>
            ) : (
              <div>
                <span className="font-bold text-xl">{service.price.toLocaleString()}</span>
                <span className="text-sm mr-1">تومان</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

// ServiceCard Component
const ServiceCard = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesData, provincesData] = await Promise.all([
          getServices(),
          getProvinces(),
        ]);

        // console.log('Services:', servicesData);
        // console.log('Provinces:', provincesData);

        if (Array.isArray(servicesData)) setServices(servicesData);
        if (Array.isArray(provincesData)) setProvinces(provincesData);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>در حال بارگذاری...</div>;
  if (services.length === 0) return <div>داده‌ای برای نمایش وجود ندارد</div>;

  return (
    <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {services.slice(0, 6).map((service) => {
        // پیدا کردن استان
        const province = provinces.find((prov) => prov.id === service.clinic?.province_id);

        return (
          <SingleServiceCard
            key={service.id}
            service={service}
            province={province}
          />
        );
      })}
    </div>
  );
};

export { SingleServiceCard };
export default ServiceCard;
