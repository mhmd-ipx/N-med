import { Helmet } from 'react-helmet-async';
import Loginimage from '../assets/images/n-med-login-img.svg'; 
import LoginForm from '../components/ui/login/Loginform';

function PatientLoginPage() {
  return (
    <div className='w-full justify-center items-center bg-primary  flex '> 
      <Helmet>
        <title> ورود کاربران</title>
      </Helmet>
      <div className='w-full flex flex-col h-screen max-w-[1300px] mx-auto items-center px-5 md:px-0 justify-center '  >
        <div className='flex bg-white rounded-3xl w-full h-auto items-center justify-around p-10 md:flex-row flex-col md:gap-0 gap-20'>
            <img src={Loginimage} alt="Logo" className="md:h-[350px] h-[150px] w-auto" />
            <div className='flex flex-col gap-10 justify-center items-center'>
              <h1 className=' text-xl'>
                ورود کاربران
              </h1>
              <LoginForm role="patient" redirectPath="/UserProfile" />
            </div>
            
        </div>
      </div>
    </div>
  );
}
export default PatientLoginPage;