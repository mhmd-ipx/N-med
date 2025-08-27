import React, { useState, useEffect } from "react";
import { FaUser, FaPhone, FaMapMarkerAlt, FaFileMedical, FaHeart, FaSave, FaTimes } from 'react-icons/fa';
import Button from '../../../../components/ui/Button';

// تعریف نوع برای اطلاعات بیمار
interface PatientInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  birthDate: string;
  gender: string;
  bloodType: string;
  allergies: string;
  medicalConditions: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
  };
}

// داده‌های تستی اولیه
const initialPatientInfo: PatientInfo = {
  name: "احمد رضایی",
  phone: "09123456789",
  email: "ahmad@example.com",
  address: "تهران، خیابان ولیعصر",
  birthDate: "1365/01/15",
  gender: "مرد",
  bloodType: "O+",
  allergies: "ندارد",
  medicalConditions: "فشار خون بالا",
  emergencyContact: {
    name: "فاطمه رضایی",
    phone: "09198765432",
    relationship: "همسر"
  },
  insurance: {
    provider: "بیمه ایران",
    policyNumber: "IR123456789"
  }
};

const EditAccount: React.FC = () => {
  const [patientInfo, setPatientInfo] = useState<PatientInfo>(initialPatientInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // لود اطلاعات از localStorage یا API
  useEffect(() => {
    const loadPatientInfo = () => {
      try {
        const storedInfo = localStorage.getItem('patientInfo');
        if (storedInfo) {
          setPatientInfo(JSON.parse(storedInfo));
        }
      } catch (err) {
        console.error('خطا در لود اطلاعات بیمار:', err);
      }
    };
    loadPatientInfo();
  }, []);

  // هندلر تغییرات فرم
  const handleInputChange = (field: string, value: string | object) => {
    if (typeof value === 'object') {
      setPatientInfo(prev => ({
        ...prev,
        [field]: { ...prev[field as keyof PatientInfo] as object, ...value }
      }));
    } else {
      setPatientInfo(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // هندلر ذخیره تغییرات
  const handleSave = async () => {
    setLoading(true);
    try {
      // در واقعیت اینجا API call می‌کنیم
      localStorage.setItem('patientInfo', JSON.stringify(patientInfo));
      setMessage('اطلاعات با موفقیت ذخیره شد');
      setIsEditing(false);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage('خطا در ذخیره اطلاعات');
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  // هندلر لغو ویرایش
  const handleCancel = () => {
    // بازنشانی به آخرین اطلاعات ذخیره شده
    const storedInfo = localStorage.getItem('patientInfo');
    if (storedInfo) {
      setPatientInfo(JSON.parse(storedInfo));
    } else {
      setPatientInfo(initialPatientInfo);
    }
    setIsEditing(false);
    setMessage(null);
  };

  return (
    <div className="px-4 min-h-screen" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* هدر */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">ویرایش اطلاعات حساب کاربری</h2>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button
                variant="solid"
                size="sm"
                className="bg-primary text-white"
                onClick={() => setIsEditing(true)}
              >
                ویرایش اطلاعات
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500 text-red-500 hover:bg-red-50"
                  onClick={handleCancel}
                >
                  <FaTimes className="ml-2" />
                  لغو
                </Button>
                <Button
                  variant="solid"
                  size="sm"
                  className="bg-green-500 text-white hover:bg-green-600"
                  onClick={handleSave}
                  disabled={loading}
                >
                  <FaSave className="ml-2" />
                  {loading ? 'در حال ذخیره...' : 'ذخیره'}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* پیام وضعیت */}
        {message && (
          <div className={`mb-4 p-3 rounded-lg ${
            message.includes('خطا')
              ? 'bg-red-100 text-red-700 border border-red-300'
              : 'bg-green-100 text-green-700 border border-green-300'
          }`}>
            {message}
          </div>
        )}

        {/* فرم اطلاعات شخصی */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaUser className="text-primary ml-2" />
            اطلاعات شخصی
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نام و نام خانوادگی
              </label>
              <input
                type="text"
                value={patientInfo.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                شماره موبایل
              </label>
              <input
                type="tel"
                value={patientInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ایمیل
              </label>
              <input
                type="email"
                value={patientInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تاریخ تولد
              </label>
              <input
                type="text"
                value={patientInfo.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                disabled={!isEditing}
                placeholder="مثال: ۱۳۶۵/۰۱/۱۵"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                جنسیت
              </label>
              <select
                value={patientInfo.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                disabled={!isEditing}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
              >
                <option value="مرد">مرد</option>
                <option value="زن">زن</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                گروه خونی
              </label>
              <select
                value={patientInfo.bloodType}
                onChange={(e) => handleInputChange('bloodType', e.target.value)}
                disabled={!isEditing}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              آدرس
            </label>
            <textarea
              value={patientInfo.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              disabled={!isEditing}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
            />
          </div>
        </div>

        {/* فرم اطلاعات پزشکی */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaFileMedical className="text-primary ml-2" />
            اطلاعات پزشکی
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                آلرژی‌ها
              </label>
              <textarea
                value={patientInfo.allergies}
                onChange={(e) => handleInputChange('allergies', e.target.value)}
                disabled={!isEditing}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                بیماری‌های زمینه‌ای
              </label>
              <textarea
                value={patientInfo.medicalConditions}
                onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                disabled={!isEditing}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* فرم اطلاعات تماس اضطراری */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaPhone className="text-primary ml-2" />
            اطلاعات تماس اضطراری
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نام و نام خانوادگی
              </label>
              <input
                type="text"
                value={patientInfo.emergencyContact.name}
                onChange={(e) => handleInputChange('emergencyContact', { name: e.target.value })}
                disabled={!isEditing}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                شماره تماس
              </label>
              <input
                type="tel"
                value={patientInfo.emergencyContact.phone}
                onChange={(e) => handleInputChange('emergencyContact', { phone: e.target.value })}
                disabled={!isEditing}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نسبت
              </label>
              <input
                type="text"
                value={patientInfo.emergencyContact.relationship}
                onChange={(e) => handleInputChange('emergencyContact', { relationship: e.target.value })}
                disabled={!isEditing}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* فرم اطلاعات بیمه */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaHeart className="text-primary ml-2" />
            اطلاعات بیمه
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                شرکت بیمه
              </label>
              <input
                type="text"
                value={patientInfo.insurance.provider}
                onChange={(e) => handleInputChange('insurance', { provider: e.target.value })}
                disabled={!isEditing}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                شماره بیمه
              </label>
              <input
                type="text"
                value={patientInfo.insurance.policyNumber}
                onChange={(e) => handleInputChange('insurance', { policyNumber: e.target.value })}
                disabled={!isEditing}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAccount;