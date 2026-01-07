import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Userimage from '../../assets/images/userimg.png';
import { HiOutlineXMark } from 'react-icons/hi2';
import {
  HiOutlineHome,
  HiOutlineUserCircle,
  HiOutlineCalendarDays,
  HiOutlineBuildingOffice,
  HiOutlineCalculator,
  HiOutlineLifebuoy,
  HiOutlineArrowRightOnRectangle,
  HiOutlineCreditCard
} from 'react-icons/hi2';
import { useUser } from '../../components/ui/login/UserDataProvider';

const menuItems = [
  { id: 'Dashboard', name: 'پیشخوان', icon: HiOutlineHome },
  { id: 'Turns', name: 'نوبت ها', icon: HiOutlineCalendarDays },
  { id: 'References', name: 'ارجاعات', icon: HiOutlineLifebuoy },
  { id: 'Wallet', name: 'حسابداری', icon: HiOutlineCreditCard },
  { id: 'Services', name: 'خدمات و مطب ها', icon: HiOutlineBuildingOffice },
  { id: 'Edit-account', name: 'ویرایش حساب کاربری', icon: HiOutlineUserCircle },
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
  onLogoutClick?: () => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  activeItem,
  setActiveItem,
  isMobileOpen = false,
  onMobileClose,
  onLogoutClick
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();

  // Get user profile image or fallback to default
  const profileImage = (user as any)?.related_data?.avatar || Userimage;
  //console.log(user);

  const handleItemClick = (itemId: string) => {
    if (itemId === 'Log-out') {
      if (onLogoutClick) {
        onLogoutClick();
      }
      if (onMobileClose) {
        onMobileClose();
      }
      return;
    }

    setActiveItem(itemId);
    const basePath = location.pathname.includes('/doctor-Profile')
      ? '/doctor-Profile'
      : location.pathname.split('/').slice(0, -1).join('/') || '/doctor-Profile';
    navigate(`${basePath}/${itemId}`);

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
          className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 right-0 transform transition-transform duration-300  ease-in-out
        ${isMobileOpen ? 'translate-x-0 bg-white z-50' : 'translate-x-full lg:translate-x-0 lg:z-10'}
        w-64 -mt-32 p-4 flex flex-col  gap-3 shadow-lg lg:shadow-none
      `}>
        {/* Mobile Close Button */}
        <button
          onClick={onMobileClose}
          className="lg:hidden self-end p-2 text-gray-500 hover:text-gray-700 mb-4"
        >
          <HiOutlineXMark className="text-xl" />
        </button>

        <div className="w-full aspect-square overflow-hidden rounded-2xl border-4 border-blue-500 bg-white">
          <img
            src={profileImage}
            alt="پروفایل کاربر"
            className="w-full h-full object-cover"
          />
        </div>

        <nav className="flex-1">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`flex items-center w-full p-3 mb-2 rounded-lg transition-colors ${item.id === 'Log-out'
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