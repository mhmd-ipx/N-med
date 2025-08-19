import React from "react";
import type { Appointment } from "../../../../services/Turnapi";

const statusTranslations: Record<string, string> = {
  waiting: "در انتظار",
  canceled: "لغو شده",
  finished: "پایان یافته",
};

const paymentStatusTranslations: Record<string, string> = {
  waiting: "در انتظار پرداخت",
  paid: "پرداخت شده",
  failed: "ناموفق",
};

const AppointmentModal: React.FC<{
  appointment: Appointment;
  onClose: () => void;
}> = ({ appointment, onClose }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const parseAttachments = (attachments: string): string[] => {
    try {
      return JSON.parse(attachments) as string[];
    } catch {
      return [];
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-800">
          جزئیات نوبت
        </h2>
        <div className="grid grid-cols-1 gap-y-3">
          <p className="border-b border-gray-200 pb-2">
            <span className="font-semibold">بیمار:</span>{" "}
            {appointment.patient?.user?.name ??
              `شناسه بیمار: ${appointment.patient_id}`}
          </p>
          <p className="border-b border-gray-200 pb-2">
            <span className="font-semibold">سرویس:</span>{" "}
            {appointment.service?.title ?? "نامشخص"}
          </p>
          <p className="border-b border-gray-200 pb-2">
            <span className="font-semibold">کلینیک:</span>{" "}
            {appointment.service?.clinic?.name ?? "نامشخص"}
          </p>
          <p className="border-b border-gray-200 pb-2">
            <span className="font-semibold">آدرس کلینیک:</span>{" "}
            {appointment.service?.clinic?.address ?? "نامشخص"}
          </p>
          <p className="border-b border-gray-200 pb-2">
            <span className="font-semibold">زمان شروع:</span>{" "}
            {formatDate(appointment.start_date)}
          </p>
          <p className="border-b border-gray-200 pb-2">
            <span className="font-semibold">زمان پایان:</span>{" "}
            {formatDate(appointment.end_date)}
          </p>
          <p className="border-b border-gray-200 pb-2">
            <span className="font-semibold">وضعیت:</span>{" "}
            {statusTranslations[appointment.status] || appointment.status}
          </p>
          <p className="border-b border-gray-200 pb-2">
            <span className="font-semibold">وضعیت پرداخت:</span>{" "}
            {paymentStatusTranslations[appointment.payment_status] ||
              appointment.payment_status}
          </p>
          <p className="border-b border-gray-200 pb-2">
            <span className="font-semibold">توضیحات:</span>{" "}
            {appointment.description ?? "بدون توضیحات"}
          </p>
          {appointment.doctor_description && (
            <p className="border-b border-gray-200 pb-2">
              <span className="font-semibold">توضیحات پزشک:</span>{" "}
              {appointment.doctor_description}
            </p>
          )}
          <p className="border-b border-gray-200 pb-2">
            <span className="font-semibold">قیمت:</span>{" "}
            {(appointment.service?.price ?? 0).toLocaleString("fa-IR")} تومان
          </p>
          {appointment.service?.discount_price && (
            <p>
              <span className="font-semibold">قیمت با تخفیف:</span>{" "}
              {appointment.service?.discount_price.toLocaleString("fa-IR")}{" "}
              تومان
            </p>
          )}
        </div>
        {appointment.attachments && (
          <div className="mt-4">
            <p className="font-semibold">پیوست‌ها:</p>
            <ul className="list-disc pr-6">
              {parseAttachments(appointment.attachments).map(
                (attachment, index) => (
                  <li key={index} className="text-sm text-blue-500 hover:underline">
                    <a href={attachment} target="_blank" rel="noopener noreferrer">
                      فایل {index + 1}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        )}
        <div className="flex justify-center mt-6">
          <button
            className="rounded-lg bg-red-500 px-6 py-2 text-white transition-colors hover:bg-red-600"
            onClick={onClose}
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;