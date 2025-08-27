import { Helmet } from 'react-helmet-async';
import Loginimage from '../assets/images/n-med-login-img.svg'; 
import LoginForm from '../components/ui/login/Loginform';

function DoctorLoginPage() {
  return (
    <div className='w-full min-h-screen pt-16 md:pt-20 bg-primary flex'>
      <Helmet>
        <title>پرتال پزشکان</title>
      </Helmet>
      <div className='w-full flex flex-col max-w-[1300px] mx-auto px-4 md:px-0'>
        <div className='flex bg-white rounded-2xl md:rounded-3xl w-full h-auto items-center justify-center p-6 md:p-10 md:flex-row flex-col gap-8 md:gap-0'>
            <img
              src={Loginimage}
              alt="نوتاش - پرتال پزشکان"
              className="md:h-[350px] h-[120px] md:h-[200px] lg:h-[350px] w-auto max-w-full"
            />
            <div className='flex flex-col gap-6 md:gap-10 justify-center items-center w-full md:w-auto'>
              <h1 className='text-xl md:text-2xl font-semibold text-center'>
                ورود پزشکان
              </h1>
              <div className='w-full max-w-sm'>
                <LoginForm role="doctor" redirectPath="/doctor-Profile" />
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
export default DoctorLoginPage;