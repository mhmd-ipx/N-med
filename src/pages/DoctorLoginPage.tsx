import { Helmet } from 'react-helmet-async';
import Loginimage from '../assets/images/n-med-login-img.svg'; 
import LoginForm from '../components/ui/login/Loginform';

function DoctorLoginPage() {
  return (
    <div  className='w-full h-[100vh] pt-20 bg-primary  flex '>
      <Helmet>
        <title> ورود پزشکان</title>
      </Helmet>
      <div className='w-full flex flex-col  max-w-[1300px] mx-auto  px-5 md:px-0  '  >
        <div className='flex bg-white rounded-3xl w-full h-auto items-center justify-around p-10 md:flex-row flex-col md:gap-0 gap-20'>
            <img src={Loginimage} alt="Logo" className="md:h-[350px] h-[150px] w-auto" />
            <div className='flex flex-col gap-10 justify-center items-center'>
              <h1 className=' text-xl'>
                ورود پزشکان
              </h1>
              <LoginForm role="doctor" redirectPath="/doctor-Profile" />
            </div>
        </div>
      </div>
    </div>
  );
}
export default DoctorLoginPage;