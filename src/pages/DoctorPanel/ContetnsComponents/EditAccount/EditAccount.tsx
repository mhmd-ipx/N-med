import React, { useState, useEffect } from 'react';
import { useUser } from '../../../../components/ui/login/UserDataProvider';
import { getSpecialties, updateDoctorProfile } from '../../../../services/serverapi';
import FileUpload from '../../../../components/ui/FileUpload/FileUpload';
import type { Specialty, DoctorProfileUpdateRequest } from '../../../../types/types';

const EditAccount = () => {
  const { user, updateUser } = useUser();
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(false);
  const [specialtiesLoading, setSpecialtiesLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    specialties: [] as number[],
    address: '',
    bio: '',
    avatar: '',
    code: '',
    card_number: '',
    sheba_number: ''
  });

  // Load specialties on component mount
  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        const specialtiesData = await getSpecialties();
        setSpecialties(specialtiesData);
      } catch (error) {
        console.error('Error loading specialties:', error);
        setErrorMessage('خطا در بارگذاری تخصص‌ها');
      } finally {
        setSpecialtiesLoading(false);
      }
    };

    loadSpecialties();
  }, []);

  // Fill form with current user data
  useEffect(() => {
    if (user) {
      const userData = user as any;
      setFormData({
        name: userData.name || '',
        phone: userData.phone || '',
        specialties: userData.related_data?.specialties || [],
        address: userData.related_data?.address || '',
        bio: userData.related_data?.bio || '',
        avatar: userData.related_data?.avatar || '',
        code: userData.related_data?.code || '',
        card_number: userData.card_number || '',
        sheba_number: userData.sheba_number || ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSpecialtyChange = (specialtyId: number, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      specialties: checked
        ? [...prev.specialties, specialtyId]
        : prev.specialties.filter(id => id !== specialtyId)
    }));
  };

  const handleAvatarChange = (url: string | null) => {
    setFormData(prev => ({
      ...prev,
      avatar: url || ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const updateData: DoctorProfileUpdateRequest = {
        name: formData.name,
        phone: formData.phone,
        specialties: formData.specialties,
        address: formData.address,
        bio: formData.bio,
        avatar: formData.avatar,
        code: formData.code,
        card_number: formData.card_number,
        sheba_number: formData.sheba_number
      };

      const response = await updateDoctorProfile(updateData);

      // Update user data in context and localStorage
      if (response.data && response.data.user && user) {
        // Create a proper User object from the API response
        const userData = user as any;
        const updatedUser: any = {
          ...user,
          name: response.data.user.name,
          phone: response.data.user.phone,
          card_number: response.data.user.card_number,
          sheba_number: response.data.user.sheba_number,
          related_data: {
            ...userData.related_data,
            specialties: response.data.specialties,
            address: response.data.address,
            bio: response.data.bio,
            avatar: response.data.avatar,
            code: response.data.code
          }
        };

        // Update user in context
        updateUser(updatedUser);

        // Update authData in localStorage
        const authData = localStorage.getItem('authData');
        if (authData) {
          try {
            const parsedAuthData = JSON.parse(authData);
            parsedAuthData.user = updatedUser;
            localStorage.setItem('authData', JSON.stringify(parsedAuthData));
          } catch (error) {
            console.error('Error updating authData in localStorage:', error);
          }
        }
      }

      setSuccessMessage(response.message || 'اطلاعات شما با موفقیت به‌روزرسانی شد.');
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage(error instanceof Error ? error.message : 'خطا در به‌روزرسانی اطلاعات');
    } finally {
      setLoading(false);
    }
  };

  if (specialtiesLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">ویرایش حساب کاربری</h2>

      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 md:gap-6">
        {/* Name */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <svg className="w-4 h-4 ml-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            نام و نام خانوادگی *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition duration-200"
            placeholder="نام و نام خانوادگی خود را وارد کنید"
          />
        </div>

        {/* Phone - Disabled */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <svg className="w-4 h-4 ml-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            شماره موبایل
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            disabled
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            placeholder="شماره موبایل قابل ویرایش نیست"
          />
          <p className="text-xs text-gray-500 mt-1">شماره موبایل قابل ویرایش نیست</p>
        </div>

        {/* Specialties */}
        <div className="col-span-2">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <svg className="w-4 h-4 ml-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" />
            </svg>
            تخصص‌ها
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {specialties.map((specialty) => (
              <label key={specialty.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.specialties.includes(specialty.id)}
                  onChange={(e) => handleSpecialtyChange(specialty.id, e.target.checked)}
                  className="ml-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{specialty.title}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Address */}
        <div className="col-span-2">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <svg className="w-4 h-4 ml-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            آدرس
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition duration-200"
            placeholder="آدرس خود را وارد کنید"
          />
        </div>

        {/* Bio */}
        <div className="col-span-2">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <svg className="w-4 h-4 ml-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            بیوگرافی
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition duration-200"
            placeholder="بیوگرافی خود را وارد کنید"
          />
        </div>

        {/* Code */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <svg className="w-4 h-4 ml-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
            </svg>
            کد پزشک
          </label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition duration-200"
            placeholder="کد پزشک خود را وارد کنید"
          />
        </div>

        {/* Card Number */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <svg className="w-4 h-4 ml-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            شماره کارت
          </label>
          <input
            type="text"
            name="card_number"
            value={formData.card_number}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition duration-200"
            placeholder="شماره کارت خود را وارد کنید"
          />
        </div>

        {/* Sheba Number */}
        <div className="col-span-2">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <svg className="w-4 h-4 ml-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            شماره شبا
          </label>
          <input
            type="text"
            name="sheba_number"
            value={formData.sheba_number}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition duration-200"
            placeholder="شماره شبا خود را وارد کنید"
          />
        </div>

        {/* Avatar */}
        <div className="col-span-2">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <svg className="w-4 h-4 ml-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            تصویر پروفایل
          </label>
          <FileUpload
            onUrlChange={handleAvatarChange}
            initialFileUrl={formData.avatar}
            layout="horizontal"
          />
        </div>

        {/* Submit Button */}
        <div className="col-span-2 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 font-medium"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                در حال ذخیره...
              </div>
            ) : (
              'ذخیره تغییرات'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAccount;
