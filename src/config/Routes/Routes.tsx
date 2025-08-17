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

const NotFound = () => <div className="text-center items-center h-full text-red-500 text-2xl mt-10">صفحه مورد نظر یافت نشد :(</div>;

const AppRoutes = () => {
  return (
    <MainLayout>
      <Routes>
        <Route key="home" path="/" element={<Home />} />
        <Route key="serviceDetail" path="/service/:id" element={<ServiceDetail />} />
        <Route key="about" path="/about" element={<About />} />
        <Route key="contact" path="/contact" element={<Contact />} />
        <Route key="PatientPanel" path="/Patient-Login" element={<PatientLoginPage />} />
        <Route key="UserProfile" path="/UserProfile" element={<UserProfile />} />
        <Route key="DoctorLogin" path="/doctor-login" element={<DoctorLoginPage />} />
        <Route key="DoctorProfile" path="/doctor-Profile" element={<DoctorProfile />} />
        <Route key="DoctorProfileSub" path="/doctor-Profile/:subPath" element={<DoctorProfile />} />
        <Route key="magazine" path="/magazine" element={<Magazine />} />
        <Route key="appointments" path="/appointments" element={<Appointments />} />
        <Route key="categories" path="/categories" element={<Categories />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
};

export default AppRoutes;