import { Helmet } from 'react-helmet-async';
import Herosection from './HomeComponents/Herosection'
import SearchSection from './HomeComponents/SearchSection'
import BestDoctors from './HomeComponents/BestDoctors'
import ServicesSection from './HomeComponents/ServicesSection'
import SymptomsSection from './HomeComponents/Symptoms'
function Home() {
  return (
    <div className='w-full justify-center items-center flex '> 
      <Helmet>
        <title>صفحه اصلی</title>
      </Helmet>
      <div className='w-full '  >
        <Herosection />
        <SearchSection />
        <SymptomsSection />
        {/*<BestDoctors />*/}
        <ServicesSection />
        
      </div>
    </div>
  );
}
export default Home;
