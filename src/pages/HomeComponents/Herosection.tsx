
import herosectionimage from '../../assets/images/hero-section-image.png';
const Herosection = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full bg-primary pb-16 md:pb-32">
            <div className='max-w-[1300px] mx-auto px-4'>
                <img
                    src={herosectionimage}
                    alt="نوتاش - پلتفرم نوبت‌دهی آنلاین"
                    className="w-full max-w-full mb-4 md:mb-0 h-auto object-contain md:h-[350px] lg:h-[400px]"
                />
            </div>
        </div>
    );
}

export default Herosection;