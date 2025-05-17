import axios from 'axios';
import type { Doctor, Appointment, Specialty , symptoms , Services } from '../types/types';

const api = axios.create({
  baseURL: 'http://localhost:3001'
});

export const getDoctors = async (filters?: { specialty?: string; city?: string }) => {
  const response = await api.get<Doctor[]>('/doctors', { params: filters });
  return response.data;
};

export const getDoctorById = async (id: number) => {
  const response = await api.get<Doctor>(`/doctors/${id}`);
  return response.data;
};

export const createAppointment = async (appointment: Omit<Appointment, 'id'>) => {
  const response = await api.post<Appointment>('/appointments', appointment);
  return response.data;
};

export const getSpecialties = async () => {
  const response = await api.get<Specialty[]>('/specialties');
  return response.data;
};

export const getprovinces = async (filters?: { specialty?: string; city?: string }) => {
  const response = await api.get<Doctor[]>('/provinces', { params: filters });
  return response.data;
};

export const getsymptoms = async () => {
  const response = await api.get<symptoms[]>('/symptoms');
  return response.data;
};

export const getServices = async () => {
  const response = await api.get<Services[]>('/services');
  return response.data;
};


