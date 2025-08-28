import React, { useState, useEffect } from 'react';
import { useUser } from '../../../../components/ui/login/UserDataProvider';
import { updatePatientProfile } from '../../../../services/serverapi';
import type { PatientProfileUpdateRequest } from '../../../../types/types';

const EditAccount = () => {
  const { user, updateUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: '',
    national_code: '',
    birth_year: 0
  });

  // Fill form with current user data
  useEffect(() => {
    if (user) {
      const userData = user as any;
      setFormData({
        name: userData.name || '',
        phone: userData.phone || '',
        gender: userData.related_data?.gender || '',
        national_code: userData.related_data?.national_code || '',
        birth_year: userData.related_data?.birth_year || 0
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'birth_year' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const updateData: PatientProfileUpdateRequest = {
        name: formData.name,
        phone: formData.phone,
        gender: formData.gender,
        national_code: formData.national_code,
        birth_year: formData.birth_year
      };

      const response = await updatePatientProfile(updateData);

      // Update user data in context and localStorage
      if (response.data && response.data.user && user) {
        // Create a proper User object from the API response
        const userData = user as any;
        const updatedUser: any = {
          ...user,
          name: response.data.user.name,
          phone: response.data.user.phone,
          related_data: {
            ...userData.related_data,
            national_code: response.data.national_code,
            birth_year: response.data.birth_year,
            gender: response.data.gender
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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">ویرایش حساب کاربری</h2>

      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            نام و نام خانوادگی *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="نام و نام خانوادگی خود را وارد کنید"
          />
        </div>

        {/* Phone - Disabled */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            شماره موبایل
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
            placeholder="شماره موبایل قابل ویرایش نیست"
          />
          <p className="text-xs text-gray-500 mt-1">شماره موبایل قابل ویرایش نیست</p>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            جنسیت *
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">جنسیت خود را انتخاب کنید</option>
            <option value="male">مرد</option>
            <option value="female">زن</option>
          </select>
        </div>

        {/* National Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            کد ملی *
          </label>
          <input
            type="text"
            name="national_code"
            value={formData.national_code}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="کد ملی خود را وارد کنید"
          />
        </div>

        {/* Birth Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            سال تولد *
          </label>
          <input
            type="number"
            name="birth_year"
            value={formData.birth_year || ''}
            onChange={handleInputChange}
            required
            min="1300"
            max="1405"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="مثال: ۱۳۸۰"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
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