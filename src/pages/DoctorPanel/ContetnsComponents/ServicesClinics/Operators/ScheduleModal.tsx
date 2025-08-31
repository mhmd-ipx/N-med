import React, { useState } from 'react';
import { createUserSchedules } from '../../../../../services/serverapi'; // Adjust the import path
import './ScheduleModal.css'; // Create this CSS file for styling

interface ScheduleFormData {
  user_id: number;
  data: {
    weekday: string;
    times: {
      clinic_id: number;
      start_date: string;
      end_date: string;
      services: number[];
    }[];
  }[];
}

const ScheduleModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<ScheduleFormData>({
    user_id: 2,
    data: [{
      weekday: 'Tuesday',
      times: [{
        clinic_id: 3,
        start_date: '09:00',
        end_date: '13:00',
        services: [23]
      }]
    }]
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...formData,
        data: formData.data.map(item => ({
          ...item,
          times: item.times.map(time => ({
            ...time,
            start_date: `${time.start_date}:00`,
            end_date: `${time.end_date}:00`
          }))
        }))
      };
      const response = await createUserSchedules(formattedData);
      // console.log('Success:', response);
      setIsOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در ارسال');
    }
  };

  const addTimeSlot = (weekdayIndex: number) => {
    setFormData(prev => {
      const newData = [...prev.data];
      newData[weekdayIndex] = {
        ...newData[weekdayIndex],
        times: [...newData[weekdayIndex].times, {
          clinic_id: 3,
          start_date: '09:00',
          end_date: '13:00',
          services: [23]
        }]
      };
      return { ...prev, data: newData };
    });
  };

  const addWeekday = () => {
    setFormData(prev => ({
      ...prev,
      data: [...prev.data, {
        weekday: 'Friday',
        times: [{
          clinic_id: 3,
          start_date: '09:00',
          end_date: '13:00',
          services: [23]
        }]
      }]
    }));
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>افزودن زمان‌بندی</button>

      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>افزودن زمان‌بندی</h2>
            <form onSubmit={handleSubmit}>
              {formData.data.map((day, dayIndex) => (
                <div key={dayIndex} className="weekday-section">
                  <label>
                    روز هفته:
                    <select
                      value={day.weekday}
                      onChange={e => {
                        const newData = [...formData.data];
                        newData[dayIndex] = { ...newData[dayIndex], weekday: e.target.value };
                        setFormData({ ...formData, data: newData });
                      }}
                    >
                      <option value="Tuesday">سه‌شنبه</option>
                      <option value="Friday">جمعه</option>
                    </select>
                  </label>

                  {day.times.map((time, timeIndex) => (
                    <div key={timeIndex} className="time-slot">
                      <label>
                        شروع:
                        <input
                          type="time"
                          value={time.start_date}
                          onChange={e => {
                            const newData = [...formData.data];
                            newData[dayIndex].times[timeIndex].start_date = e.target.value;
                            setFormData({ ...formData, data: newData });
                          }}
                        />
                      </label>
                      <label>
                        پایان:
                        <input
                          type="time"
                          value={time.end_date}
                          onChange={e => {
                            const newData = [...formData.data];
                            newData[dayIndex].times[timeIndex].end_date = e.target.value;
                            setFormData({ ...formData, data: newData });
                          }}
                        />
                      </label>
                      <button type="button" onClick={() => addTimeSlot(dayIndex)}>افزودن تایم</button>
                    </div>
                  ))}
                </div>
              ))}
              <button type="button" onClick={addWeekday}>افزودن روز</button>
              <button type="submit">ثبت</button>
              <button type="button" onClick={() => setIsOpen(false)}>بستن</button>
              {error && <p className="error">{error}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleModal;