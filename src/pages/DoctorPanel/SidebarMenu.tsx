
import { useLocation, useNavigate } from 'react-router-dom';
import Userimage from '../../assets/images/userimg.png'; 
import {
  HiOutlineHome,
  HiOutlineUserCircle,
  HiOutlineCalendarDays,
  HiOutlineScissors,
  HiOutlineDocumentText,
  HiOutlineCalculator,
  HiOutlineLifebuoy,
  HiOutlineArrowRightOnRectangle
} from 'react-icons/hi2';

const menuItems = [
  { id: 'Dashboard', name: 'پیشخوان', icon: HiOutlineHome },
  { id: 'Edit-account', name: 'ویرایش حساب کاربری', icon: HiOutlineUserCircle },
  { id: 'Turns', name: 'نوبت ها', icon: HiOutlineCalendarDays },
  { id: 'Services', name: 'خدمات', icon: HiOutlineScissors },
  { id: 'Accounting', name: 'حسابداری', icon: HiOutlineCalculator },
  { id: 'Support', name: 'پشتیبانی', icon: HiOutlineLifebuoy },
  { id: 'Log-out', name: 'خروج از حساب', icon: HiOutlineArrowRightOnRectangle },
];


interface SidebarMenuProps {
  user: {
    name?: string;
    email?: string;
    // Add other user fields if needed
  };
  token: string;
  activeItem: string;
  setActiveItem: (itemId: string) => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ user, token, activeItem, setActiveItem }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
    const basePath = location.pathname.includes('/doctor-Profile') 
      ? '/doctor-Profile' 
      : location.pathname.split('/').slice(0, -1).join('/') || '/doctor-Profile';
    navigate(`${basePath}/${itemId}`);
  };

  return (
    <div className="w-64 -mt-32 p-4 flex flex-col gap-3">
      <div className="relative  aspect-square ">
        <img
          src={Userimage}
          alt="Logo"
          className="absolute inset-0 w-full h-full object-contain rounded-2xl"
        />
      </div>

      <nav>
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className={`flex items-center w-full p-3 mb-2 rounded-lg transition-colors ${
              activeItem === item.id
                ? 'bg-primary text-white'
                : 'text-black hover:text-primary'
            }`}
          >
            <item.icon className="text-3xl  ml-3" />
            <span>{item.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default SidebarMenu;