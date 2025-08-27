
import herosectionimage from '../../assets/images/hero-section-image.svg';
const Herosection = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full bg-primary pb-16 md:pb-32">
            <div className='max-w-[1300px] mx-auto px-4'>
                <img
                    src={herosectionimage}
                    alt="نوتاش - پلتفرم نوبت‌دهی آنلاین"
                    className="h-[250px] md:h-[350px] lg:h-[400px] w-auto max-w-full"
                />
            </div>
        </div>
    );
}

export default Herosection;