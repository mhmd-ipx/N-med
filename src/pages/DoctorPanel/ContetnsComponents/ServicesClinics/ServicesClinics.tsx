import { lazy } from 'react';
import type { ProfileInfoProps } from '../../../../types/types.ts';
import Clinics from './Clinices/Clinics';
import Operators from './Operators/Operators.tsx'
import Tabs from '../../../../components/ui/Tabs/Tabs';
import ErrorBoundary from '../ServicesClinics/Clinices/ErrorBoundary'; // مسیر درست رو وارد کن
import { HiOutlineBuildingOffice2, HiOutlineUsers, HiOutlineCog6Tooth } from 'react-icons/hi2';


const TabThree = lazy(() => Promise.resolve({ default: () => <p>خدمات</p> }));

const ServicesClinics: React.FC<ProfileInfoProps> = ({ user, token }) => {
  const tabs = [
    {
      id: 'tab1',
      label: 'کلینیک‌ها',
      icon: <HiOutlineBuildingOffice2 className='text-xl' />,
      content: (
        <ErrorBoundary>
          <Clinics user={user} token={token} />
        </ErrorBoundary>
      ),
    },
    {
      id: 'tab2',
      label: 'اپراتورها',
      icon: <HiOutlineUsers className='text-xl' />,
            content: (
        <ErrorBoundary>
          <Operators user={user} token={token} />
        </ErrorBoundary>
      ),
    },
    {
      id: 'tab3',
      label: 'خدمات',
      icon: <HiOutlineCog6Tooth className='text-xl' />,
      content: <TabThree />,
    },
  ];

  return (
    <div className="">
      <Tabs tabs={tabs} />
    </div>
  );
};

export default ServicesClinics;