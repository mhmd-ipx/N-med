import React from 'react';
import SingleServiceCard from '../ui/ServiceCard/SingleServiceCard';
import type { Services, Doctor, provinces } from '../../types/types';

interface ServiceListProps {
  services: Array<{
    service: Services;
    doctor: Doctor;
    province: provinces;
  }>;
  loading: boolean;
}

const ServiceList: React.FC<ServiceListProps> = ({ services, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent absolute top-0"></div>
          </div>
          <p className="text-gray-600 mt-4 text-lg">در حال بارگذاری خدمات...</p>
        </div>

        {/* Skeleton Loading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-4 animate-pulse">
              <div className="w-full h-32 bg-gray-200 rounded-xl mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="flex justify-between items-center">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">هیچ خدماتی یافت نشد</h3>
          <p className="text-gray-500">لطفاً فیلترها را تغییر دهید یا عبارت جستجو را اصلاح کنید</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {services.map((item, index) => (
          <div key={`${item.service.id}-${index}`} className="transform hover:scale-105 transition-transform duration-200">
            <SingleServiceCard
              service={item.service}
              doctor={item.doctor}
              province={item.province}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceList;