import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Loginimage from '../assets/images/n-med-logo1.png';
import LoginForm from '../components/ui/login/Loginform';
import Button from '../components/ui/Button';

function DoctorLoginPage() {
  return (
    <div className='w-full min-h-screen pt-16 md:pt-20 bg-primary flex'>
      <Helmet>
        <title>پرتال پزشکان</title>
      </Helmet>

      <div className='w-full flex flex-col max-w-[1300px] mx-auto px-4 md:px-0'>
        {/* دیو سفید - کاملاً مرکز شده در همه دستگاه‌ها */}
        <div className='flex flex-col md:flex-row bg-white rounded-2xl md:rounded-3xl w-full h-auto shadow-lg p-6 md:p-10 gap-8 md:gap-12 items-center justify-center'>
          
          {/* تصویر - همیشه در مرکز */}
          <div className='flex justify-center items-center w-full md:w-auto'>
            <img
              src={Loginimage}
              alt="نوتاش - پرتال پزشکان"
              className="h-[120px] sm:h-[180px] md:h-[250px] lg:h-[350px] w-auto object-contain"
            />
          </div>

          {/* بخش فرم و دکمه */}
          <div className='flex flex-col gap-2 md:gap-2 justify-center items-center w-full md:w-auto text-center'>
            <h1 className='text-xl md:text-2xl font-semibold'>
              ورود پزشکان
            </h1>

            <div className='max-w-sm'>
              <LoginForm role="doctor" redirectPath="/doctor-Profile" />
            </div>

            <div className='w-full max-w-sm mt-2'>
              <Link to="/Patient-Login">
                <Button variant="plain" className="w-full bg-transparent hover:bg-transparent text-primary">
                  ورود کاربران
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorLoginPage;