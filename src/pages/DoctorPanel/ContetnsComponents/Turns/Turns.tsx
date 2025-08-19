import React, { useState, useEffect, useMemo } from "react";
import { getDoctorAppointments } from "../../../../services/Turnapi";
import type { Appointment } from "../../../../services/Turnapi";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  FaClock,
  FaCheck,
  FaTimes,
  FaMoneyCheck,
  FaBan,
  FaHourglassHalf,
  FaSearch,
} from "react-icons/fa";
import AppointmentModal from "./AppointmentModal"; // Import the separate modal file
import moment from "jalali-moment";

// Translation dictionaries for status and payment status
const statusTranslations: Record<string, string> = {
  all: "همه وضعیت‌ها",
  waiting: "در انتظار",
  canceled: "لغو شده",
  finished: "پایان یافته",
};

const paymentStatusTranslations: Record<string, string> = {
  all: "همه وضعیت‌های پرداخت",
  waiting: "در انتظار پرداخت",
  paid: "پرداخت شده",
  failed: "ناموفق",
};

const Turns: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [clinicFilter, setClinicFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [paymentStatusFilter, setPaymentStatusFilter] =
    useState<string>("all");

  const fetchAppointments = async (forceRefresh: boolean = false) => {
    try {
      if (!forceRefresh) {
        const cachedData = localStorage.getItem("appointments");
        if (cachedData) {
          setAppointments(JSON.parse(cachedData));
          setLoading(false);
          return;
        }
      }
      setLoading(true);
      const data = await getDoctorAppointments();
      setAppointments(data);
      localStorage.setItem("appointments", JSON.stringify(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطایی رخ داد");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleRefresh = () => {
    fetchAppointments(true);
  };

  const uniqueClinics = useMemo(
    () =>
      Array.from(
        new Set(
          appointments.map((app) => app.service?.clinic?.name ?? "نامشخص")
        )
      ),
    [appointments]
  );
  const uniqueServices = useMemo(
    () =>
      Array.from(
        new Set(appointments.map((app) => app.service?.title ?? "نامشخص"))
      ),
    [appointments]
  );
  const uniquePaymentStatuses = useMemo(
    () =>
      Array.from(
        new Set(appointments.map((app) => app.payment_status ?? "نامشخص"))
      ),
    [appointments]
  );
  const uniqueStatuses = ["waiting", "canceled", "finished"];

  const filteredAppointments = useMemo(() => {
    return appointments.filter((app) => {
      const matchesSearch =
        (app.patient?.user?.name ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || app.status === statusFilter;
      const matchesClinic =
        clinicFilter === "all" || app.service?.clinic?.name === clinicFilter;
      const matchesService =
        serviceFilter === "all" || app.service?.title === serviceFilter;
      const matchesPaymentStatus =
        paymentStatusFilter === "all" ||
        app.payment_status === paymentStatusFilter;

      
      return (
        matchesSearch &&
        matchesStatus &&
        matchesClinic &&
        matchesService &&
        matchesPaymentStatus
      );
    });
  }, [
    appointments,
    searchTerm,
    statusFilter,
    clinicFilter,
    serviceFilter,
    paymentStatusFilter,
  ]);

  const columns: ColumnDef<Appointment>[] = useMemo(
    () => [
      {
        accessorFn: (row) => row.patient?.user?.name ?? `شناسه بیمار: ${row.patient_id}`,
        id: "patientName",
        header: "نام کاربر",
      },
      {
        accessorFn: (row) => row.service?.title ?? "نامشخص",
        id: "service",
        header: "خدمات",
      },
      {
        accessorFn: (row) => row.service?.clinic?.name ?? "نامشخص",
        id: "clinic",
        header: "کلینیک",
      },
      {
        accessorFn: (row) => row.start_date,
        id: "startDate",
        header: "تاریخ و ساعت شروع",
        cell: ({ row }) => {
          const date = moment(row.original.start_date);
          return date.locale("fa").format("dddd jDD jMMMM jYYYY - HH:mm");
        },
      },
      {
        accessorFn: (row) => row.status,
        id: "status",
        header: "وضعیت",
        cell: ({ row }) => {
          const status = row.original.status;
          let icon;
          let color;
          if (status === "waiting") {
            icon = <FaHourglassHalf />;
            color = "text-yellow-500";
          } else if (status === "canceled") {
            icon = <FaTimes />;
            color = "text-red-500";
          } else if (status === "finished") {
            icon = <FaCheck />;
            color = "text-green-500";
          } else {
            icon = <FaClock />;
            color = "text-gray-500";
          }
          return (
            <div className={`flex items-center gap-1 ${color}`}>
              {icon} {statusTranslations[status] || status}
            </div>
          );
        },
      },
      {
        accessorFn: (row) => row.payment_status,
        id: "paymentStatus",
        header: "وضعیت پرداخت",
        cell: ({ row }) => {
          const paymentStatus = row.original.payment_status;
          let icon;
          let color;
          if (paymentStatus === "waiting") {
            icon = <FaHourglassHalf />;
            color = "text-yellow-500";
          } else if (paymentStatus === "paid") {
            icon = <FaMoneyCheck />;
            color = "text-green-500";
          } else {
            icon = <FaBan />;
            color = "text-red-500";
          }
          return (
            <div className={`flex items-center gap-1 ${color}`}>
              {icon} {paymentStatusTranslations[paymentStatus] || paymentStatus}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "عملیات",
        cell: ({ row }) => (
          <button
            className="rounded-md bg-blue-500 px-4 py-2 text-white shadow transition-colors hover:bg-blue-600"
            onClick={() => setSelectedAppointment(row.original)}
          >
            مشاهده
          </button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredAppointments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl  text-black">
          لیست نوبت‌های درمانی
        </h1>
        <button
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-white shadow-md transition-colors hover:bg-primary"
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? "در حال بارگذاری..." : "بروزرسانی لیست"}
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <div className="relative">
          <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="جستجوی بیمار..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 pr-10 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
        >
          {Object.entries(statusTranslations).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
        <select
          value={clinicFilter}
          onChange={(e) => setClinicFilter(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
        >
          <option value="all">همه کلینیک‌ها</option>
          {uniqueClinics.map((clinic) => (
            <option key={clinic} value={clinic}>
              {clinic}
            </option>
          ))}
        </select>
        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
        >
          <option value="all">همه خدمات</option>
          {uniqueServices.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
        <select
          value={paymentStatusFilter}
          onChange={(e) => setPaymentStatusFilter(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
        >
          {Object.entries(paymentStatusTranslations).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="py-8 text-center text-lg text-gray-600">
          در حال بارگذاری اطلاعات نوبت‌ها...
        </div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">
          خطا: {error}
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="py-8 text-center text-lg text-gray-500">
          هیچ نوبتی با فیلترهای اعمال شده یافت نشد.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="w-full min-w-[700px] border-collapse bg-white">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="bg-indigo-600 text-white"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="p-4 text-right font-semibold"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-4 text-right">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedAppointment && (
        <AppointmentModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </div>
  );
};

export default Turns;