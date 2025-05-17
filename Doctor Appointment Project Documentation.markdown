# مستندات پروژه سایت نوبت‌دهی پزشکان

## مقدمه
این مستندات برای توسعه یک وبسایت نوبت‌دهی پزشکان با استفاده از **React** (با TypeScript)، **Tailwind CSS**، و **JSON Server** برای شبیه‌سازی APIها تهیه شده است. هدف این پروژه ایجاد یک رابط کاربری کاربرپسند برای رزرو نوبت توسط بیماران و یک پنل مدیریت (ادمین پنل) برای مدیریت پزشکان و نوبت‌هاست. این مستندات شامل راه‌اندازی پروژه، ساختار فایل‌ها، ابزارهای استفاده‌شده، مدیریت حالت، و نکات فنی برای توسعه بیشتر است.

---

## 1. ابزارها و تکنولوژی‌ها

### ابزارهای اصلی
- **React**: فریم‌ورک جاوااسکریپت برای ساخت رابط کاربری.
- **TypeScript (TSX)**: برای افزودن تایپ‌های استاتیک به کد و افزایش ایمنی.
- **Tailwind CSS**: برای استایل‌دهی سریع و ریسپانسیو.
- **JSON Server**: برای شبیه‌سازی APIهای RESTful تا آماده شدن APIهای لاراول.
- **Vite**: ابزار باندلینگ سریع برای توسعه وビルد پروژه.

### کتابخانه‌های کمکی
- **Axios**: برای ارسال درخواست‌های HTTP به JSON Server.
- **React Router**: برای مسیریابی بین صفحات.
- **React Query**: برای مدیریت داده‌های سرور (کش، خطاها، و به‌روزرسانی).
- **React Hook Form**: برای مدیریت فرم‌ها.
- **React Datepicker**: برای انتخاب تاریخ و زمان در فرم رزرو.
- **React Toastify**: برای نمایش اعلان‌ها.
- **ESLint و Prettier**: برای استانداردسازی کد.
- **Husky**: برای اجرای اسکریپت‌های lint قبل از کامیت.

---

## 2. راه‌اندازی پروژه

### پیش‌نیازها
- **Node.js** (نسخه 16 یا بالاتر)
- **npm** یا **yarn**
- ویرایشگر کد (مثل VS Code) با افزونه‌های TypeScript و ESLint

### نصب پروژه
1. پروژه را با Vite ایجاد کنید:
   ```bash
   npm create vite@latest doctor-appointment -- --template react-ts
   cd doctor-appointment
   npm install
   ```

2. پکیج‌های مورد نیاز را نصب کنید:
   ```bash
   npm install axios react-router-dom @tanstack/react-query react-hook-form react-toastify react-datepicker
   npm install --save-dev tailwindcss postcss autoprefixer json-server @types/react-router-dom @types/react-datepicker eslint prettier eslint-plugin-react eslint-plugin-react-hooks @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier eslint-plugin-prettier husky
   ```

3. Tailwind CSS را تنظیم کنید:
   ```bash
   npx tailwindcss init -p
   ```
   - فایل `tailwind.config.js`:
     ```js
     /** @type {import('tailwindcss').Config} */
     export default {
       content: ['./index.html', './src/**/*.{ts,tsx}'],
       theme: { extend: {} },
       plugins: []
     };
     ```
   - فایل `src/index.css`:
     ```css
     @tailwind base;
     @tailwind components;
     @tailwind utilities;
     ```

4. ESLint و Prettier را تنظیم کنید:
   - فایل `.eslintrc.json`:
     ```json
     {
       "env": { "browser": true, "es2021": true },
       "extends": [
         "eslint:recommended",
         "plugin:react/recommended",
         "plugin:@typescript-eslint/recommended",
         "plugin:prettier/recommended"
       ],
       "parser": "@typescript-eslint/parser",
       "parserOptions": { "ecmaVersion": 12, "sourceType": "module" },
       "plugins": ["react", "@typescript-eslint", "prettier"],
       "rules": {
         "prettier/prettier": "error",
         "react/prop-types": "off"
       }
     }
     ```
   - فایل `.prettierrc`:
     ```json
     {
       "semi": true,
       "trailingComma": "es5",
       "singleQuote": true,
       "printWidth": 80,
       "tabWidth": 2
     }
     ```

5. Husky را برای lint قبل از کامیت تنظیم کنید:
   ```bash
   npx husky init
   echo "npm run lint" > .husky/pre-commit
   ```
   - اسکریپت lint را به `package.json` اضافه کنید:
     ```json
     "scripts": {
       "lint": "eslint src/**/*.{ts,tsx}"
     }
     ```

6. JSON Server را تنظیم کنید:
   - فایل `db.json` را در ریشه پروژه بسازید:
     ```json
     {
       "doctors": [
         {
           "id": 1,
           "name": "دکتر احمدی",
           "specialty": "قلب و عروق",
           "city": "تهران",
           "availableTimes": [
             { "date": "1404/02/21", "time": "10:00" },
             { "date": "1404/02/21", "time": "11:00" }
           ]
         },
         {
           "id": 2,
           "name": "دکتر حسینی",
           "specialty": "ارتوپدی",
           "city": "شیراز",
           "availableTimes": [{ "date": "1404/02/22", "time": "14:00" }]
         }
       ],
       "appointments": [
         {
           "id": 1,
           "doctorId": 1,
           "patientName": "علی محمدی",
           "date": "1404/02/21",
           "time": "10:00"
         }
       ],
       "specialties": [
         { "id": 1, "name": "قلب و عروق" },
         { "id": 2, "name": "ارتوپدی" }
       ],
       "users": [
         { "id": 1, "name": "علی محمدی", "role": "patient" },
         { "id": 2, "name": "ادمین", "role": "admin" }
       ]
     }
     ```
   - اسکریپت JSON Server را به `package.json` اضافه کنید:
     ```json
     "scripts": {
       "start:server": "json-server --watch db.json --port 3001"
     }
     ```

### اجرای پروژه
1. JSON Server را اجرا کنید:
   ```bash
   npm run start:server
   ```
   - روی `http://localhost:3001` در دسترس است.

2. پروژه React را اجرا کنید:
   ```bash
   npm run dev
   ```
   - روی `http://localhost:5173` در دسترس است.

---

## 3. ساختار پروژه

### ساختار فولدرها
```
doctor-appointment/
├── public/                    # فایل‌های عمومی (مثل favicon)
├── src/
│   ├── assets/               # تصاویر و فایل‌های استاتیک
│   │   └── logo.png
│   ├── components/           # کامپوننت‌های مشترک
│   │   ├── common/          # کامپوننت‌های عمومی
│   │   │   ├── Button.tsx
│   │   │   └── Card.tsx
│   │   ├── appointment/     # کامپوننت‌های رزرو نوبت
│   │   │   ├── BookingForm.tsx
│   │   │   └── Calendar.tsx
│   │   └── admin/           # کامپوننت‌های ادمین پنل
│   │       ├── DoctorTable.tsx
│   │       └── Dashboard.tsx
│   ├── context/             # Contextها برای مدیریت حالت
│   │   ├── DoctorContext.tsx
│   │   └── AuthContext.tsx
│   ├── hooks/               # هوک‌های سفارشی
│   │   ├── useDoctors.ts
│   │   └── useAppointments.ts
│   ├── pages/               # صفحات اصلی
│   │   ├── Home.tsx
│   │   ├── Search.tsx
│   │   ├── DoctorProfile.tsx
│   │   ├── Booking.tsx
│   │   ├── UserProfile.tsx
│   │   └── Admin/
│   │       ├── Dashboard.tsx
│   │       ├── Doctors.tsx
│   │       └── Appointments.tsx
│   ├── services/            # توابع API
│   │   ├── api.ts
│   │   └── mock.ts
│   ├── types/               # تایپ‌های TypeScript
│   │   ├── doctor.ts
│   │   ├── appointment.ts
│   │   └── user.ts
│   ├── utils/               # توابع کمکی
│   │   ├── formatDate.ts
│   │   └── constants.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── db.json
├── tailwind.config.js
├── tsconfig.json
├── eslint.config.js
├── prettier.config.js
├── package.json
└── README.md
```

### توضیحات فولدرها
- **assets/**: برای تصاویر، فونت‌ها، و فایل‌های استاتیک.
- **components/**: کامپوننت‌های قابل‌استفاده مجدد، تقسیم‌شده به عمومی، رزرو، و ادمین.
- **context/**: برای مدیریت حالت‌های جهانی (مثل لیست پزشکان).
- **hooks/**: هوک‌های سفارشی برای منطق‌های تکراری.
- **pages/**: صفحات اصلی سایت و ادمین پنل.
- **services/**: توابع برای ارتباط با JSON Server و بعداً APIهای لاراول.
- **types/**: تایپ‌های TypeScript برای داده‌ها.
- **utils/**: توابع کمکی مثل فرمت تاریخ.

---

## 4. فایل‌های کلیدی و تنظیمات

### فایل تایپ‌ها (`src/types/doctor.ts`)
```ts
export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  city: string;
  availableTimes: { date: string; time: string }[];
}

export interface Appointment {
  id: number;
  doctorId: number;
  patientName: string;
  date: string;
  time: string;
}

export interface Specialty {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  role: 'patient' | 'admin';
}
```

### فایل API (`src/services/api.ts`)
```ts
import axios from 'axios';
import { Doctor, Appointment, Specialty } from '../types/doctor';

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
```

### فایل Context (`src/context/DoctorContext.tsx`)
```ts
import { createContext, useContext, useState, useEffect } from 'react';
import { getDoctors } from '../services/api';
import { Doctor } from '../types/doctor';

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
```

### فایل اصلی (`src/main.tsx`)
```ts
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import './index.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ToastContainer />
    </QueryClientProvider>
  </React.StrictMode>
);
```

### فایل اپلیکیشن (`src/App.tsx`)
```ts
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DoctorProvider } from './context/DoctorContext';
import Home from './pages/Home';
import Search from './pages/Search';
import Booking from './pages/Booking';
import DoctorProfile from './pages/DoctorProfile';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminDoctors from './pages/Admin/Doctors';
import AdminAppointments from './pages/Admin/Appointments';

const App: React.FC = () => {
  return (
    <DoctorProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/doctor/:id" element={<DoctorProfile />} />
          <Route path="/booking/:doctorId" element={<Booking />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/doctors" element={<AdminDoctors />} />
          <Route path="/admin/appointments" element={<AdminAppointments />} />
        </Routes>
      </BrowserRouter>
    </DoctorProvider>
  );
};

export default App;
```

### صفحه اصلی (`src/pages/Home.tsx`)
```ts
import { useDoctors } from '../context/DoctorContext';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { doctors, loading } = useDoctors();

  if (loading) return <div className="text-center">در حال بارگذاری...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">لیست پزشکان</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="border p-4 rounded shadow">
            <h3 className="text-lg font-semibold">{doctor.name}</h3>
            <p>تخصص: {doctor.specialty}</p>
            <p>شهر: {doctor.city}</p>
            <Link
              to={`/doctor/${doctor.id}`}
              className="text-blue-500 hover:underline"
            >
              مشاهده پروفایل
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
```

### فرم رزرو (`src/components/appointment/BookingForm.tsx`)
```ts
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
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
```

---

## 5. مدیریت حالت (State Management)

### استراتژی مدیریت حالت
- **useState**: برای حالت‌های محلی (مثل فرم‌ها).
- **React Context**: برای حالت‌های جهانی (مثل لیست پزشکان و فیلترها).
- **React Query**: برای مدیریت داده‌های سرور (مثل درخواست‌ها به JSON Server).

### نکات
- از Context فقط برای داده‌های واقعاً جهانی استفاده کنید.
- برای فرم‌ها، از React Hook Form استفاده کنید تا کد ساده‌تر بشه.
- React Query برای کش کردن داده‌ها و مدیریت خطاها عالیه.

### مثال با React Query
```ts
import { useQuery } from '@tanstack/react-query';
import { getDoctors } from '../services/api';

const Search: React.FC = () => {
  const { data: doctors, isLoading, error } = useQuery({
    queryKey: ['doctors'],
    queryFn: getDoctors
  });

  if (isLoading) return <div>در حال بارگذاری...</div>;
  if (error) return <div>خطا: {(error as Error).message}</div>;

  return (
    <div className="container mx-auto p-4">
      {doctors?.map((doctor) => (
        <div key={doctor.id}>{doctor.name}</div>
      ))}
    </div>
  );
};

export default Search;
```

---

## 6. نکات فنی برای توسعه بیشتر

### توسعه بخش کاربری
1. **صفحه جستجو (`Search.tsx`)**:
   - فیلترهای تخصص و شهر اضافه کنید.
   - از React Query برای درخواست‌های فیلترشده استفاده کنید:
     ```ts
     const { data } = useQuery({
       queryKey: ['doctors', { specialty, city }],
       queryFn: () => getDoctors({ specialty, city })
     });
     ```

2. **صفحه پروفایل پزشک (`DoctorProfile.tsx`)**:
   - اطلاعات پزشک و زمان‌های موجود رو نمایش بدید.
   - از `getDoctorById` در `api.ts` استفاده کنید.

3. **صفحه رزرو (`Booking.tsx`)**:
   - از `BookingForm.tsx` استفاده کنید.
   - تقویم با `react-datepicker` اضافه کنید:
     ```ts
     import DatePicker from 'react-datepicker';
     import 'react-datepicker/dist/react-datepicker.css';

     <DatePicker selected={date} onChange={(date: Date) => setDate(date)} />;
     ```

4. **صفحه پروفایل کاربر (`UserProfile.tsx`)**:
   - لیست نوبت‌های رزروشده رو نمایش بدید.
   - از endpoint `/appointments` در JSON Server استفاده کنید.

### توسعه ادمین پنل
1. **داشبورد (`Admin/Dashboard.tsx`)**:
   - آمار (مثل تعداد نوبت‌ها) رو با نمودار (مثل Chart.js) نمایش بدید.
2. **مدیریت پزشکان (`Admin/Doctors.tsx`)**:
   - جدول با **MUI DataGrid** یا **Ant Design** بسازید:
     ```bash
     npm install @mui/x-data-grid
     ```
3. **مدیریت نوبت‌ها (`Admin/Appointments.tsx`)**:
   - امکان لغو یا ویرایش نوبت‌ها رو اضافه کنید.

### اتصال به APIهای لاراول
1. URL پایه در `api.ts` رو به آدرس API لاراول تغییر بدید:
   ```ts
   const api = axios.create({
     baseURL: 'https://api.example.com'
   });
   ```
2. مستندات API (مثل Swagger) رو از برنامه‌نویس لاراول بگیرید.
3. تایپ‌ها رو با ساختار پاسخ‌های API هماهنگ کنید.
4. مدیریت احراز هویت (مثل JWT) رو پیاده کنید:
   ```ts
   api.interceptors.request.use((config) => {
     const token = localStorage.getItem('token');
     if (token) config.headers.Authorization = `Bearer ${token}`;
     return config;
   });
   ```

### بهینه‌سازی
- از **useMemo** و **useCallback** برای کاهش رندرهای غیرضروری استفاده کنید.
- برای صفحات سنگین (مثل ادمین)، از **React.lazy** و **Suspense** استفاده کنید:
  ```ts
  const LazyAdmin = React.lazy(() => import('./pages/Admin/Dashboard'));
  ```

### تست
- تست‌های واحد با **Jest** و **React Testing Library** بنویسید:
  ```bash
  npm install --save-dev @testing-library/react @testing-library/jest-dom jest
  ```
- تست‌های End-to-End با **Cypress**:
  ```bash
  npm install --save-dev cypress
  ```

---

## 7. نکات امنیتی
- داده‌های حساس (مثل توکن) رو در **HttpOnly Cookies** ذخیره کنید.
- از **DOMPurify** برای جلوگیری از حملات XSS استفاده کنید:
  ```bash
  npm install dompurify
  ```
- مطمئن شوید API روی **HTTPS** اجرا می‌شه.

---

## 8. مشکلات رایج و عیب‌یابی
- **صفحه خالی**:
  - کنسول مرورگر و ترمینال رو برای خطاها چک کنید.
  - مطمئن شوید `index.html` شامل `<div id="root"></div>` است.
- **خطای TypeScript**:
  - تایپ‌ها رو در `types/` درست تعریف کنید.
  - از `any` به‌صورت موقت برای دیباگ استفاده کنید.
- **JSON Server کار نمی‌کنه**:
  - مطمئن شوید روی پورت 3001 اجرا شده (`http://localhost:3001/doctors`).
  - فایل `db.json` رو برای خطاهای JSON بررسی کنید.

---

## 9. مراحل بعدی
1. **صفحه جستجو**:
   - فیلترهای پیشرفته (مثل تاریخ) اضافه کنید.
   - صفحه‌بندی با پارامترهای JSON Server (`_page` و `_limit`) پیاده کنید.
2. **ادمین پنل**:
   - جدول‌های مدیریت با MUI DataGrid بسازید.
   - نقش‌های دسترسی (admin، doctor) رو پیاده کنید.
3. **تست**:
   - تست‌های واحد برای کامپوننت‌های کلیدی (مثل BookingForm) بنویسید.
4. **اتصال به لاراول**:
   - با برنامه‌نویس بک‌اند هماهنگ کنید و APIها رو تست کنید.

---

## 10. منابع پیشنهادی
- مستندات React: https://reactjs.org
- مستندات TypeScript: https://www.typescriptlang.org
- مستندات Tailwind CSS: https://tailwindcss.com
- مستندات JSON Server: https://github.com/typicode/json-server
- مستندات React Query: https://tanstack.com/query
- آموزش‌های یوتیوب (کانال‌های Traversy Media، The Net Ninja)

---

## 11. نکات نهایی
- پروژه رو با **Git** مدیریت کنید و برنچ‌های جدا برای فیچرها بسازید.
- قبل از لانچ، سایت رو با کاربران واقعی تست کنید.
- بازخوردهای کاربران رو جمع‌آوری کنید و باگ‌ها رو سریع رفع کنید.