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
    birth_year: 0,
    card_number: '',
    sheba_number: ''
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
        birth_year: userData.related_data?.birth_year || 0,
        card_number: userData.card_number || '',
        sheba_number: userData.sheba_number || ''
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
        birth_year: formData.birth_year,
        card_number: formData.card_number,
        sheba_number: formData.sheba_number
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
          card_number: response.data.user.card_number,
          sheba_number: response.data.user.sheba_number,
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

        {/* Gender */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <svg className="w-4 h-4 ml-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            جنسیت *
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition duration-200"
          >
            <option value="">جنسیت خود را انتخاب کنید</option>
            <option value="male">مرد</option>
            <option value="female">زن</option>
          </select>
        </div>

        {/* National Code */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <svg className="w-4 h-4 ml-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
            </svg>
            کد ملی *
          </label>
          <input
            type="text"
            name="national_code"
            value={formData.national_code}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition duration-200"
            placeholder="کد ملی خود را وارد کنید"
          />
        </div>

        {/* Birth Year */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <svg className="w-4 h-4 ml-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition duration-200"
            placeholder="مثال: ۱۳۸۰"
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