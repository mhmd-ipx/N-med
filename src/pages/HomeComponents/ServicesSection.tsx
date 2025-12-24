import Servicesimage from '../../assets/images/Services.svg';
import ServiceCard from './ServiceCard'
const ServicesSection = () => {
 return(
    <div className="bg-primary mx-auto mt-20 mb-36 py-8 md:py-16">
            <div className="max-w-[1300px] mx-auto px-4">
                <div className='flex flex-col lg:flex-row gap-6 lg:gap-10 items-center mb-8'>
                    <img
                        src={Servicesimage}
                        alt="خدمات پزشکان"
                        className="h-[200px] md:h-[250px] lg:h-[300px] w-auto max-w-full order-2 lg:order-1"
                    />
                    <div className='flex flex-col text-white gap-4 text-center lg:text-right order-1 lg:order-2'>
                        <h2 className="font-bold text-xl md:text-2xl"> خدمات پزشکان </h2>
                        <p className="text-sm md:text-base leading-relaxed">
                        لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد.
                        </p>
                    </div>
                </div>
                <ServiceCard />
            </div>
    </div>
 )
}
export default ServicesSection;