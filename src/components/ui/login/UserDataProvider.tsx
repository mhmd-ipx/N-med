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
          const parsedData: { token: string } = JSON.parse(authData);
          setToken(parsedData.token);

          // اگه اطلاعات کاربر توی localStorage بود، از همون استفاده کن
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            // اگه نبود، از API بگیر
            const userData = await getUser(parsedData.token);
            setUser(userData);
            localStorage.setItem('userData', JSON.stringify(userData));
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

  if (user.role !== role) {
    const redirectTo =
      user.role === 'doctor' ? '/doctor-Profile' :
      user.role === 'patient' ? '/UserProfile' :
      user.role === 'secretary' ? '/SecretaryProfile' : redirectPath;
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">دسترسی غیرمجاز</h2>
        <p className="text-gray-600 mb-4">
          شما با نقش «{user.role === 'patient' ? 'بیمار' : user.role === 'doctor' ? 'پزشک' : 'منشی'}» وارد شده‌اید و نمی‌توانید به این پنل دسترسی داشته باشید.
        </p>
        <Link
          to={redirectTo}
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          برو به {user.role === 'patient' ? 'پروفایل بیمار' : user.role === 'doctor' ? 'پروفایل پزشک' : 'پروفایل منشی'}
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