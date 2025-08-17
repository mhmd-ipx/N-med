import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import UserDataProvider from '../../components/ui/login/UserDataProvider';
import SidebarMenu from './SidebarMenu';
import Loading from '../../components/ui/Loading/Loading';
import { ProfileInfo, Appointments, MedicalRecords, Settings } from './MenuContentComponents';

import ServicesClinics from './ContetnsComponents/ServicesClinics/ServicesClinics'
import LogOut from './LogOut';
import { HiMiniPencilSquare } from 'react-icons/hi2';

const menuItems = [
  { id: 'Dashboard', name: 'پروفایل', component: ProfileInfo },
  { id: 'Edit-account', name: 'ملاقات‌ها', component: Appointments },
  { id: 'Turns', name: 'سوابق', component: MedicalRecords },
  { id: 'Services', name: 'خدمات و مطب ها', component: ServicesClinics },
  { id: 'Support', name: 'تنظیمات', component: Settings },
  { id: 'Log-out', name: 'تنظیمات', component: LogOut },
];




const DoctorProfile = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(() => {
    const path = location.pathname.split('/').pop();
    return menuItems.find(item => item.id === path)?.id || menuItems[0].id;
  });

  const ActiveComponent = menuItems.find(item => item.id === activeItem)?.component;

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
          <div className='bg-primary pt-14 pb-14'>
            <div className="max-w-[1300px] mx-auto">
              <div className='flex flex-col gap-3 pr-72 pb-3 text-white'>
                
                <span className='text-2xl font-medium'>{`دکتر ${user.name || 'بدون نام'}`}</span>
                <div className='flex gap-2'>
                  <span className='text-sm '>فوق تخصص قلب و عروق</span>
                  <HiMiniPencilSquare className='text-xl' />
                </div>
              </div>
              <div className="flex bg-white rounded-3xl p-8 min-h-[80vh]">
                {/* Sidebar */}
                <SidebarMenu user={user} token={token} activeItem={activeItem} setActiveItem={setActiveItem} />
                {/* Content Area */}
                <div className="flex-1 p-0 ">
                  {ActiveComponent ? (
                    <ActiveComponent user={user} token={token} />
                  ) : (
                    <div className="text-center text-gray-500">محتوایی انتخاب نشده است</div>
                  )}
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