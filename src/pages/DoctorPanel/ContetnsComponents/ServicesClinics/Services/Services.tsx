import React, { useEffect, useState } from 'react';
import { getServices } from '../../../../../services/serverapi.ts';
import type { ProfileInfoProps, Service, ServicesResponse } from '../../../../../types/types.ts';
import { HiOutlinePencil, HiOutlineMapPin , HiOutlineBuildingOffice, HiOutlineClock, HiOutlineCurrencyDollar, HiOutlineInformationCircle, HiOutlineUserGroup } from 'react-icons/hi2';

const Services: React.FC<ProfileInfoProps> = ({ token }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const CACHE_KEY = 'cached_services';

  const fetchAndCacheServices = async () => {
    try {
      setLoading(true);
      const response: ServicesResponse = await getServices();
      setServices(response.data);
      localStorage.setItem(CACHE_KEY, JSON.stringify(response.data));
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای ناشناخته');
      setLoading(false);
    }
  };

  useEffect(() => {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      try {
        const parsedData: Service[] = JSON.parse(cachedData);
        setServices(parsedData);
        setLoading(false);
      } catch (err) {
        console.error('خطا در تجزیه داده‌های کش:', err);
        fetchAndCacheServices();
      }
    } else {
      fetchAndCacheServices();
    }
  }, []);

  const handleRefresh = () => {
    fetchAndCacheServices();
  };

  const handleEdit = (service: Service) => {
    alert(`ویرایش سرویس: ${service.title}`);
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xl font-semibold">خدمات</span>
        <button
          onClick={handleRefresh}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center gap-2 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'در حال بارگذاری...' : 'به‌روزرسانی'}
        </button>
      </div>
      {loading ? (
        <div className="text-center">در حال بارگذاری...</div>
      ) : error ? (
        <div className="text-red-500 text-center">خطا: {error}</div>
      ) : services.length === 0 ? (
        <div className="text-center">سرویسی یافت نشد</div>
      ) : (
        <div className="grid  gap-4">
          {services.map((service) => (
            <div key={service.id} className="border rounded-xl  p-2 flex bg-white hover:bg-gray-50">
              {/* ستون راست: تامبنیل */}
              <div className="w-24 h-24 bg-light flex-shrink-0 rounded-lg flex items-center justify-center">
                {service.thumbnail && service.thumbnail !== 'null' ? (
                  <img
                    src={service.thumbnail}
                    alt={service.title}
                    className="w-24 h-24 object-cover rounded"
                  />
                ) : (
                  <HiOutlineBuildingOffice className="text-3xl text-primary" />
                )}
              </div>
              {/* ستون وسط: اطلاعات سرویس */}
              <div className="flex-1 px-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <span className='text-sm mr-2 font-semibold'>{service.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiOutlineMapPin className="w-5 h-5 text-gray-500" />
                    <span >{service.clinic.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiOutlineCurrencyDollar className="w-5 h-5 text-gray-500" />
                    <span>قیمت: {service.price.toLocaleString('fa-IR')} تومان</span>
                  </div>
                  {service.discount_price > 0 && (
                    <div className="flex items-center gap-2">
                      <HiOutlineCurrencyDollar className="w-5 h-5 text-gray-500" />
                      <span>قیمت با تخفیف: {service.discount_price.toLocaleString('fa-IR')} تومان</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <HiOutlineClock className="w-5 h-5 text-gray-500" />
                    <span>{service.time} دقیقه</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiOutlineInformationCircle className="w-5 h-5 text-gray-500" />
                    <span>توضیحات: {service.description}</span>
                  </div>
                  {service.user.length > 0 && (
                    <div className="flex items-start gap-2">
                      <HiOutlineUserGroup className="w-5 h-5 text-gray-500 mt-1" />
                      <div>
                        <span className="font-semibold">اوپراتورها:</span>
                        <ul className="list-disc pr-5">
                          {service.user.map((user) => (
                            <li key={user.id}>
                              {user.name} - {user.phone}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* ستون چپ: عملیات */}
              <div className="flex-shrink-0 flex items-center">
                <button
                  onClick={() => handleEdit(service)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
                >
                  <HiOutlinePencil className="w-5 h-5" />
                  ویرایش
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;