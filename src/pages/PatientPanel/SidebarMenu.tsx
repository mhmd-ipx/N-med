import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Userimage from '../../assets/images/userimg.png';
import { HiOutlineXMark } from 'react-icons/hi2';
import {
  HiOutlineHome,
  HiOutlineUserCircle,
  HiOutlineCalendarDays,
  HiOutlineCalculator,
  HiOutlineLifebuoy,
  HiOutlineArrowRightOnRectangle
} from 'react-icons/hi2';
import { FaWallet } from 'react-icons/fa';

const menuItems = [
  { id: 'Dashboard', name: 'پیشخوان', icon: HiOutlineHome },
  { id: 'Edit-account', name: 'ویرایش حساب کاربری', icon: HiOutlineUserCircle },
  { id: 'Turns', name: 'نوبت ها', icon: HiOutlineCalendarDays },
  { id: 'Support', name: 'ارجاعات', icon: HiOutlineLifebuoy },
  { id: 'Wallet', name: 'کیف پول', icon: FaWallet },
  { id: 'Log-out', name: 'خروج از حساب', icon: HiOutlineArrowRightOnRectangle },
];

interface SidebarMenuProps {
  user: {
    name?: string;
    email?: string;
  };
  token: string;
  activeItem: string;
  setActiveItem: (itemId: string) => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  activeItem,
  setActiveItem,
  isMobileOpen = false,
  onMobileClose
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleItemClick = (itemId: string) => {
    if (itemId === 'Log-out') {
      // نمایش پاپ‌آپ تأیید برای لاگ‌اوت
      const confirmLogout = window.confirm('آیا مطمئن هستید که می‌خواهید از حساب خود خارج شوید؟');
      if (confirmLogout) {
        // حذف داده‌های احراز هویت
        localStorage.removeItem('authData');
        // هدایت به صفحه لاگین
        navigate('/UserProfile');
      } else {
        // اگر کنسل کرد، آیتم فعال به Dashboard برگرده
        setActiveItem('Dashboard');
        navigate('/UserProfile');
      }
    } else {
      // برای سایر آیتم‌ها رفتار عادی
      setActiveItem(itemId);
      const basePath = location.pathname.includes('/UserProfile')
        ? '/UserProfile'
        : location.pathname.split('/').slice(0, -1).join('/') || '/UserProfile';
      navigate(`${basePath}/${itemId}`);
    }

    // بستن منوی موبایل بعد از کلیک
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 right-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        lg:w-64 -mt-32 p-4 flex flex-col gap-3 shadow-lg lg:shadow-none
      `}>
        {/* Mobile Close Button */}
        <button
          onClick={onMobileClose}
          className="lg:hidden self-end p-2 text-gray-500 hover:text-gray-700 mb-4"
        >
          <HiOutlineXMark className="text-xl" />
        </button>

        <div className="relative aspect-square">
          <img
            src={Userimage}
            alt="پروفایل کاربر"
            className="absolute inset-0 w-full h-full object-contain rounded-2xl"
          />
        </div>

        <nav className="flex-1">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`flex items-center w-full p-3 mb-2 rounded-lg transition-colors ${
                item.id === 'Log-out'
                  ? 'text-black hover:text-primary' // لاگ‌اوت نباید فعال (highlight) بشه
                  : activeItem === item.id
                    ? 'bg-primary text-white'
                    : 'text-black hover:text-primary'
              }`}
            >
              <item.icon className="text-3xl ml-3" />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default SidebarMenu;