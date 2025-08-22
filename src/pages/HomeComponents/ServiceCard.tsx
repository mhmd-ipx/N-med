import { useEffect, useState } from 'react';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

// وارد کردن توابع و تایپ‌ها از publicApi.ts
import {
  getDoctors as getPublicDoctors,
  getProvinces,
  type Doctor as PublicDoctor,
  type Province,
  type DoctorsResponse
} from '../../services/publicApi';


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
  thumbnail: string;
  title: string;
  description: string;
  time: number;
  price: number;
  discount_price: number;
  created_at: string;
  updated_at: string;
  doctorId?: number; // Implicitly assumed for doctor linking
}


// A new Axios instance for services, if it needs a token
// NOTE: Based on your previous request, all APIs should be public.
// So, we'll use a simplified public API for services as well.
import axios from 'axios';
const publicApi = axios.create({
  baseURL: 'http://api.niloudarman.ir',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getServices = async (): Promise<Service[]> => {
  try {
    const response = await publicApi.get<{ data: Service[] }>('/api/services');
    return response.data.data.map(service => ({
      ...service,
      doctorId: 2 // Hardcoding a doctor ID for example purposes
    }));
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
  doctor: PublicDoctor | undefined;
  province: Province | undefined;
}

const SingleServiceCard = ({ service, doctor, province }: SingleServiceCardProps) => {
  if (!doctor) return null;

  const discountAmount = service.price - service.discount_price;
  const discountPercentage = service.discount_price > 0 ? ((1 - service.discount_price / service.price) * 100).toFixed(0) : '0';

  return (
    <Link to={`/service/${service.id}`}>
      <div className="flex w-full flex-col bg-white border border-light hover:bg-light text-black rounded-2xl p-3 items-center justify-between shadow-lg">
        <div className="flex gap-4 w-full">
          <img src={service.thumbnail} alt={service.title} className="w-20 h-20 object-cover rounded-xl" />
          <div className="flex flex-1 flex-col justify-between">
            <h3 className="text-base font-bold">{service.title}</h3>
            <div className="flex justify-between mt-2">
              <div className="flex items-center justify-center gap-2">
                <img src={doctor.avatar || '/default-avatar.png'} alt={doctor.user.name} className="w-9 h-9 object-cover rounded-full" />
                <p className="text-sm">{doctor.user.name}</p>
              </div>
              <div className="flex flex-row items-center text-sm gap-1 text-gray-500">
                <HiOutlineLocationMarker className="text-lg" />
                <p>{province ? province.faname : 'نامشخص'}</p>
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
  const [doctors, setDoctors] = useState<PublicDoctor[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesData, doctorsResponse, provincesData] = await Promise.all([
          getServices(),
          getPublicDoctors(),
          getProvinces(),
        ]);

        console.log('Services:', servicesData);
        console.log('Doctors:', doctorsResponse);
        console.log('Provinces:', provincesData);

        if (Array.isArray(servicesData)) setServices(servicesData);
        if (doctorsResponse && doctorsResponse.data) setDoctors(doctorsResponse.data);
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
    <div className="gap-4 grid grid-cols-3">
      {services.slice(0, 6).map((service) => {
        const doctor = doctors.find((doc) => doc.id === service.doctorId);
        const province = provinces.find((prov) => prov.id === service.clinic.province_id);

        return (
          <SingleServiceCard
            key={service.id}
            service={service}
            doctor={doctor}
            province={province}
          />
        );
      })}
    </div>
  );
};

export default ServiceCard;