import { Routes, Route } from 'react-router-dom';
import Home from '../../pages/Home';
import About from '../../pages/About';
import MainLayout from '../../components/layout/MainLayout';


const Contact = () => <div>Contact Page (Placeholder)</div>;
const NotFound = () => <div className="text-center items-center h-full text-red-500 text-2xl mt-10">صفحه مورد نظر یافت نشد :(</div>;

const AppRoutes = () => {
  return (
    <MainLayout>
      <Routes>
        <Route key="home" path="/" element={<Home />} />
        <Route key="about" path="/about" element={<About />} />
        <Route key="contact" path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
};

export default AppRoutes;