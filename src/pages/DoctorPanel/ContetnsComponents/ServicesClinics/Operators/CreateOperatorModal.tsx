import { useState } from 'react';
import { createAndAssignOperator } from '../../../../../services/serverapi.ts';
import type { CreateAndAssignOperatorResponse } from '../../../../../types/types.ts';

interface CreateOperatorModalProps {
  clinicId: number;
  isOpen: boolean;
  onClose: () => void;
  onOperatorCreate: (response: CreateAndAssignOperatorResponse) => void;
  token: string;
}

const CreateOperatorModal = ({ clinicId, isOpen, onClose, onOperatorCreate, token }: CreateOperatorModalProps) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !phone) {
      setError('لطفاً نام و شماره تلفن را وارد کنید');
      return;
    }

    setLoading(true);
    try {
      const response = await createAndAssignOperator(clinicId, name, phone);
      onOperatorCreate(response);
      setName('');
      setPhone('');
      setError(null);
      onClose();
    } catch (err) {
      setError('خطا در ایجاد اوپراتور');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">ایجاد اوپراتور جدید</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">نام اوپراتور</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="نام اوپراتور را وارد کنید"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">شماره تلفن</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="شماره تلفن را وارد کنید"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            onClick={onClose}
            disabled={loading}
          >
            لغو
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'در حال ایجاد...' : 'ایجاد'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateOperatorModal;