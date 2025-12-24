import { HiOutlineMapPin, HiOutlinePhone, HiOutlineEnvelope, HiOutlineClock } from 'react-icons/hi2';
import type { Doctor } from '../../services/publicApi';

interface DoctorSidebarProps {
  doctor: Doctor;
}

const DoctorSidebar = ({ doctor }: DoctorSidebarProps) => {
  return (
    <div className="space-y-8">
      {/* Contact Info */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-right">اطلاعات تماس</h3>
        <div className="space-y-4">
          {doctor.user?.phone && (
            <div className="flex items-center gap-3">
              <HiOutlinePhone className="w-5 h-5 text-gray-400" />
              <span className="text-gray-900">{doctor.user.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-3">
            <HiOutlineEnvelope className="w-5 h-5 text-gray-400" />
            <span className="text-gray-900">info@niloudarman.ir</span>
          </div>
          {doctor.address && (
            <div className="flex items-center gap-3">
              <HiOutlineMapPin className="w-5 h-5 text-gray-400" />
              <span className="text-gray-900 text-sm">{doctor.address}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorSidebar;