import React, { useState, useEffect } from 'react';
import { getCachedClinics } from '../Clinices/ClinicDataManager.ts';
import { updateService } from '../../../../../services/serverapi.ts';
import type { Clinic, CreateServiceResponse, Service } from '../../../../../types/types.ts';
import FileUpload from '../../../../../components/ui/FileUpload/FileUpload.tsx';

interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onServiceUpdate: (response: CreateServiceResponse) => void;
  service: Service;
  token: string;
}

const EditServiceModal: React.FC<EditServiceModalProps> = ({ isOpen, onClose, onServiceUpdate, service, token }) => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [selectedClinicId, setSelectedClinicId] = useState<number | null>(service.clinic.id);
  const [formData, setFormData] = useState({
    thumbnail: service.thumbnail || '',
    title: service.title || '',
    description: service.description || '',
    price: service.price.toString() || '',
    discount_price: service.discount_price?.toString() || '',
    time: service.time.toString() || '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const cachedClinics = getCachedClinics();
    if (cachedClinics) setClinics(cachedClinics);
  }, []);

  useEffect(() => {
    setSelectedClinicId(service.clinic.id);
    setFormData({
      thumbnail: service.thumbnail || '',
      title: service.title || '',
      description: service.description || '',
      price: service.price.toString() || '',
      discount_price: service.discount_price?.toString() || '',
      time: service.time.toString() || '',
    });
  }, [service]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClinicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClinicId(parseInt(e.target.value));
  };

  const handleThumbnailChange = (url: string | null) => {
    setFormData((prev) => ({ ...prev, thumbnail: url || '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!selectedClinicId) {
      setError('لطفاً یک کلینیک انتخاب کنید');
      setLoading(false);
      return;
    }

    const { title, thumbnail, price, time } = formData;
    if (!title || !thumbnail || !price || !time) {
      setError('لطفاً تمام فیلدهای الزامی را پر کنید');
      setLoading(false);
      return;
    }

    try {
      const serviceResponse = await updateService(service.id, {
        clinic_id: selectedClinicId,
        thumbnail,
        title,
        description: formData.description,
        price: parseInt(price),
        discount_price: formData.discount_price ? parseInt(formData.discount_price) : 0,
        time: parseInt(time),
      });

      onServiceUpdate(serviceResponse);
      setFormData({
        thumbnail: '',
        title: '',
        description: '',
        price: '',
        discount_price: '',
        time: '',
      });
      setSelectedClinicId(null);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای ناشناخته در به‌روزرسانی سرویس');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">ویرایش سرویس</h2>
        {error && (
          <p className="text-red-500 mb-4 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</p>
        )}

        <div className="space-y-6">
          <div className="flex w-full gap-2">
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1 text-gray-700">عنوان</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="عنوان سرویس"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1 text-gray-700">کلینیک</label>
              <select
                value={selectedClinicId || ''}
                onChange={handleClinicChange}
                className="w-full p-2 h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="">انتخاب کلینیک</option>
                {clinics.map((clinic) => (
                  <option key={clinic.id} value={clinic.id}>
                    {clinic.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex w-full gap-2">
            <div className="w-1/3">
              <label className="block text-sm font-medium mb-1 text-gray-700">قیمت (تومان)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full p-2 h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="مثلاً 100000"
                required
              />
            </div>
            <div className="w-1/3">
              <label className="block text-sm font-medium mb-1 text-gray-700">قیمت با تخفیف</label>
              <input
                type="number"
                name="discount_price"
                value={formData.discount_price}
                onChange={handleInputChange}
                className="w-full p-2 h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="مثلاً 80000"
              />
            </div>
            <div className="w-1/3">
              <label className="block text-sm font-medium mb-1 text-gray-700">زمان (دقیقه)</label>
              <input
                type="number"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full p-2 h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="مثلاً 30"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">توضیحات</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="توضیحات سرویس"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">تصویر</label>
            <FileUpload
              layout="horizontal"
              onUrlChange={handleThumbnailChange}
              initialFileUrl={formData.thumbnail !== 'null' ? formData.thumbnail : undefined}
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-3 gap-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
            disabled={loading}
          >
            لغو
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            disabled={loading}
          >
            {loading ? 'در حال به‌روزرسانی...' : 'به‌روزرسانی'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditServiceModal;