import { useState, useEffect } from 'react';
import type { Clinic } from '../../../../types/types.ts';
import { updateClinic } from '../../../../services/serverapi.ts';
import { HiOutlineX } from 'react-icons/hi';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L, { LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// آیکون پیش‌فرض Leaflet را تنظیم می‌کنیم
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// محدوده جغرافیایی ایران
const iranBounds = new LatLngBounds(
  [25.064, 44.032], // جنوب غربی
  [39.781, 63.333]  // شمال شرقی
);

interface EditClinicModalProps {
  clinic: Clinic;
  isOpen: boolean;
  onClose: () => void;
  onClinicUpdate: (updatedClinic: Clinic) => void;
  token: string;
}

const EditClinicModal = ({ clinic, isOpen, onClose, onClinicUpdate }: EditClinicModalProps) => {
  const [position, setPosition] = useState(() => {
    const [lat, lng] = clinic.geo ? clinic.geo.split(',').map(Number) : [32.4279, 53.6880]; // مرکز ایران
    return { lat, lng };
  });

  const [formData, setFormData] = useState({
    name: clinic.name,
    address: clinic.address,
    phone: clinic.phone,
    description: clinic.description,
    geo: clinic.geo || `${position.lat},${position.lng}`,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, geo: `${position.lat},${position.lng}` }));
  }, [position]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await updateClinic(clinic.id, formData);

      const updatedClinic: Clinic = {
        ...clinic,
        ...formData,
      };

      onClinicUpdate(updatedClinic);

      const cachedClinics = JSON.parse(localStorage.getItem('clinics_cache') || '{}').clinics || [];
      const updatedClinics = cachedClinics.map((c: Clinic) =>
        c.id === clinic.id ? updatedClinic : c
      );
      localStorage.setItem('clinics_cache', JSON.stringify({
        clinics: updatedClinics,
        timestamp: Date.now(),
      }));

      onClose();
    } catch (err) {
      console.error('Submit error:', err);
      setError('خطا در به‌روزرسانی کلینیک');
    } finally {
      setIsLoading(false);
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10000">
      <div className="bg-white p-6 rounded-2xl w-[900px] relative">
        <button
          className="absolute top-4 left-4 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          <HiOutlineX className="text-xl" />
        </button>
        <h2 className="text-lg font-semibold mb-4">ویرایش کلینیک</h2>
        <form onSubmit={handleSubmit} className=" flex-col gap-4">
          <div className='flex flex-row gap-2'>
            <div className="w-1/2 space-y-4">
              <div>
                <label className="block text-sm font-medium">نام کلینیک</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">آدرس</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">تلفن</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">توضیحات</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <div className="w-1/2">
              <div className="h-[300px] border rounded-xl overflow-hidden">
                <MapContainer
                  center={[position.lat, position.lng]}
                  zoom={6}
                  minZoom={5}
                  maxZoom={10}
                  style={{ height: '100%', width: '100%' }}
                  maxBounds={iranBounds}
                  maxBoundsViscosity={1.0}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[position.lat, position.lng]} />
                  <MapClickHandler />
                </MapContainer>
              </div>
              <div className="mt-2 hidden">
                <label className="block text-sm font-medium">مختصات (lat,lng)</label>
                <input
                  type="text"
                  name="geo"
                  value={formData.geo}
                  readOnly
                  className="w-full p-2 border rounded bg-gray-100"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-4 w-full">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={onClose}
            >
              لغو
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? 'در حال ذخیره...' : 'ذخیره'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClinicModal;
