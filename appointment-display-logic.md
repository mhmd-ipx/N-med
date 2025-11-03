# نحوه نمایش نوبت‌های دریافتی کاربر و عملکرد API

## مقدمه
در بخش "نوبت‌های من" پنل بیمار، نوبت‌ها بر اساس چندین معیار نمایش داده می‌شوند. این سند نحوه عملکرد API و منطق نمایش را توضیح می‌دهد.

## ساختار داده‌ها

### نوع Appointment (از API)
```typescript
interface Appointment {
  id: number;
  patient_id: number;
  user_id: number;
  service_id: number;
  start_date: string; // تاریخ شروع به فرمت ISO
  end_date: string;   // تاریخ پایان به فرمت ISO
  status: "waiting" | "canceled" | "finished";
  payment_status: string;
  description: string;
  doctor_description: string | null;
  service: Service;
  patient: Patient | null;
  // سایر فیلدها...
}
```

### نوع PatientAppointment (برای نمایش)
```typescript
interface PatientAppointment {
  id: number;
  doctorName: string;
  specialty: string;
  clinicName: string;
  clinicAddress: string;
  date: string; // تاریخ شمسی
  time: string; // زمان شروع
  service: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  price: number;
  notes?: string;
}
```

## عملکرد API

### دریافت نوبت‌ها
- **متد**: `GET /api/patient/appointments`
- **احراز هویت**: Bearer Token در هدر Authorization
- **پاسخ**: آرایه‌ای از آبجکت‌های Appointment

```typescript
export const getPatientAppointments = async (): Promise<AppointmentsResponse> => {
  const response = await api.get<AppointmentsResponse>('/api/patient/appointments');
  return response.data;
};
```

### لغو نوبت
- **متد**: `PUT /api/panel/appointments/{appointmentId}`
- **بدنه**: `{ status: 'canceled' }`

## منطق نمایش نوبت‌ها

### 1. بارگذاری داده‌ها
```typescript
useEffect(() => {
  const fetchAppointments = async () => {
    const apiAppointments = await getPatientAppointments();
    const transformedAppointments = apiAppointments.map(transformApiAppointmentToPatientAppointment);
    setAppointments(transformedAppointments);
  };
  fetchAppointments();
}, []);
```

### 2. تبدیل داده‌های API
تابع `transformApiAppointmentToPatientAppointment` داده‌های خام API را به فرمت نمایش تبدیل می‌کند:

- **تاریخ و زمان**: تبدیل از ISO به تاریخ شمسی و زمان محلی
- **وضعیت**: تبدیل از `"waiting"` به `"pending"`، `"finished"` به `"completed"`، `"canceled"` به `"cancelled"`
- **اطلاعات پزشک**: استخراج از `apiAppointment.doctor?.name`
- **اطلاعات کلینیک**: استخراج از `apiAppointment.service?.clinic`
- **خدمات**: `apiAppointment.service?.title`
- **قیمت**: `apiAppointment.service?.price`

### 3. فیلتر کردن
```typescript
const filteredAppointments = appointments.filter(appointment => {
  if (filterStatus === 'all') return true;
  return appointment.status === filterStatus;
});
```

### 4. گروه‌بندی
```typescript
const upcomingAppointments = filteredAppointments.filter(app => app.status === 'pending');
const pastAppointments = filteredAppointments.filter(app =>
  app.status === 'completed' || app.status === 'cancelled'
);
```

### 5. معیارهای نمایش

#### نوبت‌های آینده ("نوبت‌های آینده")
- **وضعیت**: `pending` (معادل `waiting` در API)
- **نمایش**: به صورت کارت‌های گرید
- **امکانات**: مشاهده جزئیات، پرداخت (اگر پرداخت نشده)، لغو نوبت

#### تاریخچه نوبت‌ها ("تاریخچه نوبت‌ها")
- **وضعیت**: `completed` یا `cancelled`
- **نمایش**: به صورت جدول
- **امکانات**: مشاهده جزئیات

### 6. مرتب‌سازی
- **واضح**: نوبت‌های آینده قبل از تاریخچه نمایش داده می‌شوند
- **ضمنی**: بر اساس ترتیب دریافت از API (معمولاً بر اساس تاریخ ایجاد یا شروع نزولی)

## نمودار جریان

```mermaid
graph TD
    A[کامپوننت Appointments] --> B[useEffect - بارگذاری اولیه]
    B --> C[getPatientAppointments()]
    C --> D[GET /api/patient/appointments]
    D --> E[دریافت آرایه Appointment[]]
    E --> F[transformApiAppointmentToPatientAppointment برای هر آیتم]
    F --> G[ذخیره در state appointments]

    G --> H[فیلتر کردن بر اساس filterStatus]
    H --> I[گروه‌بندی به upcoming و past]
    I --> J[نمایش نوبت‌های آینده]
    I --> K[نمایش تاریخچه]

    J --> L[کارت با دکمه‌های پرداخت/لغو]
    K --> M[جدول با دکمه مشاهده]

    L --> N[handleCancelAppointment]
    N --> O[PUT /api/panel/appointments/{id}]
    O --> P[بروزرسانی لیست نوبت‌ها]
```

## نکات مهم

1. **احراز هویت**: تمام درخواست‌ها نیاز به توکن معتبر دارند
2. **تبدیل تاریخ**: از ISO به تاریخ شمسی برای نمایش کاربر
3. **وضعیت‌ها**: تبدیل وضعیت‌های API به وضعیت‌های نمایش
4. **فیلتر**: امکان فیلتر بر اساس وضعیت (همه، در انتظار، انجام شده، لغو شده)
5. **گروه‌بندی**: جدا کردن نوبت‌های فعال از تاریخچه
6. **اکشن‌ها**: پرداخت برای نوبت‌های پرداخت نشده، لغو برای نوبت‌های در انتظار

## خطاها
- خطای 401: عدم احراز هویت
- خطای 403: دسترسی غیرمجاز
- خطای 500: خطای سرور

این منطق اطمینان می‌دهد که کاربر نوبت‌های خود را به صورت سازمان‌یافته و کاربردی مشاهده کند.