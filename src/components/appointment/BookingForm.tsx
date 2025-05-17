import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { createAppointment } from '../../services/api';
import { toast } from 'react-toastify';

interface BookingFormProps {
  doctorId: number;
}

interface FormData {
  patientName: string;
  date: string;
  time: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ doctorId }) => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    try {
      await createAppointment({ ...data, doctorId });
      toast.success('نوبت با موفقیت ثبت شد');
      reset();
    } catch (error) {
      toast.error('خطا در ثبت نوبت');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="block">نام بیمار</label>
        <input
          {...register('patientName', { required: true })}
          className="border p-2 w-full rounded"
        />
      </div>
      <div>
        <label className="block">تاریخ</label>
        <input
          type="date"
          {...register('date', { required: true })}
          className="border p-2 w-full rounded"
        />
      </div>
      <div>
        <label className="block">زمان</label>
        <input
          type="time"
          {...register('time', { required: true })}
          className="border p-2 w-full rounded"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        {loading ? 'در حال ثبت...' : 'رزرو نوبت'}
      </button>
    </form>
  );
};

export default BookingForm;