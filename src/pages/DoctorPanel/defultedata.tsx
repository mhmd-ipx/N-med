
import UserDataProvider from '../../components/ui/login/UserDataProvider';
import { useNavigate } from 'react-router-dom';

const DoctorProfile = () => {
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
    <UserDataProvider role="doctor" redirectPath="/Doctor-Login">
      {({ user, token, isLoading }) => {
        if (isLoading) {
          return <div className="text-center mt-8">در حال بارگذاری...</div>;
        }

        if (!user || !token) {
          return <div className="text-center mt-8 text-red-500">خطا در بارگذاری اطلاعات کاربر</div>;
        }

        return (
          <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">پروفایل پزشک</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium text-gamma-700">نام:</span>
                <span className="text-gray-600">{user.name || 'بدون‌نام'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">شماره تلفن:</span>
                <span className="text-gray-600">{user.phone || 'ثبت نشده'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">نقش:</span>
                <span className="text-gray-600">{user.role === 'doctor' ? 'پزشک' : user.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">آدرس:</span>
                <span className="text-gray-600">{user.related_data?.address || 'ثبت نشده'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">بیوگرافی:</span>
                <span className="text-gray-600">{user.related_data?.bio || 'ثبت نشده'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">آواتار:</span>
                <span className="text-gray-600">{user.related_data?.avatar || 'ثبت نشده'}</span>
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
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('authData');
                navigate('/Doctor-Login');
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

export default DoctorProfile;