// کامپوننت‌های پنل بیمار
import Dashboard from './ContetnsComponents/Dashboard/Dashboard';
import EditAccount from './ContetnsComponents/EditAccount/EditAccount';
import Appointments from './ContetnsComponents/Appointments/Appointments';
import References from './ContetnsComponents/References/References';
import LogOut from './LogOut';

// کامپوننت‌های اصلی پنل بیمار
const PatientDashboard = () => <Dashboard />;
const PatientEditAccount = () => <EditAccount />;
const PatientAppointments = () => <Appointments />;
const PatientReferences = () => <References />;
const PatientLogOut = () => <LogOut />;

export {
  PatientDashboard as Dashboard,
  PatientEditAccount as EditAccount,
  PatientAppointments as Appointments,
  PatientReferences as References,
  PatientLogOut as LogOut
};