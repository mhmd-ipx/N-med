import { createContext, useContext, useState, useEffect } from 'react';
import { getDoctors } from '../services/api';
import type { Doctor } from '../types/types';

interface DoctorContextType {
  doctors: Doctor[];
  loading: boolean;
  setFilters: (filters: { specialty?: string; city?: string }) => void;
}

const DoctorContext = createContext<DoctorContextType | undefined>(undefined);

export const DoctorProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFiltersState] = useState({ specialty: '', city: '' });

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const data = await getDoctors(filters);
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [filters]);

  const setFilters = (newFilters: { specialty?: string; city?: string }) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <DoctorContext.Provider value={{ doctors, loading, setFilters }}>
      {children}
    </DoctorContext.Provider>
  );
};

export const useDoctors = () => {
  const context = useContext(DoctorContext);
  if (!context) throw new Error('useDoctors must be used within a DoctorProvider');
  return context;
};