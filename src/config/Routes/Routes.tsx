import { Routes, Route } from 'react-router-dom';
import Home from '../../pages/Home';
import About from '../../pages/About';
import MainLayout from '../../components/layout/MainLayout';
import PatientLoginPage from '../../pages/PatientLoginPage';
import DoctorLoginPage from '../../pages/DoctorLoginPage';
import UserProfile from '../../pages/PatientPanel/Userprofile';
import DoctorProfile from '../../pages/DoctorPanel/DoctorProfile';
import Contact from '../../pages/Contact';
import Magazine from '../../pages/Magazine';
import Appointments from '../../pages/Appointments';
import Categories from '../../pages/Categories';
import ServiceDetail from '../../pages/ServiceDetail';
import DoctorDetail from '../../pages/DoctorDetail';
import PaymentCallback from '../../pages/PaymentCallback';
import PaymentSuccess from '../../pages/PaymentSuccess';
import PaymentFailed from '../../pages/PaymentFailed';
import ServiceCategories from '../../pages/ServiceCategories';
import Doctors from '../../pages/Doctors';
import NotFound from '../../pages/NotFound';

const AppRoutes = () => {
  return (
    <MainLayout>
      <Routes>
        <Route key="home" path="/" element={<Home />} />
        <Route key="doctors" path="/doctors" element={<Doctors />} />
        <Route key="doctorDetail" path="/doctors/:id" element={<DoctorDetail />} />
        <Route key="serviceDetail" path="/service/:id" element={<ServiceDetail />} />
        <Route key="about" path="/about" element={<About />} />
        <Route key="contact" path="/contact" element={<Contact />} />
        <Route key="PatientPanel" path="/Patient-Login" element={<PatientLoginPage />} />
        <Route key="UserProfile" path="/UserProfile" element={<UserProfile />} />
        <Route key="UserProfileSub" path="/UserProfile/:subPath" element={<UserProfile />} />
        <Route key="DoctorLogin" path="/doctor-login" element={<DoctorLoginPage />} />
        <Route key="DoctorProfile" path="/doctor-Profile" element={<DoctorProfile />} />
        <Route key="DoctorProfileSub" path="/doctor-Profile/:subPath" element={<DoctorProfile />} />
        <Route key="magazine" path="/magazine" element={<Magazine />} />
        <Route key="appointments" path="/appointments" element={<Appointments />} />
        <Route key="categories" path="/categories" element={<Categories />} />
        <Route key="serviceCategories" path="/service-categories" element={<ServiceCategories />} />
        <Route key="paymentCallback" path="/payment/callback" element={<PaymentCallback />} />
        <Route key="paymentSuccess" path="/payment/success" element={<PaymentSuccess />} />
        <Route key="paymentFailed" path="/payment/failed" element={<PaymentFailed />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
};

export default AppRoutes;