import type { Services, Doctor, provinces } from '../../../types/types';
import { HiOutlineLocationMarker } from "react-icons/hi";
import Button from '../Button';
import { Link } from "react-router-dom";

interface SingleServiceCardProps {
  service: Services;
  doctor: Doctor | undefined;
  province: provinces | undefined;
}

const SingleServiceCard = ({ service, doctor, province }: SingleServiceCardProps) => {
  if (!doctor) return null;

  const discountAmount = service.price - service.discountedPrice;
  const discountPercentage = ((1 - service.discountedPrice / service.price) * 100).toFixed(0);

  return (
    <Link
      to={`/service/${service.id}`}
     
    >
    <div className="flex w-full flex-col bg-white border border-light hover:bg-light text-black rounded-2xl p-3 items-center justify-between shadow-lg">
      <div className='flex gap-4 w-full'>
        <img src={service.imageUrl} alt={service.name} className="w-20 h-20 object-cover rounded-xl" />
        <div className='flex flex-1 flex-col justify-between'>
          <h3 className='text-base font-bold'>{service.name}</h3>
          <div className='flex justify-between mt-2'>
            <div className='flex items-center justify-center gap-2'>
              <img src={doctor.imageUrl} alt={doctor.name} className="w-9 h-9 object-cover rounded-full" />
              <p className="text-sm">{doctor.name}</p>
            </div>
            <div className='flex flex-row items-center text-sm gap-1 text-gray-500'>
              <HiOutlineLocationMarker className='text-lg'/>
              <p>{province ? province.name : 'نامشخص'}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-full h-2 my-2">
        <div className="absolute top-1/2 w-full border-t border-light"></div>
      </div>
      <div className='flex justify-between w-full items-center'>
        <Button
          variant="outline"
          iconAlignment="start"
          size="sm"
          className="text-sm px-4"
        >
          نوتاش رزرو
        </Button>
        <div>
          {service.discountedPrice > 0 && discountAmount > 0 ? (
            <div className='flex items-center gap-2'>
              <span className='text-gray-500 text-xs line-through'>{service.price.toLocaleString()}</span>
              <div className='flex items-center'>
                <span className="font-bold text-xl">
                  {discountAmount.toLocaleString()}
                </span>
                <span className="text-sm mr-1">تومان</span>
              </div>
              <span className='bg-red-500 rounded-2xl p-1 px-2 text-white'>{discountPercentage}%</span>
            </div>
          ) : (
            <div>
              <span className="font-bold text-xl">
                {service.price.toLocaleString()}
              </span>
              <span className="text-sm mr-1">تومان</span>
            </div>
          )}
        </div>
      </div>
    </div>
    </Link>

  );
};

export default SingleServiceCard;