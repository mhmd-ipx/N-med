import React, { useEffect, useState } from 'react';
import { getServices } from '../../../../../services/serverapi.ts';
import type { ProfileInfoProps, Service, ServicesResponse } from '../../../../../types/types.ts';
import {
  HiOutlinePencilSquare,
  HiOutlineMapPin,
  HiOutlineBuildingOffice,
  HiOutlineClock,
  HiOutlineCurrencyDollar,
  HiOutlineInformationCircle,
  HiOutlineUserGroup,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineTrash,
  HiUser,
} from 'react-icons/hi2';

const Services: React.FC<ProfileInfoProps> = ({ token }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openDetails, setOpenDetails] = useState<number | null>(null);

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

  const handleDelete = (service: Service) => {
    alert(`حذف سرویس: ${service.title}`);
  };

  const toggleDetails = (id: number) => {
    setOpenDetails((prev) => (prev === id ? null : id));
  };

  const iconsstyle = 'text-xl text-gray-400';

  return (
    <div className="flex flex-col">
      <style>
        {`
          .details {
            max-height: 0;
            opacity: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
          }
          .details.open {
            max-height: 500px; /* تنظیم بر اساس نیاز */
            opacity: 1;
          }
        `}
      </style>
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
        <div className="grid gap-4">
          {services.map((service) => (
            <div key={service.id} className="border rounded-xl p-2 flex flex-col bg-white hover:bg-gray-50">
              <div className="flex">
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
                  <div className="flex mb-2">
                    <div className="flex w-1/2 items-center justify-start gap-2">
                      <span className="text-base mr-2 font-semibold">{service.title}</span>
                    </div>
                    <div className="flex w-1/2 items-center justify-start gap-2">
                      <HiOutlineMapPin className={iconsstyle} />
                      <span>{service.clinic.name}</span>
                    </div>
                  </div>
                  <div className="flex mb-2">
                    <div className="flex w-1/2 items-center justify-start gap-2">
                      <HiOutlineUserGroup className={iconsstyle} />
                      <span>{service.user.length} اوپراتور</span>
                    </div>
                    <div className="flex w-1/2 items-center justify-start gap-2">
                      <HiOutlineClock className={iconsstyle} />
                      <span>{service.time} دقیقه</span>
                    </div>
                  </div>
                  <div className="flex mb-2">
                    <div className="flex w-1/2 items-center gap-2">
                      <HiOutlineCurrencyDollar className={iconsstyle} />
                      <span className="text-sm">{service.price.toLocaleString('fa-IR')} تومان</span>
                    </div>
                    {service.discount_price > 0 && (
                      <div className="flex w-1/2 items-center gap-2">
                        <HiOutlineCurrencyDollar className={iconsstyle} />
                        <span className="text-red-500">{service.discount_price.toLocaleString('fa-IR')} تومان</span>
                      </div>
                    )}
                  </div>
                </div>
                {/* ستون چپ: عملیات */}
                <div className="flex flex-col items-end justify-center gap-2">
                  <div className="flex gap-2 items-end justify-end">
                    <button
                      className="text-primary flex gap-1 justify-center items-center"
                      onClick={() => handleEdit(service)}
                    >
                      <HiOutlinePencilSquare className="text-lg" />ویرایش
                    </button>
                    <button
                      className="text-red-500 hover:text-red-600 flex gap-1 p-1 text-xs justify-center items-center bg-red-100 rounded-md"
                      onClick={() => handleDelete(service)}
                      title="حذف سرویس"
                    >
                      <HiOutlineTrash className="text-lg" />
                    </button>
                  </div>
                  <button
                    onClick={() => toggleDetails(service.id)}
                    className="text-sm bg-light p-2 rounded text-primary hover:text-primary flex items-center gap-1"
                  >
                    {openDetails === service.id ? (
                      <>
                        مشاهده جزئیات <HiOutlineChevronUp />
                      </>
                    ) : (
                      <>
                        مشاهده جزئیات <HiOutlineChevronDown />
                      </>
                    )}
                  </button>
                </div>
              </div>
              {/* جزئیات مخفی‌شده با انیمیشن */}
              <div className={`details ${openDetails === service.id ? 'open' : ''}`}>
                <div className="mt-4 border-t pt-2">
                  <div className="flex items-start gap-2 mb-2">
                    <HiOutlineInformationCircle className={iconsstyle} />
                    <span>شرح: {service.description || '—'}</span>
                  </div>
                  {service.user.length > 0 && (
                    <div className="flex items-center gap-2 mt-5">
                      <HiOutlineUserGroup className={iconsstyle} />
                      <div>
                        {service.user.map((user) => (
                          <div key={user.phone} className="flex items-center gap-2">
                            <HiUser className="bg-light p-2 text-4xl rounded-full text-primary" />
                            <span className="font-medium">{user.name}</span>
                            <span className="text-gray-500">({user.phone})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;