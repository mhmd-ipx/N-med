import { createContext, useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser } from '../../../services/serverapi';
import type { User, UserDataProviderExtendedProps } from '../../../types/types';
import Loading from '../Loading/Loading';

// تعریف Context
interface UserContextType {
  user: User | null;
  token: string | null;
  updateUser: (newUser: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// هوک سفارشی برای دسترسی به Context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser باید داخل UserDataProvider استفاده شود');
  }
  return context;
};

const UserDataProvider = ({ children, role, redirectPath }: UserDataProviderExtendedProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // تابع برای به‌روزرسانی اطلاعات کاربر و ذخیره در localStorage
  const updateUser = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('userData', JSON.stringify(newUser));
    // اعلان رویداد سفارشی برای اطلاع‌رسانی تغییرات
    window.dispatchEvent(new CustomEvent('userUpdated', { detail: newUser }));
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const authData = localStorage.getItem('authData');
      const storedUser = localStorage.getItem('userData');

      if (authData) {
        try {
          const parsedData: { token: string; user?: User } = JSON.parse(authData);
          setToken(parsedData.token);

          // اگر authData شامل user باشد، از آن استفاده کن
          if (parsedData.user && parsedData.user.role) {
            setUser(parsedData.user);
            localStorage.setItem('userData', JSON.stringify(parsedData.user));
          } else if (storedUser) {
            // اگر userData در localStorage بود، بررسی کن که role معتبر باشد
            const parsedUser: User = JSON.parse(storedUser);
            if (parsedUser.role) {
              setUser(parsedUser);
            } else {
              // اگر role در userData null بود، از API بگیر
              const userData = await getUser(parsedData.token);
              const finalUser = userData.user || userData;
              setUser(finalUser);
              localStorage.setItem('userData', JSON.stringify(finalUser));
            }
          } else {
            // اگر هیچ داده‌ای در localStorage نبود، از API بگیر
            const userData = await getUser(parsedData.token);
            const finalUser = userData.user || userData;
            setUser(finalUser);
            localStorage.setItem('userData', JSON.stringify(finalUser));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          navigate(redirectPath);
        }
      } else {
        navigate(redirectPath);
      }
      setIsLoading(false);
    };

    fetchUserData();

    // گوش دادن به تغییرات اطلاعات کاربر
    const handleUserUpdate = (event: Event) => {
      const newUser = (event as CustomEvent).detail;
      setUser(newUser);
      localStorage.setItem('userData', JSON.stringify(newUser));
    };

    window.addEventListener('userUpdated', handleUserUpdate);
    return () => window.removeEventListener('userUpdated', handleUserUpdate);
  }, [navigate, redirectPath]);

  if (isLoading) {
    return <Loading />;
  }

  if (!user || !token) {
    return <div className="text-center mt-8 text-red-500">خطا در بارگذاری اطلاعات کاربر</div>;
  }

  // بررسی role با مدیریت null و مقایسه case-insensitive
  if (!user.role || user.role.trim().toLowerCase() !== role.trim().toLowerCase()) {
    const redirectTo =
      user.role === 'doctor' ? '/doctor-Profile' :
      user.role === 'patient' ? '/UserProfile' :
      user.role === 'secretary' ? '/SecretaryProfile' : redirectPath;
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">دسترسی غیرمجاز</h2>
        <p className="text-gray-600 mb-4">
          شما با نقش «{user.role === 'patient' ? 'بیمار' : user.role === 'doctor' ? 'پزشک' : user.role === 'secretary' ? 'منشی' : 'نامشخص'}» وارد شده‌اید و نمی‌توانید به این پنل دسترسی داشته باشید.
        </p>
        <Link
          to={redirectTo}
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          برو به {user.role === 'patient' ? 'پروفایل بیمار' : user.role === 'doctor' ? 'پروفایل پزشک' : user.role === 'secretary' ? 'پروفایل منشی' : 'صفحه اصلی'}
        </Link>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, token, updateUser }}>
      {children({ user, token, isLoading })}
    </UserContext.Provider>
  );
};

export default UserDataProvider;