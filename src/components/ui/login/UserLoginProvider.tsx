import { createContext, useContext, useState, useEffect } from 'react';
import { getUser } from '../../../services/serverapi';
import type { User } from '../../../types/types';
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
    throw new Error('useUser باید داخل UserLoginProvider استفاده شود');
  }
  return context;
};

const UserLoginProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // تابع برای به‌روزرسانی اطلاعات کاربر و ذخیره در localStorage
  const updateUser = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('userData', JSON.stringify(newUser));
    window.dispatchEvent(new CustomEvent('userUpdated', { detail: newUser }));
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const authData = localStorage.getItem('authData');
      const storedUser = localStorage.getItem('userData');

      if (authData) {
        try {
          const parsedData = JSON.parse(authData);

          // بررسی حالت انتظار تأیید ادمین (اگر لازم باشد، اما بدون ریدایرکت)
          if (parsedData.message === 'حساب شما ایجاد شد. منتظر تأیید ادمین بمانید.') {
            setIsLoading(false);
            return;
          }

          // منطق برای زمانی که توکن وجود دارد
          const parsedToken: { token?: string; user?: User } = parsedData;
          if (!parsedToken.token) {
            throw new Error('No token found');
          }

          setToken(parsedToken.token);

          if (parsedToken.user) {
            setUser(parsedToken.user);
            localStorage.setItem('userData', JSON.stringify(parsedToken.user));
          } else if (storedUser) {
            const parsedUser: User = JSON.parse(storedUser);
            setUser(parsedUser);
          } else {
            const userData = await getUser(parsedToken.token);
            const finalUser = userData.user || userData;
            setUser(finalUser);
            localStorage.setItem('userData', JSON.stringify(finalUser));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // بدون ریدایرکت، فقط وضعیت را null نگه می‌داریم
        }
      }
      // بدون ریدایرکت اگر authData وجود نداشته باشد
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
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <UserContext.Provider value={{ user, token, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserLoginProvider;