import type { ProfileInfoProps } from '../../../../types/types.ts';
import Clinics from './Clinices/Clinics.tsx';


const ServicesClinics = ({ user, token }: ProfileInfoProps) => (
  <div className="p-0">
    
    <Clinics user={user} token={token} />

  </div>
);

export default ServicesClinics;