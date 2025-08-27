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
        accessorFn: (row) => row.patient?.user?.name ?? `-`,
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
           let bgColor;
           let textColor;
           if (status === "waiting") {
             icon = <FaHourglassHalf />;
             bgColor = "bg-yellow-100";
             textColor = "text-yellow-800";
           } else if (status === "canceled") {
             icon = <FaTimes />;
             bgColor = "bg-red-100";
             textColor = "text-red-800";
           } else if (status === "finished") {
             icon = <FaCheck />;
             bgColor = "bg-green-100";
             textColor = "text-green-800";
           } else {
             icon = <FaClock />;
             bgColor = "bg-gray-100";
             textColor = "text-gray-800";
           }
           return (
             <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
               {icon} {statusTranslations[status] || status}
             </span>
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
           let bgColor;
           let textColor;
           if (paymentStatus === "waiting") {
             icon = <FaHourglassHalf />;
             bgColor = "bg-yellow-100";
             textColor = "text-yellow-800";
           } else if (paymentStatus === "paid") {
             icon = <FaMoneyCheck />;
             bgColor = "bg-green-100";
             textColor = "text-green-800";
           } else {
             icon = <FaBan />;
             bgColor = "bg-red-100";
             textColor = "text-red-800";
           }
           return (
             <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
               {icon} {paymentStatusTranslations[paymentStatus] || paymentStatus}
             </span>
           );
         },
      },
      {
        id: "actions",
        header: "عملیات",
        cell: ({ row }) => (
           <button
             className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
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
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-white transition-colors hover:bg-primary"
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? "در حال بارگذاری..." : "بروزرسانی لیست"}
        </button>
      </div>

      {/* Beautiful Filter Section */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
          <h3 className="text-lg font-semibold text-gray-800">فیلترها</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* Search Filter */}
          <div className="relative group">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FaSearch className="w-4 h-4 text-blue-500" />
              جستجوی بیمار
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="نام بیمار را وارد کنید..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
              />
              <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative group">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FaClock className="w-4 h-4 text-green-500" />
              وضعیت نوبت
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md appearance-none"
            >
              {Object.entries(statusTranslations).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          {/* Clinic Filter */}
          <div className="relative group">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FaBan className="w-4 h-4 text-purple-500" />
              کلینیک
            </label>
            <select
              value={clinicFilter}
              onChange={(e) => setClinicFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md appearance-none"
            >
              <option value="all">همه کلینیک‌ها</option>
              {uniqueClinics.map((clinic) => (
                <option key={clinic} value={clinic}>
                  {clinic}
                </option>
              ))}
            </select>
          </div>

          {/* Service Filter */}
          <div className="relative group">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FaCheck className="w-4 h-4 text-orange-500" />
              خدمات
            </label>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md appearance-none"
            >
              <option value="all">همه خدمات</option>
              {uniqueServices.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Status Filter */}
          <div className="relative group">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FaMoneyCheck className="w-4 h-4 text-teal-500" />
              وضعیت پرداخت
            </label>
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md appearance-none"
            >
              {Object.entries(paymentStatusTranslations).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setClinicFilter("all");
              setServiceFilter("all");
              setPaymentStatusFilter("all");
            }}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <FaTimes className="w-4 h-4" />
            پاک کردن فیلترها
          </button>
        </div>
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
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
           <table className="w-full min-w-[700px] border-collapse bg-white">
             <thead>
               {table.getHeaderGroups().map((headerGroup) => (
                 <tr
                   key={headerGroup.id}
                   className="bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                 >
                   {headerGroup.headers.map((header) => (
                     <th
                       key={header.id}
                       className="p-4 text-right font-semibold text-sm"
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
               {table.getRowModel().rows.map((row, index) => (
                 <tr
                   key={row.id}
                   className={`${
                     index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                   } border-b border-gray-100 last:border-0 hover:bg-blue-50 transition-colors duration-150`}
                 >
                   {row.getVisibleCells().map((cell) => (
                     <td key={cell.id} className="p-4 text-right text-sm">
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
          onStatusUpdate={() => {
            fetchAppointments(true); // Refresh the appointments list
            setSelectedAppointment(null); // Close the modal
          }}
        />
      )}
    </div>
  );
};

export default Turns;