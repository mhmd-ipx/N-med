import { useEffect, useState } from 'react';
import { getServices, getDoctors, getprovinces } from '../../services/api';
import type { Services, Doctor, provinces } from '../../types/types';
import SingleServiceCard from '../../components/ui/ServiceCard/SingleServiceCard';

const ServiceCard = () => {
  const [services, setServices] = useState<Services[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [provinces, setProvinces] = useState<provinces[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesData, doctorsData, provincesData] = await Promise.all([
          getServices(),
          getDoctors(),
          getprovinces(),
        ]);

        if (Array.isArray(servicesData)) setServices(servicesData);
        if (Array.isArray(doctorsData)) setDoctors(doctorsData);
        if (Array.isArray(provincesData)) setProvinces(provincesData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>در حال بارگذاری...</div>;
  if (services.length === 0) return <div>داده‌ای برای نمایش وجود ندارد</div>;



  return (
    <div className="gap-4 grid grid-cols-3">
      {services.slice(0, 6).map((service) => {
        const doctor = doctors.find((doc) => String(doc.id) === String(service.doctorId)) || {
          id: 0,
          name: "نامشخص",
          imageUrl: "/default.jpg",
          specialtyIds: [],
          cityId: 0,
          availableTimes: []
        };
        const doctorCityId = 'cityId' in doctor ? (doctor as Doctor).cityId : undefined;
        const province = provinces.find((prov) => String(prov.id) === String(doctorCityId)) || {
          id: 0,
          name: "نامشخص"
        };



        return (
          <SingleServiceCard
            key={service.id}
            service={service}
            doctor={doctor}
            province={province}
          />
        );
      })}
    </div>
  );
};

export default ServiceCard;