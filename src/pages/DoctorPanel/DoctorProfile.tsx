import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import UserDataProvider from '../../components/ui/login/UserDataProvider';
import SidebarMenu from './SidebarMenu';
import Loading from '../../components/ui/Loading/Loading';
import { ProfileInfo, Appointments, MedicalRecords, Settings } from './MenuContentComponents';
import Dashboard from './ContetnsComponents/Dashboard/Dashboard';
import EditAccount from './ContetnsComponents/EditAccount/EditAccount';
import Turns from './ContetnsComponents/Turns/Turns';
import References from './ContetnsComponents/References/References';
import ServicesClinics from './ContetnsComponents/ServicesClinics/ServicesClinics';
import Wallet from './ContetnsComponents/Wallet/Wallet';
import LogOut from './LogOut';
import { HiMiniPencilSquare, HiOutlineBars3 } from 'react-icons/hi2';

const menuItems = [
  { id: 'Dashboard', name: 'پروفایل', component: Dashboard },
  { id: 'Edit-account', name: 'ویرایش حساب کاربری', component: EditAccount },
  { id: 'Turns', name: 'نوبت ها', component: Turns },
  { id: 'Services', name: 'خدمات و مطب ها', component: ServicesClinics },
  { id: 'References', name: 'ارجاعات', component: References },
  { id: 'Wallet', name: 'کیف پول', component: Wallet },
  { id: 'Log-out', name: 'خروج', component: LogOut },
];




const DoctorProfile = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(() => {
    const path = location.pathname.split('/').pop();
    return menuItems.find(item => item.id === path)?.id || menuItems[0].id;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const ActiveComponent = menuItems.find(item => item.id === activeItem)?.component;

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <UserDataProvider role="doctor" redirectPath="/Doctor-Login">
      {({ user, token, isLoading }) => {
        if (isLoading) {
          return <Loading />;
        }

        if (!user || !token) {
          return <div className="text-center mt-8 text-red-500">خطا در بارگذاری اطلاعات کاربر</div>;
        }

        return (
          <div className='bg-primary min-h-screen'>
            <div className="max-w-[1300px] mx-auto px-4">
              {/* Header Section */}
              <div className='flex flex-col gap-3 lg:pr-72 pb-3 text-white pt-14 lg:pt-14'>
                <div className="flex items-center justify-between lg:justify-start">
                  <div>
                    <span className='text-xl md:text-2xl font-medium'>{`دکتر ${user.name || 'بدون نام'}`}</span>
                    <div className='flex gap-2 mt-1'>
                      <span className='text-sm'>فوق تخصص قلب و عروق</span>
                      <HiMiniPencilSquare
                        className='text-xl cursor-pointer hover:text-blue-200 transition-colors'
                        onClick={() => setActiveItem('Edit-account')}
                      />
                    </div>
                  </div>

                  {/* Mobile Menu Button */}
                  <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="lg:hidden p-2 text-white hover:text-primary-light transition-colors"
                  >
                    <HiOutlineBars3 className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-8 min-h-[80vh] lg:min-h-[80vh]">
                <div className="flex flex-col lg:flex-row">
                  {/* Sidebar */}
                  <SidebarMenu
                    user={user}
                    token={token}
                    activeItem={activeItem}
                    setActiveItem={setActiveItem}
                    isMobileOpen={isMobileMenuOpen}
                    onMobileClose={handleMobileMenuClose}
                  />

                  {/* Content Area */}
                  <div className="flex-1 lg:ml-4 mt-4 lg:mt-0">
                    {ActiveComponent ? (
                      <ActiveComponent user={user} token={token} />
                    ) : (
                      <div className="text-center text-gray-500">محتوایی انتخاب نشده است</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </UserDataProvider>
  );
};

export default DoctorProfile;