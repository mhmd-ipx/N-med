import Servicesimage from '../../assets/images/Services.png';
import ServiceCard from './ServiceCard'
const ServicesSection = () => {
    return (
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
                            خدمات دندانپزشکی را ساده، سریع و مطمئن انتخاب کنید؛ از چکاپ و جرم‌گیری تا ترمیم، درمان ریشه، زیبایی، ایمپلنت و ارتودنسی. در این بخش می‌توانید هر خدمت را با جزئیات ببینید: معرفی پزشک و تخصص، شهر و موقعیت روی نقشه، امتیاز و تجربه کاربران، حدود قیمت، توضیحات تکمیلی و نزدیک‌ترین زمان‌های آزاد برای نوبت‌گیری. هدف ما این است که قبل از رزرو، تصویر روشنی از روند درمان، هزینه‌های احتمالی و کیفیت خدمات داشته باشید تا انتخابتان آگاهانه باشد. کافیست خدمت موردنظر را جستجو کنید، گزینه‌ها را مقایسه کنید و بدون تماس‌های طولانی، نوبت خود را آنلاین ثبت کنید. شفافیت اطلاعات، دسترسی سریع و تصمیم‌گیری راحت‌تر، همان چیزی است که اینجا برای شما فراهم شده است.                        </p>
                    </div>
                </div>
                <ServiceCard />
            </div>
        </div>
    )
}
export default ServicesSection;