import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogOut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // نمایش پاپ‌آپ تأیید به محض رندر شدن کامپوننت
    const confirmLogout = window.confirm('آیا مطمئن هستید که می‌خواهید از حساب خود خارج شوید؟');

    if (confirmLogout) {
      // حذف داده‌های احراز هویت از localStorage
      localStorage.removeItem('authData');
      localStorage.removeItem('userData');

      // بروزرسانی context کاربر به null
      window.dispatchEvent(new CustomEvent('userUpdated', { detail: null }));

      // هدایت به صفحه اصلی بعد از یک تأخیر کوتاه
      setTimeout(() => {
        navigate('/');
      }, 100);
    } else {
      // اگر کاربر لغو کرد، به صفحه‌ای مثل داشبورد برگرده
      navigate('/doctor-Profile/Dashboard');
    }
  }, [navigate]);

  // چون نیازی به رندر چیزی نداریم، null برمی‌گردونیم
  return null;
};

export default LogOut;