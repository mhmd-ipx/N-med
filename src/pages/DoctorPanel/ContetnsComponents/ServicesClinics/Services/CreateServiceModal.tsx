import React, { useState, useEffect } from 'react';
import { getCachedClinics, getCachedOperators } from '../Clinices/ClinicDataManager.ts';
import { createService, addServiceToUser } from '../../../../../services/serverapi.ts';
import type { Clinic, Operator, CreateServiceResponse } from '../../../../../types/types.ts';

interface CreateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onServiceCreate: (response: CreateServiceResponse) => void;
  token: string;
  userid : number;
}

const CreateServiceModal: React.FC<CreateServiceModalProps> = ({ isOpen, onClose, onServiceCreate , userid }) => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [selectedClinicId, setSelectedClinicId] = useState<number | null>(null);
  const [selectedOperatorIds, setSelectedOperatorIds] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    thumbnail: '',
    title: '',
    description: '',
    price: '',
    discount_price: '',
    time: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const cachedClinics = getCachedClinics();
    if (cachedClinics) setClinics(cachedClinics);
  }, []);

  useEffect(() => {
    if (selectedClinicId) {
      const cachedOperators = getCachedOperators(selectedClinicId);
      setOperators(cachedOperators || []);
    } else {
      setOperators([]);
    }
  }, [selectedClinicId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClinicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClinicId(parseInt(e.target.value));
    setSelectedOperatorIds([]);
  };

  const handleOperatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => parseInt(option.value));
    setSelectedOperatorIds(selectedOptions);
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
      const serviceResponse = await createService({
        clinic_id: selectedClinicId,
        thumbnail,
        title,
        description: formData.description,
        price: parseInt(price),
        discount_price: formData.discount_price ? parseInt(formData.discount_price) : 0,
        time: parseInt(time),
        user_id: userid,
      });

      for (const operatorId of selectedOperatorIds) {
        await addServiceToUser(operatorId, serviceResponse.data.id);
      }

      onServiceCreate(serviceResponse);
      setFormData({
        thumbnail: '',
        title: '',
        description: '',
        price: '',
        discount_price: '',
        time: '',
      });
      setSelectedClinicId(null);
      setSelectedOperatorIds([]);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای ناشناخته در ایجاد سرویس');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6">
        <h2 className="text-xl font-bold mb-4 text-center">افزودن سرویس جدید</h2>
        {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">کلینیک</label>
              <select
                value={selectedClinicId || ''}
                onChange={handleClinicChange}
                className="w-full p-2 border rounded"
              >
                <option value="">انتخاب کلینیک</option>
                {clinics.map((clinic) => (
                  <option key={clinic.id} value={clinic.id}>
                    {clinic.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">اوپراتورها</label>
              <select
                multiple
                value={selectedOperatorIds.map(String)}
                onChange={handleOperatorChange}
                disabled={!selectedClinicId}
                className="w-full p-2 border rounded h-[92px]"
              >
                {operators.map((operator) => (
                  <option key={operator.operator_id} value={operator.user_id}>
                    {operator.nickname} ({operator.phone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">عنوان</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="عنوان سرویس"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">URL تصویر</label>
              <input
                type="text"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="لینک تصویر"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">قیمت (تومان)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="مثلاً 100000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">قیمت با تخفیف</label>
              <input
                type="number"
                name="discount_price"
                value={formData.discount_price}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="مثلاً 80000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">زمان (دقیقه)</label>
              <input
                type="number"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="مثلاً 30"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">توضیحات</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="توضیحات سرویس"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
              disabled={loading}
            >
              لغو
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? 'در حال ثبت...' : 'ثبت'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateServiceModal;
