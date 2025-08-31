import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiOutlineLocationMarker, HiOutlineClock, HiOutlineCurrencyDollar, HiOutlineEye, HiOutlineUser, HiOutlineMap, HiOutlinePhone, HiOutlineX, HiOutlineStar, HiOutlineCalendar } from 'react-icons/hi';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getDoctors, getDoctorById, type Doctor, type DoctorResponse } from '../services/referralApi';

// Fix for default marker icon in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});
import BookingSection from '../components/ui/Booking/BookingSection';

// Create a new public Axios instance with base configuration
const publicApi = axios.create({
  baseURL: 'https://api.niloudarman.ir',
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
     name: string;
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
    const navigate = useNavigate();
    const [service, setService] = useState<Service | null>(null);
    const [province, setProvince] = useState<Province | null>(null);
    const [loading, setLoading] = useState(true);
    const [showClinicModal, setShowClinicModal] = useState(false);
    const bookingSectionRef = useRef<HTMLDivElement>(null);

    // Function to scroll to booking section
    const scrollToBooking = () => {
      bookingSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    };

    // Function to parse geo coordinates
    const parseGeoCoordinates = (geoString: string) => {
      try {
        // Assuming format is "lat,lng" or similar
        const coords = geoString.split(',').map(coord => parseFloat(coord.trim()));
        if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
          return [coords[0], coords[1]] as [number, number];
        }
        // Default coordinates for Tehran if parsing fails
        return [35.6892, 51.3890] as [number, number];
      } catch (error) {
        console.error('Error parsing geo coordinates:', error);
        return [35.6892, 51.3890] as [number, number];
      }
    };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">

        {/* Service Header */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-gray-100">
          <div className="relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5"></div>

            <div className="relative p-8 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                {/* Service Image */}
                <div className="order-2 lg:order-1">
                  <div className="relative group">
                    <img
                      src={service.thumbnail}
                      alt={service.title}
                      className="w-full h-64 lg:h-80 object-cover rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>

                    {/* Service Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                      <span className="text-sm font-semibold text-gray-800">خدمت پزشکی</span>
                    </div>
                  </div>
                </div>

                {/* Service Information */}
                <div className="order-1 lg:order-2 space-y-6">
                  <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                      {service.title}
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* Get Appointment Button */}
                    <button
                      onClick={scrollToBooking}
                      className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-sm sm:text-base md:text-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <HiOutlineCalendar className="text-lg sm:text-xl md:text-2xl" />
                      دریافت نوبت
                    </button>
                  </div>

                  {/* Price Section */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 sm:p-6 border border-green-100">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-green-700 font-semibold text-sm sm:text-base">هزینه خدمت</span>
                      <HiOutlineCurrencyDollar className="text-green-600 text-lg sm:text-xl md:text-2xl" />
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      {service.discount_price > 0 && discountAmount > 0 ? (
                        <>
                          <div className="flex flex-col">
                            <span className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">
                              {service.discount_price.toLocaleString()} تومان
                            </span>
                            <span className="text-xs sm:text-sm text-gray-500 line-through">
                              {service.price.toLocaleString()} تومان
                            </span>
                          </div>
                          <div className="bg-green-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                            {discountPercentage}% تخفیف
                          </div>
                        </>
                      ) : (
                        <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                          {service.price.toLocaleString()} تومان
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Service Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <HiOutlineClock className="text-blue-500 text-lg sm:text-xl" />
                        <span className="font-semibold text-gray-700 text-sm sm:text-base">مدت زمان</span>
                      </div>
                      <p className="text-gray-600 text-sm sm:text-base">{service.time} دقیقه</p>
                    </div>

                    <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <HiOutlineLocationMarker className="text-blue-500 text-lg sm:text-xl" />
                        <span className="font-semibold text-gray-700 text-sm sm:text-base">استان</span>
                      </div>
                      <p className="text-gray-600 text-sm sm:text-base">{province ? province.faname : 'نامشخص'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clinic & Doctor Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

          {/* Clinic Information */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <HiOutlineMap className="text-blue-600 text-lg sm:text-xl" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">کلینیک</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">اطلاعات محل ارائه خدمت</p>
                </div>
              </div>
              <button
                onClick={() => setShowClinicModal(true)}
                className="flex items-center gap-1 sm:gap-2 bg-blue-50 text-blue-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors text-xs sm:text-sm font-medium"
              >
                <HiOutlineEye className="text-xs sm:text-sm" />
                مشاهده جزئیات
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <HiOutlineMap className="text-gray-400 text-base sm:text-lg mt-1" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">{service.clinic.name}</p>
                  <p className="text-gray-600 text-xs sm:text-sm">{service.clinic.address}</p>
                </div>
              </div>

              {service.clinic.phone && (
                <div className="flex items-center gap-2 sm:gap-3">
                  <HiOutlinePhone className="text-gray-400 text-base sm:text-lg" />
                  <p className="text-gray-600 text-sm sm:text-base">{service.clinic.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Doctor Information */}
          {service.doctor && (
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <HiOutlineUser className="text-green-600 text-lg sm:text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">پزشک معالج</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">اطلاعات پزشک ارائه دهنده خدمت</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/doctors/${service.doctor.id}`)}
                  className="flex items-center gap-1 sm:gap-2 bg-green-50 text-green-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-green-100 transition-colors text-xs sm:text-sm font-medium"
                >
                  <HiOutlineEye className="text-xs sm:text-sm" />
                  مشاهده پروفایل
                </button>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <img
                  src={service.doctor.avatar || '/n-med-logo.png'}
                  alt={`Doctor ${service.doctor.id}`}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover shadow-sm"
                />
                <div className="flex-1 space-y-2">
                  <h4 className="text-base sm:text-lg font-bold text-gray-900">
                    {service.doctor.user?.name ? `دکتر ${service.doctor.user.name}` : `دکتر ${service.doctor.name || service.doctor.id}`}
                  </h4>
                  {service.doctor.specialties && (
                    <p className="text-gray-600 text-xs sm:text-sm">
                      <span className="font-medium">تخصص:</span> {service.doctor.specialties}
                    </p>
                  )}
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <HiOutlineStar
                          key={i}
                          className={`text-xs sm:text-sm ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600 ml-2">۴.۲ از ۵</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Booking Section */}
        <div ref={bookingSectionRef} className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-gray-100">
          <BookingSection doctorId={service.doctor?.id} serviceId={service.id} service={service} />
        </div>

        {/* Clinic Details Modal */}
        {showClinicModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full mx-3 sm:mx-4 shadow-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <HiOutlineMap className="text-blue-600 text-lg sm:text-xl" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">جزئیات کلینیک</h2>
                </div>
                <button
                  onClick={() => setShowClinicModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <HiOutlineX className="text-lg sm:text-xl" />
                </button>
              </div>

              <div className="overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-80px)]">
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Clinic Information */}
                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">{service.clinic.name}</h3>
                        <p className="text-gray-600 text-xs sm:text-sm">{service.clinic.description}</p>
                      </div>

                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <HiOutlineMap className="text-gray-400 text-base sm:text-lg mt-1" />
                          <div>
                            <p className="font-medium text-gray-900 text-sm sm:text-base">آدرس</p>
                            <p className="text-gray-600 text-xs sm:text-sm">{service.clinic.address}</p>
                          </div>
                        </div>

                        {service.clinic.phone && (
                          <div className="flex items-center gap-2 sm:gap-3">
                            <HiOutlinePhone className="text-gray-400 text-base sm:text-lg" />
                            <div>
                              <p className="font-medium text-gray-900 text-sm sm:text-base">تلفن</p>
                              <p className="text-gray-600 text-xs sm:text-sm">{service.clinic.phone}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-2 sm:gap-3">
                          <HiOutlineLocationMarker className="text-gray-400 text-base sm:text-lg" />
                          <div>
                            <p className="font-medium text-gray-900 text-sm sm:text-base">استان</p>
                            <p className="text-gray-600 text-xs sm:text-sm">{province ? province.faname : 'نامشخص'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Map Section */}
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <HiOutlineMap className="text-blue-500 text-base sm:text-lg" />
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">موقعیت روی نقشه</h4>
                      </div>

                      <div className="h-48 sm:h-64 rounded-xl overflow-hidden border border-gray-200">
                        <MapContainer
                          center={parseGeoCoordinates(service.clinic.geo)}
                          zoom={15}
                          style={{ height: '100%', width: '100%' }}
                          className="rounded-xl"
                        >
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          />
                          <Marker position={parseGeoCoordinates(service.clinic.geo)}>
                            <Popup>
                              <div className="text-center">
                                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{service.clinic.name}</h4>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1">{service.clinic.address}</p>
                              </div>
                            </Popup>
                          </Marker>
                        </MapContainer>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3">
                        <p className="text-blue-800 text-xs sm:text-sm text-center">
                          📍 برای دیدن مسیر، روی نشانگر کلیک کنید
                        </p>
                      </div>
                    </div>
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

export default ServiceDetail;