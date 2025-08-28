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
    code: ''
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
        code: userData.related_data?.code || ''
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
        code: formData.code
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

        {/* Specialties */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            آدرس
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="آدرس خود را وارد کنید"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            بیوگرافی
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="بیوگرافی خود را وارد کنید"
          />
        </div>

        {/* Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            کد پزشک
          </label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="کد پزشک خود را وارد کنید"
          />
        </div>

        {/* Avatar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            تصویر پروفایل
          </label>
          <FileUpload
            onUrlChange={handleAvatarChange}
            initialFileUrl={formData.avatar}
            layout="horizontal"
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
