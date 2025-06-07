import { useState, useEffect } from 'react';
import { createCancellation, getCancellations, updateCancellation, deleteCancellation } from '../../../../../services/serverapi';
import type { Cancellation, CancellationRequest } from '../../../../../types/cancelltypes';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import TimePicker from 'react-multi-date-picker/plugins/time_picker';
import { format, parseISO } from 'date-fns-jalali';
import { HiOutlineTrash, HiOutlinePencil, HiOutlineXCircle, HiOutlineCheckCircle, HiOutlinePlus, HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi2';
import 'react-multi-date-picker/styles/layouts/mobile.css';
import 'react-multi-date-picker/styles/colors/teal.css';

interface CancellationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  clinicId: number;
  onCancellationChange: () => void;
}

const CancellationsModal = ({ isOpen, onClose, userId, clinicId, onCancellationChange }: CancellationsModalProps) => {
  const [cancellations, setCancellations] = useState<Cancellation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CancellationRequest>({
    user_id: userId.toString(),
    start_date: '',
    end_date: '',
    description: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<CancellationRequest | null>(null);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      loadCancellations();
    }
  }, [isOpen, userId]);

  const loadCancellations = async () => {
    setLoading(true);
    try {
      const response = await getCancellations(userId);
      setCancellations(Array.isArray(response) ? response : []);
    } catch (err: any) {
      setError(err.message || 'خطا در بارگذاری کنسلی‌ها');
    } finally {
      setLoading(false);
    }
  };

  const formatToServerDateTime = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCancellation(formData);
      setFormData({ user_id: userId.toString(), start_date: '', end_date: '', description: '' });
      setShowCreateForm(false);
      loadCancellations();
      onCancellationChange();
    } catch (err: any) {
      setError(err.message || 'خطا در ثبت کنسلی');
    }
  };

  const handleEdit = (cancellation: Cancellation) => {
    setEditingId(cancellation.id);
    setEditFormData({
      user_id: cancellation.user_id.toString(),
      start_date: cancellation.start_date,
      end_date: cancellation.end_date,
      description: cancellation.description,
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !editFormData) return;
    
    try {
      await updateCancellation(editingId, editFormData);
      setEditingId(null);
      setEditFormData(null);
      loadCancellations();
      onCancellationChange();
    } catch (err: any) {
      setError(err.message || 'خطا در به‌روزرسانی کنسلی');
    }
  };

  const handleDelete = async (cancelId: number) => {
    if (!window.confirm('آیا مطمئن هستید که می‌خواهید این کنسلی را حذف کنید؟')) return;
    
    try {
      await deleteCancellation(cancelId);
      loadCancellations();
      onCancellationChange();
    } catch (err: any) {
      setError(err.message || 'خطا در حذف کنسلی');
    }
  };

  const formatJalaliDateTime = (dateTime: string): string => {
    try {
      const normalizedDate = dateTime.includes('T') ? dateTime : dateTime.replace(' ', 'T');
      const date = parseISO(normalizedDate);
      return format(date, 'yyyy/MM/dd HH:mm');
    } catch (err) {
      return dateTime;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">مدیریت کنسلی‌ها </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <HiOutlineXCircle size={24} />
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* آکاردئون ثبت کنسلی جدید */}
          <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="w-full flex justify-between items-center p-4 bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <span className="font-medium text-blue-700 flex items-center gap-2">
                <HiOutlinePlus /> ثبت کنسلی جدید
              </span>
              {showCreateForm ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />}
            </button>

            {showCreateForm && (
              <div className="p-4 bg-white">
                <form onSubmit={handleCreate}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className='w-full'>
                      <label className="block text-sm font-medium text-gray-700 mb-1">تاریخ و ساعت شروع</label>
                      <DatePicker
                        value={formData.start_date ? parseISO(formData.start_date) : null}
                        onChange={(date: any) => {
                          if (date) {
                            const jsDate = date.toDate();
                            setFormData({ ...formData, start_date: formatToServerDateTime(jsDate) });
                          }
                        }}
                        calendar={persian}
                        locale={persian_fa}
                        calendarPosition="bottom-right"
                        inputClass="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        format="YYYY/MM/DD HH:mm"
                        plugins={[<TimePicker position="bottom" key="timepicker-start" />]}
                        required
                      />
                    </div>
                    <div className='w-full'>
                      <label className="block text-sm font-medium text-gray-700 mb-1">تاریخ و ساعت پایان</label>
                      <DatePicker
                        value={formData.end_date ? parseISO(formData.end_date) : null}
                        onChange={(date: any) => {
                          if (date) {
                            const jsDate = date.toDate();
                            setFormData({ ...formData, end_date: formatToServerDateTime(jsDate) });
                          }
                        }}
                        calendar={persian}
                        locale={persian_fa}
                        calendarPosition="bottom-right"
                        inputClass="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        format="YYYY/MM/DD HH:mm"
                        plugins={[<TimePicker position="bottom" key="timepicker-end" />]}
                        className='w-full'
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={2}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors w-full"
                  >
                    ثبت کنسلی
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* لیست کنسلی‌ها */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">لیست کنسلی‌ها</h3>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : cancellations.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                کنسلی‌ای ثبت نشده است
              </div>
            ) : (
              <div className="space-y-2">
                {cancellations.map((cancellation) => (
                  <div key={cancellation.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    {editingId === cancellation.id ? (
                      <div className="bg-blue-50">
                        <button
                          onClick={() => setEditingId(null)}
                          className="w-full flex justify-between items-center p-3 bg-blue-100 hover:bg-blue-200 transition-colors"
                        >
                          <span className="font-medium text-primary">در حال ویرایش کنسلی</span>
                          <HiOutlineChevronUp />
                        </button>
                        <div className="p-3">
                          <form onSubmit={handleUpdate}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">تاریخ شروع</label>
                                <DatePicker
                                  value={editFormData?.start_date ? parseISO(editFormData.start_date) : null}
                                  onChange={(date: any) => {
                                    if (date) {
                                      const jsDate = date.toDate();
                                      setEditFormData({ ...editFormData!, start_date: formatToServerDateTime(jsDate) });
                                    }
                                  }}
                                  calendar={persian}
                                  locale={persian_fa}
                                  calendarPosition="bottom-right"
                                  inputClass="w-full border border-gray-300 rounded-md p-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  format="YYYY/MM/DD HH:mm"
                                  plugins={[<TimePicker position="bottom" key="timepicker-edit-start" />]}
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">تاریخ پایان</label>
                                <DatePicker
                                  value={editFormData?.end_date ? parseISO(editFormData.end_date) : null}
                                  onChange={(date: any) => {
                                    if (date) {
                                      const jsDate = date.toDate();
                                      setEditFormData({ ...editFormData!, end_date: formatToServerDateTime(jsDate) });
                                    }
                                  }}
                                  calendar={persian}
                                  locale={persian_fa}
                                  calendarPosition="bottom-right"
                                  inputClass="w-full border border-gray-300 rounded-md p-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  format="YYYY/MM/DD HH:mm"
                                  plugins={[<TimePicker position="bottom" key="timepicker-edit-end" />]}
                                  required
                                />
                              </div>
                            </div>
                            <div className="mb-3">
                              <label className="block text-xs font-medium text-gray-700 mb-1">توضیحات</label>
                              <textarea
                                value={editFormData?.description || ''}
                                onChange={(e) => setEditFormData({ ...editFormData!, description: e.target.value })}
                                className="w-full border border-gray-300 rounded-md p-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows={2}
                                required
                              />
                            </div>
                            <div className="flex gap-2 justify-center">
                              <button
                                type="submit"
                                className="bg-primary text-white px-4 py-2 text-sm rounded-md p-2 flex items-center gap-1"
                              >
                                <HiOutlineCheckCircle size={16} /> ذخیره
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                className="bg-gray-100 text-gray-600 px-4 py-2 text-sm rounded-md  flex items-center gap-1"
                              >
                                <HiOutlineXCircle size={16} /> لغو
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm ">
                              {formatJalaliDateTime(cancellation.start_date)} - {formatJalaliDateTime(cancellation.end_date)}
                            </p>
                            {cancellation.description && (
                              <p className="text-xs text-gray-600 mt-1">{cancellation.description}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(cancellation)}
                              className="text-primary bg-light p-2 rounded-lg flex justify-center items-center text-sm gap-2"
                              title="ویرایش"
                            >
                              <HiOutlinePencil  />
                              ویرایش
                            </button>
                            <button
                              onClick={() => handleDelete(cancellation.id)}
                              className="text-red-600 bg-red-100 rounded-lg p-2"
                              title="حذف"
                            >
                              <HiOutlineTrash size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationsModal;