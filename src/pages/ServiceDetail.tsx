import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { HiOutlineLocationMarker, HiOutlineClock, HiOutlineCurrencyDollar } from 'react-icons/hi';
import BookingSection from '../components/ui/Booking/BookingSection';

// Create a new public Axios instance with base configuration
const publicApi = axios.create({
  baseURL: 'http://api.niloudarman.ir',
  headers: {
    'Content-Type': 'application/json',
  },
});

// TypeScript Interfaces
interface Clinic {
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

interface Service {
   id: number;
   clinic: Clinic;
   user: any[];
   doctor: {
     id: number;
     user_id: number;
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


interface Province {
  id: number;
  enname: string;
  faname: string;
  created_at: string;
  updated_at: string;
}

// API Functions
const getServiceById = async (id: number): Promise<Service> => {
  try {
    const response = await publicApi.get<{ data: Service[] }>('/api/services');
    const service = response.data.data.find(s => s.id === id);
    if (!service) throw new Error('Service not found');
    return service;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      switch (error.response.status) {
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
          throw new Error(`خطای ناشناخته API: ${error.response.status}`);
      }
    } else if (axios.isAxiosError(error) && error.request) {
      throw new Error('هیچ پاسخی از سرور دریافت نشد');
    }
    throw new Error('خطای ناشناخته در دریافت سرویس');
  }
};


const getProvinces = async (): Promise<Province[]> => {
  try {
    const response = await publicApi.get<Province[]>('/api/provinces');
    return response.data;
  } catch (error) {
    throw new Error('خطا در دریافت لیست استان‌ها');
  }
};

// Service Detail Component
const ServiceDetail = () => {
   const { id } = useParams<{ id: string }>();
   const [service, setService] = useState<Service | null>(null);
   const [province, setProvince] = useState<Province | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
     const fetchData = async () => {
       try {
         setLoading(true);
         const [serviceData, provincesData] = await Promise.all([
           getServiceById(Number(id)),
           getProvinces(),
         ]);

         setService(serviceData);
         setProvince(provincesData.find(prov => prov.id === serviceData.clinic.province_id) || null);
       } catch (err) {
         console.error('Error fetching data:', err);
       } finally {
         setLoading(false);
       }
     };
     fetchData();
   }, [id]);

  if (loading) return <div className="text-center text-xl font-bold text-gray-600 py-10">در حال بارگذاری...</div>;
  if (!service) return <div className="text-center text-xl font-bold text-blue-500 py-10">سرویس یافت نشد</div>;

  const discountAmount = service.price - service.discount_price;
  const discountPercentage = service.discount_price > 0 ? ((1 - service.discount_price / service.price) * 100).toFixed(0) : '0';

  return (
    <div className="container mx-auto p-4 md:p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 mb-8 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="w-full lg:w-1/3">
            <img
              src={service.thumbnail}
              alt={service.title}
              className="w-full h-48 md:h-64 object-cover rounded-xl shadow-md"
            />
          </div>
          <div className="w-full lg:w-2/3">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{service.title}</h1>
            <p className="text-gray-600 mb-6 text-sm md:text-base">{service.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <HiOutlineLocationMarker className="text-xl md:text-2xl text-blue-500" />
                <p className="text-gray-700 text-sm md:text-base">
                  <span className="font-semibold">کلینیک:</span> {service.clinic.name}, {service.clinic.address}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <HiOutlineLocationMarker className="text-xl md:text-2xl text-blue-500" />
                <p className="text-gray-700 text-sm md:text-base">
                  <span className="font-semibold">استان:</span> {province ? province.faname : 'نامشخص'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <HiOutlineClock className="text-xl md:text-2xl text-blue-500" />
                <p className="text-gray-700 text-sm md:text-base">
                  <span className="font-semibold">مدت زمان:</span> {service.time} دقیقه
                </p>
              </div>
              <div className="flex items-center gap-2">
                <HiOutlineCurrencyDollar className="text-xl md:text-2xl text-blue-500" />
                <div>
                  {service.discount_price > 0 && discountAmount > 0 ? (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="text-gray-500 text-xs sm:text-sm line-through">{service.price.toLocaleString()} تومان</span>
                      <span className="text-lg sm:text-xl font-bold text-blue-500">{service.discount_price.toLocaleString()} تومان</span>
                      <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">{discountPercentage}% تخفیف</span>
                    </div>
                  ) : (
                    <span className="text-lg sm:text-xl font-bold text-gray-800">{service.price.toLocaleString()} تومان</span>
                  )}
                </div>
              </div>
            </div>
            {service.doctor && (
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={service.doctor.avatar || '/default-avatar.png'}
                  alt={`Doctor ${service.doctor.id}`}
                  className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-full shadow-sm"
                />
                <div>
                  <p className="text-gray-700 font-semibold text-sm md:text-base">پزشک: دکتر {service.doctor.id}</p>
                  <p className="text-gray-500 text-xs md:text-sm">شناسه پزشک: {service.doctor.id}</p>
                  {service.doctor.specialties && (
                    <p className="text-gray-500 text-xs md:text-sm">تخصص: {service.doctor.specialties}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <BookingSection doctorId={service.doctor?.id} serviceId={service.id} />
    </div>
  );
};

export default ServiceDetail;