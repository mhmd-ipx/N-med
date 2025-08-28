import { HiOutlineMapPin, HiOutlineClock, HiOutlineArrowLeft } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import type { Clinic } from '../../services/publicApi';

interface ClinicServicesProps {
  clinics: Clinic[];
}

const ClinicServices = ({ clinics }: ClinicServicesProps) => {
  if (!clinics || clinics.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-right">مطب ها و خدمات</h2>
        <p className="text-gray-500 text-center py-8">اطلاعات مطب در دسترس نیست</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-right">مطب ها و خدمات</h2>
      <div className="space-y-8">
        {clinics.map((clinic, clinicIndex) => (
          <div key={clinic.id} className="border border-gray-100 rounded-xl p-6">
            {/* Clinic Header */}
            <div className="flex items-start gap-3 mb-6">
              <HiOutlineMapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
              <div className="text-right flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{clinic.title || 'مطب'}</h3>
                <p className="text-sm text-gray-600 mt-1">{clinic.address || 'آدرس مشخص نشده'}</p>
              </div>
            </div>

            {/* Services */}
            {clinic.services && clinic.services.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {clinic.services.map((service) => (
                  <Link
                    key={service.id}
                    to={`/service/${service.id}`}
                    className="block"
                  >
                    <div className="group flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-blue-50 hover:shadow-md transition-all duration-200 cursor-pointer">
                      <div className="text-right flex-1">
                        <h4 className="font-medium text-gray-900 hover:text-blue-700 transition-colors">{service.title}</h4>
                        {service.description && (
                          <p className="text-xs text-gray-600 mt-1">{service.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <HiOutlineClock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{service.time} دقیقه</span>
                        </div>
                      </div>
                      <div className="text-left ml-4 flex items-center gap-2">
                        <div>
                          <div className="text-lg font-bold text-blue-600">
                            {service.price.toLocaleString('fa-IR')} تومان
                          </div>
                          {service.discount_price > 0 && service.discount_price !== service.price && (
                            <div className="text-xs text-green-600 line-through">
                              {service.discount_price.toLocaleString('fa-IR')} تومان
                            </div>
                          )}
                        </div>
                        <HiOutlineArrowLeft className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">هیچ خدماتی برای این مطب تعریف نشده است</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClinicServices;