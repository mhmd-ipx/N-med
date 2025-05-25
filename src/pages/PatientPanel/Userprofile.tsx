import type { ReactNode } from 'react';
import UserDataProvider from '../../components/ui/login/UserDataProvider';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const navigate = useNavigate();

  // تابع برای کوتاه کردن توکن برای نمایش
  const shortenToken = (token: string | null) => {
    if (!token) return 'ناموجود';
    if (token.length <= 10) return token;
    return `${token.slice(0, 6)}...${token.slice(-4)}`;
  };

  // تابع برای کپی کردن توکن
  const copyTokenToClipboard = (token: string | null) => {
    if (token) {
      navigator.clipboard.writeText(token);
      alert('توکن با موفقیت کپی شد!');
    }
  };

  return (
    <UserDataProvider role="patient" redirectPath="/Patient-Login">
      {({ user, token, isLoading }) => {
        if (isLoading) {
          return <div className="text-center mt-8">در حال بارگذاری...</div>;
        }

        if (!user || !token) {
          return <div className="text-center mt-8 text-red-500">خطا در بارگذاری اطلاعات کاربر</div>;
        }

        return (
          <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">پروفایل بیمار</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">نام:</span>
                <span className="text-gray-600">{user.name || 'بدون‌نام'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">شماره تلفن:</span>
                <span className="text-gray-600">{user.phone || 'ثبت نشده'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">نقش:</span>
                <span className="text-gray-600">{user.role === 'patient' ? 'بیمار' : user.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">کد ملی:</span>
                <span className="text-gray-600">{user.related_data?.melli_code || 'ثبت نشده'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">تاریخچه پزشکی:</span>
                <span className="text-gray-600">{user.related_data?.medical_history || 'ثبت نشده'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">اطلاعات بیمه:</span>
                <span className="text-gray-600">{user.related_data?.insurance_info || 'ثبت نشده'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">تاریخ ثبت:</span>
                <span className="text-gray-600">
                  {user.related_data?.created_at
                    ? new Date(user.related_data.created_at).toLocaleDateString('fa-IR')
                    : 'ثبت نشده'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">توکن:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 font-mono">{shortenToken(token)}</span>
                  <button
                    onClick={() => copyTokenToClipboard(token)}
                    className="text-sm text-indigo-600 hover:text-indigo-800 focus:outline-none"
                  >
                    کپی
                  </button>
                </div>
              </div>
              {user.related_data?.attachments && user.related_data.attachments.length > 0 ? (
                <div>
                  <span className="font-medium text-gray-700">پیوست‌ها:</span>
                  <ul className="list-disc list-inside text-gray-600">
                    {user.related_data.attachments.map((attachment: string, index: number) => (
                      <li key={index}>{attachment}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">پیوست‌ها:</span>
                  <span className="text-gray-600">هیچ پیوستی ثبت نشده</span>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('authData');
                navigate('/Patient-Login');
              }}
              className="w-full mt-6 py-2 px-4 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none"
            >
              خروج
            </button>
          </div>
        );
      }}
    </UserDataProvider>
  );
};

export default UserProfile;